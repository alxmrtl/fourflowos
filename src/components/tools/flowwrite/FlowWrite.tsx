'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlowWriteStore } from './useFlowWriteStore';
import {
  SAMPLE_INTERVAL_MS, RATE_WINDOW_MS, RATE_FULL, STALL_THRESHOLD_MS, WORD_STEP,
} from './constants';
import type { FlowWriteSession, TargetMode, WritePhase } from './types';
import { CORAL, SAGE, STEEL, AMETHYST, GRADIENTS } from '@/styles/brand-colors';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

/*
 * FlowWrite — momentum writing. CONSUME has FlowRead (words in);
 * CREATE has FlowWrite (words out). Trains the Generative Story Key.
 *
 * A brain-dump / first-draft engine, not a notebook. Drops straight into the
 * writing surface; pick a target (Time · Words · Open) inline, write without
 * editing, then copy and reset. Momentum is felt continuously — the text
 * brightens as you flow and a colour aura drifts through the four Dimensions.
 * Hitting a target celebrates but never stops you mid-sentence. Text never
 * leaves the browser; only session stats sync to Supabase (table
 * `flowwrite_sessions` — same pattern as `focus_sessions`).
 */

const countWords = (text: string) => (text.trim().match(/\S+/g) ?? []).length;

function formatTime(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, '0')}`;
}

// ── Colour-momentum helpers — drift the aura through the four Dimension hues ──
const PILLARS = [CORAL, SAGE, STEEL, AMETHYST];
const hexToRgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
/** A colour cycling smoothly around the four pillars; `phase` advances with momentum. */
function pillarAt(phase: number) {
  const p = ((phase % 1) + 1) % 1;
  const seg = p * PILLARS.length;
  const i = Math.floor(seg) % PILLARS.length;
  const j = (i + 1) % PILLARS.length;
  const t = seg - Math.floor(seg);
  const [r1, g1, b1] = hexToRgb(PILLARS[i]);
  const [r2, g2, b2] = hexToRgb(PILLARS[j]);
  return `rgb(${mix(r1, r2, t)}, ${mix(g1, g2, t)}, ${mix(b1, b2, t)})`;
}

/** Draw a flow trace waveform onto a canvas: samples are 0–1 intensities. */
function drawTrace(canvas: HTMLCanvasElement, samples: number[]) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  if (samples.length < 2) return;

  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, CORAL);
  grad.addColorStop(0.34, SAGE);
  grad.addColorStop(0.67, STEEL);
  grad.addColorStop(1, AMETHYST);

  const mid = h / 2;
  const amp = h * 0.42;
  const step = w / (samples.length - 1);

  // Mirrored waveform — a breathing band around the centerline.
  ctx.beginPath();
  samples.forEach((s, i) => {
    const y = mid - s * amp;
    if (i === 0) ctx.moveTo(0, y);
    else ctx.lineTo(i * step, y);
  });
  for (let i = samples.length - 1; i >= 0; i--) {
    ctx.lineTo(i * step, mid + samples[i] * amp);
  }
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.globalAlpha = 0.22;
  ctx.fill();

  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  samples.forEach((s, i) => {
    const y = mid - s * amp;
    if (i === 0) ctx.moveTo(0, y);
    else ctx.lineTo(i * step, y);
  });
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

export default function FlowWrite({ embedded }: { embedded?: boolean } = {}) {
  const store = useFlowWriteStore();
  const { user } = useAuth();

  const [phase, setPhase] = useState<WritePhase>('writing');
  const [text, setText] = useState('');
  const [remaining, setRemaining] = useState(() => 10 * 60);
  const [paused, setPaused] = useState(false);
  const [editingTarget, setEditingTarget] = useState(false);
  const [lastSession, setLastSession] = useState<FlowWriteSession | null>(null);
  const [copied, setCopied] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [targetReached, setTargetReached] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const liveTraceRef = useRef<HTMLCanvasElement>(null);
  const finalTraceRef = useRef<HTMLCanvasElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  // Session tracking (refs — no re-renders on keystrokes)
  const keystrokesRef = useRef<number[]>([]);
  const samplesRef = useRef<number[]>([]);
  const lastKeyRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const durationSecRef = useRef<number>(600);
  const pausedMsRef = useRef<number>(0);
  const pauseStartRef = useRef<number>(0); // 0 when running; timestamp while paused
  const statsRef = useRef({ stalls: 0, peakStreakMs: 0, streakStart: 0, stalled: false });
  const momentumPhaseRef = useRef<number>(0);
  const textRef = useRef('');
  const endedRef = useRef(false);
  const startedRef = useRef(false);
  const targetReachedRef = useRef(false);

  const mode = store.settings.targetMode;

  /** Elapsed writing seconds, excluding paused time (including an open pause). */
  const elapsedSec = useCallback((now: number) => {
    let pausedMs = pausedMsRef.current;
    if (pauseStartRef.current) pausedMs += now - pauseStartRef.current;
    return (now - startRef.current - pausedMs) / 1000;
  }, []);

  /** Re-arm the target so a fresh goal can be reached again (after edits/mode swaps). */
  const rearm = useCallback(() => {
    targetReachedRef.current = false;
    setTargetReached(false);
  }, []);

  // ── Begin a session (blank, or continuing existing text) ──
  const begin = useCallback((initialText: string) => {
    const now = performance.now();
    keystrokesRef.current = [];
    samplesRef.current = [];
    lastKeyRef.current = now;
    startRef.current = now;
    durationSecRef.current = store.settings.durationMinutes * 60;
    pausedMsRef.current = 0;
    pauseStartRef.current = now; // start paused — the clock only moves once you engage
    statsRef.current = { stalls: 0, peakStreakMs: 0, streakStart: now, stalled: false };
    momentumPhaseRef.current = 0;
    endedRef.current = false;
    startedRef.current = true;
    setText(initialText);
    textRef.current = initialText;
    store.setDraft(initialText);
    setRemaining(durationSecRef.current);
    setPaused(true);
    setEditingTarget(false);
    setCopied(false);
    rearm();
    if (textareaRef.current) textareaRef.current.style.opacity = '1';
    if (auraRef.current) auraRef.current.style.opacity = '0';
    setPhase('writing');
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, [store.setDraft, store.settings.durationMinutes, rearm]);

  // ── Copy current text ──
  const copyText = useCallback((value: string) => {
    if (!value.trim()) return;
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  // ── Pause / resume ──
  const togglePause = useCallback(() => {
    setPaused(p => {
      const now = performance.now();
      if (!p) {
        // pausing — freeze the clock and settle the surface
        pauseStartRef.current = now;
        if (textareaRef.current) textareaRef.current.style.opacity = '1';
        if (auraRef.current) auraRef.current.style.opacity = '0';
      } else {
        // resuming — don't count the paused gap as silence or a stall
        pausedMsRef.current += now - pauseStartRef.current;
        pauseStartRef.current = 0;
        lastKeyRef.current = now;
        statsRef.current.streakStart = now;
        statsRef.current.stalled = false;
        setTimeout(() => textareaRef.current?.focus(), 30);
      }
      return !p;
    });
  }, []);

  // ── Target mode + amount ──
  const setMode = useCallback((m: TargetMode) => {
    store.setSettings({ targetMode: m });
    setEditingTarget(false);
    rearm();
  }, [store.setSettings, rearm]);

  const setDuration = useCallback((minutes: number) => {
    const m = Math.max(1, Math.min(120, Math.round(minutes)));
    durationSecRef.current = m * 60;
    store.setSettings({ durationMinutes: m });
    setRemaining(Math.max(0, durationSecRef.current - elapsedSec(performance.now())));
    rearm();
  }, [store.setSettings, elapsedSec, rearm]);

  const setWordTarget = useCallback((words: number) => {
    const w = Math.max(WORD_STEP, Math.min(5000, Math.round(words / WORD_STEP) * WORD_STEP));
    store.setSettings({ wordTarget: w });
    rearm();
  }, [store.setSettings, rearm]);

  const adjustTarget = useCallback((delta: number) => {
    if (mode === 'time') setDuration(Math.round(durationSecRef.current / 60) + delta);
    else setWordTarget(store.settings.wordTarget + delta * WORD_STEP);
  }, [mode, setDuration, setWordTarget, store.settings.wordTarget]);

  // ── Finish (always user-initiated) ──
  const finish = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    setFullscreen(false);

    const now = performance.now();
    const stats = statsRef.current;
    if (!stats.stalled && stats.streakStart) {
      stats.peakStreakMs = Math.max(stats.peakStreakMs, now - stats.streakStart);
    }

    // Downsample the trace to a compact signature.
    const raw = samplesRef.current;
    const target = 160;
    const trace = raw.length <= target ? [...raw] : Array.from({ length: target }, (_, i) => {
      const start = Math.floor((i / target) * raw.length);
      const end = Math.max(start + 1, Math.floor(((i + 1) / target) * raw.length));
      let max = 0;
      for (let k = start; k < end; k++) max = Math.max(max, raw[k]);
      return max;
    });

    const elapsed = elapsedSec(now);
    const session: FlowWriteSession = {
      id: `fw_${Date.now()}`,
      startedAt: Date.now() - elapsed * 1000,
      durationMinutes: Math.round((elapsed / 60) * 10) / 10,
      words: countWords(textRef.current),
      peakStreakSeconds: Math.round(stats.peakStreakMs / 1000),
      stallCount: stats.stalls,
      trace,
    };

    setLastSession(session);
    store.addSession(session);
    setPhase('complete');

    if (user) {
      getSupabaseBrowser()
        .from('flowwrite_sessions')
        .insert({
          user_id: user.id,
          duration_minutes: session.durationMinutes,
          words: session.words,
          peak_streak_seconds: session.peakStreakSeconds,
          stall_count: session.stallCount,
          started_at: new Date(session.startedAt).toISOString(),
        })
        .then(({ error }) => {
          if (error) console.error('[FlowWrite] session sync failed:', error.message);
        });
    }
  }, [store.addSession, user, elapsedSec]);

  // ── Drop straight in: start a session once the store has hydrated ──
  useEffect(() => {
    if (!store.mounted || startedRef.current) return;
    begin(store.draft);
  }, [store.mounted, store.draft, begin]);

  // ── Writing loop: timer, sampling, stall detection, momentum visuals ──
  useEffect(() => {
    if (phase !== 'writing' || paused) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const momentumOn = store.settings.flowMode && !reducedMotion;

    // Neutralize the surface when momentum visuals are off.
    if (!momentumOn) {
      if (textareaRef.current) textareaRef.current.style.opacity = '1';
      if (auraRef.current) auraRef.current.style.opacity = '0';
    }

    const sampler = setInterval(() => {
      if (!startedRef.current) return;
      const now = performance.now();

      // Trace sample: keystroke rate over the trailing window → 0–1 intensity.
      const cutoff = now - RATE_WINDOW_MS;
      keystrokesRef.current = keystrokesRef.current.filter(t => t > cutoff);
      const rate = keystrokesRef.current.length / (RATE_WINDOW_MS / 1000);
      const intensity = Math.min(1, rate / RATE_FULL);
      samplesRef.current.push(intensity);

      // Stall bookkeeping (for stats).
      const silence = now - lastKeyRef.current;
      const stats = statsRef.current;
      if (!stats.stalled && silence > STALL_THRESHOLD_MS) {
        stats.stalled = true;
        stats.stalls++;
        stats.peakStreakMs = Math.max(stats.peakStreakMs, (now - silence) - stats.streakStart);
      } else if (stats.stalled && silence < 1000) {
        stats.stalled = false;
        stats.streakStart = now;
      }

      // Momentum visuals — text luminance + drifting colour aura.
      if (momentumOn) {
        const reached = targetReachedRef.current;
        momentumPhaseRef.current += intensity * 0.025;
        if (textareaRef.current) {
          textareaRef.current.style.opacity = String(0.55 + intensity * 0.45);
        }
        if (auraRef.current) {
          auraRef.current.style.background =
            `radial-gradient(58% 50% at 50% 42%, ${pillarAt(momentumPhaseRef.current)}, transparent 72%)`;
          auraRef.current.style.opacity = String(reached
            ? Math.min(0.7, 0.3 + intensity * 0.5)
            : intensity * 0.5);
        }
      }

      // Words target — reached but never force-stops.
      if (mode === 'words' && !targetReachedRef.current
          && countWords(textRef.current) >= store.settings.wordTarget) {
        targetReachedRef.current = true;
        setTargetReached(true);
      }

      // Live trace — last ~90 seconds.
      if (liveTraceRef.current) {
        drawTrace(liveTraceRef.current, samplesRef.current.slice(-Math.floor(90000 / SAMPLE_INTERVAL_MS)));
      }
    }, SAMPLE_INTERVAL_MS);

    const timer = setInterval(() => {
      if (!startedRef.current) return;
      const left = durationSecRef.current - elapsedSec(performance.now());
      setRemaining(left);
      // Time target — celebrate at zero, keep the surface live.
      if (mode === 'time' && left <= 0 && !targetReachedRef.current) {
        targetReachedRef.current = true;
        setTargetReached(true);
      }
    }, 1000);

    return () => {
      clearInterval(sampler);
      clearInterval(timer);
    };
  }, [phase, paused, mode, store.settings.flowMode, store.settings.wordTarget, elapsedSec]);

  // Esc exits fullscreen.
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen]);

  // Render the final signature once complete.
  useEffect(() => {
    if (phase === 'complete' && lastSession && finalTraceRef.current) {
      drawTrace(finalTraceRef.current, lastSession.trace);
    }
  }, [phase, lastSession]);

  if (!store.mounted) return null;

  const fontFamily = store.settings.fontStyle === 'serif'
    ? 'var(--font-cormorant), Georgia, serif'
    : 'var(--font-dm-sans), system-ui, sans-serif';
  const durationMin = Math.round(durationSecRef.current / 60);
  const wordCount = countWords(text);

  const traceLabel = targetReached
    ? 'you made it — finish when you’re ready'
    : paused ? (wordCount === 0 ? 'ready when you are' : 'paused') : 'your flow trace';

  return (
    <div className={`relative ${embedded ? '' : 'flex-1'} text-white flex flex-col`}>
      <AnimatePresence mode="wait">

        {/* ── WRITING ── */}
        {phase === 'writing' && (
          <motion.div
            key="writing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={fullscreen ? 'fixed inset-0 z-[60] bg-ground flex flex-col' : 'relative flex-1 flex flex-col min-h-[70vh]'}
          >
            {/* Ambient colour aura — the overall flow of momentum, behind everything */}
            <div
              ref={auraRef}
              className="absolute inset-0 pointer-events-none blur-2xl"
              style={{ opacity: 0, transition: 'opacity 0.6s ease, background 0.6s ease' }}
              aria-hidden="true"
            />

            {/* Centered writing column — toolbox, text, and wave share one width */}
            <div className="relative z-10 w-full max-w-2xl mx-auto flex-1 flex flex-col px-6">

              {/* Toolbox — target on the left, actions on the right; identical in/out of full focus */}
              <div className={`relative z-10 flex items-center justify-between gap-4 border-b border-white/[0.06] text-[11px] text-white/35 tracking-wide ${fullscreen ? 'pt-6 pb-3' : 'pt-4 pb-3'}`}>
                {/* Target cluster */}
                <div className="flex items-center gap-2.5">
                  {/* Mode toggle */}
                  <div className="flex items-center rounded-full border border-white/10 p-0.5">
                    {(['time', 'words', 'open'] as TargetMode[]).map(m => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider transition-colors ${mode === m ? 'bg-white/12 text-white/85' : 'text-white/35 hover:text-white/65'}`}
                      >
                        {m === 'time' ? 'Time' : m === 'words' ? 'Words' : 'Open'}
                      </button>
                    ))}
                  </div>

                  {/* Amount / progress */}
                  {mode === 'open' ? (
                    <span className="tabular-nums text-[12px] text-white/55">{wordCount} words</span>
                  ) : editingTarget ? (
                    <span className="flex items-center gap-1.5">
                      <button onClick={() => adjustTarget(-1)} aria-label="Less" className="flex items-center justify-center w-5 h-5 rounded border border-white/15 text-white/60 hover:text-white hover:border-white/35 transition-colors leading-none">−</button>
                      <span className="tabular-nums text-white/80 w-12 text-center text-[12px]">{mode === 'time' ? `${durationMin}m` : store.settings.wordTarget}</span>
                      <button onClick={() => adjustTarget(1)} aria-label="More" className="flex items-center justify-center w-5 h-5 rounded border border-white/15 text-white/60 hover:text-white hover:border-white/35 transition-colors leading-none">+</button>
                      <button onClick={() => setEditingTarget(false)} aria-label="Done editing target" className="ml-0.5 text-white/40 hover:text-white/80 transition-colors">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setEditingTarget(true)}
                      title={mode === 'time' ? 'Set duration' : 'Set word goal'}
                      className="tabular-nums text-[12px] text-white/70 hover:text-white/90 transition-colors underline-offset-4 decoration-dotted decoration-white/30 hover:underline"
                    >
                      {mode === 'time' ? formatTime(remaining) : `${wordCount} / ${store.settings.wordTarget}`}
                    </button>
                  )}

                  {/* Start / pause — sits to the right of the target */}
                  <button
                    onClick={togglePause}
                    title={paused ? 'Start' : 'Pause'}
                    aria-label={paused ? 'Start' : 'Pause'}
                    className="flex items-center justify-center w-6 h-6 rounded-full border border-white/15 text-white/75 hover:text-white hover:border-white/40 transition-colors"
                  >
                    {paused ? (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    ) : (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                    )}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {/* Settings popover */}
                  <div className="relative">
                    <button
                      onClick={() => setSettingsOpen(o => !o)}
                      title="Settings"
                      aria-label="Settings"
                      className={`transition-colors ${settingsOpen ? 'text-white/80' : 'text-white/35 hover:text-white/80'}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                    </button>
                    <AnimatePresence>
                      {settingsOpen && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setSettingsOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-7 z-40 w-48 rounded-xl border border-white/10 bg-black/85 backdrop-blur-xl p-3 space-y-3"
                          >
                            <button
                              onClick={() => store.setSettings({ flowMode: !store.settings.flowMode })}
                              className="w-full flex items-center justify-between text-[12px] text-white/60 hover:text-white/85 transition-colors"
                            >
                              <span>Momentum glow</span>
                              <span className="relative w-8 h-4 rounded-full transition-colors flex-shrink-0" style={{ background: store.settings.flowMode ? SAGE : 'rgba(255,255,255,0.14)' }}>
                                <span className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all" style={{ left: store.settings.flowMode ? 16 : 2 }} />
                              </span>
                            </button>
                            <button
                              onClick={() => store.setSettings({ fontStyle: store.settings.fontStyle === 'serif' ? 'sans' : 'serif' })}
                              className="w-full flex items-center justify-between text-[12px] text-white/60 hover:text-white/85 transition-colors"
                            >
                              <span>Typeface</span>
                              <span className="text-white/45">{store.settings.fontStyle === 'serif' ? 'Serif' : 'Sans'}</span>
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={() => copyText(text)}
                    title="Copy text"
                    aria-label="Copy text"
                    className="flex items-center gap-1.5 text-white/35 hover:text-white/80 transition-colors"
                    style={copied ? { color: SAGE } : undefined}
                  >
                    {copied ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
                    )}
                    <span className="text-[10px]" style={{ width: copied ? 'auto' : 0, overflow: 'hidden' }}>{copied ? 'Copied' : ''}</span>
                  </button>
                  <button
                    onClick={finish}
                    className="px-3 py-1 rounded-full border border-white/15 text-[11px] text-white/65 hover:text-white hover:border-white/30 transition-colors"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => setFullscreen(f => !f)}
                    title={fullscreen ? 'Exit full focus (Esc)' : 'Full focus'}
                    aria-label={fullscreen ? 'Exit full focus' : 'Full focus'}
                    className="text-white/35 hover:text-white/80 transition-colors"
                  >
                    {fullscreen ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3M16 3v3a2 2 0 0 0 2 2h3M8 21v-3a2 2 0 0 0-2-2H3M16 21v-3a2 2 0 0 1 2-2h3" /></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Body — the writing surface; opacity tracks momentum */}
              <div className="relative flex-1 flex flex-col">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={e => {
                    if (paused) togglePause(); // typing starts the clock
                    const now = performance.now();
                    keystrokesRef.current.push(now);
                    lastKeyRef.current = now;
                    setText(e.target.value);
                    textRef.current = e.target.value;
                    store.setDraft(e.target.value);
                  }}
                  placeholder="Don't think. Type."
                  spellCheck={false}
                  className="flex-1 w-full bg-transparent outline-none resize-none py-8 text-white/85 placeholder-white/20 leading-relaxed scrollbar-dark"
                  style={{ fontFamily, fontSize: store.settings.fontStyle === 'serif' ? 19 : 16, transition: 'opacity 0.35s ease' }}
                />

                {/* Live flow trace — the wave of momentum */}
                <div className={fullscreen ? 'pb-6' : 'pb-2'}>
                  <canvas ref={liveTraceRef} className="w-full h-12 opacity-80" aria-hidden="true" />
                  <div className="flex items-center justify-between pt-1 pb-1">
                    <p className="text-[10px] uppercase tracking-[0.18em] transition-colors" style={{ color: targetReached ? SAGE : 'rgba(255,255,255,0.25)' }}>{traceLabel}</p>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/25 tabular-nums">{wordCount} words</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── COMPLETE — the session signature ── */}
        {phase === 'complete' && lastSession && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6 py-10"
          >
            <div className="w-full max-w-lg">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 mb-5">
                <canvas ref={finalTraceRef} className="w-full h-20" aria-hidden="true" />
                <div className="grid grid-cols-3 gap-2 mt-5 text-center">
                  {[
                    { label: 'words', value: String(lastSession.words), color: STEEL },
                    { label: 'minutes', value: String(lastSession.durationMinutes), color: SAGE },
                    { label: 'best streak', value: formatTime(lastSession.peakStreakSeconds), color: CORAL },
                  ].map(stat => (
                    <div key={stat.label}>
                      <p className="text-lg font-semibold" style={{ color: stat.color }}>{stat.value}</p>
                      <p className="text-[10px] uppercase tracking-wider text-white/30 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => begin(textRef.current)}
                  className="px-5 py-2.5 rounded-full border border-white/15 text-sm text-white/70 hover:text-white hover:border-white/30 transition-all"
                >
                  Keep writing
                </button>
                <button
                  onClick={() => { copyText(textRef.current); begin(''); }}
                  className="px-5 py-2.5 rounded-full text-white text-sm font-medium transition-all hover:scale-105"
                  style={{ background: GRADIENTS.tertiaryCta, boxShadow: `0 2px 14px ${SAGE}30` }}
                >
                  Copy &amp; start fresh
                </button>
              </div>
              <p className="text-center text-[10px] text-white/25 mt-4">
                Your words stay on this device. Only the rhythm is remembered.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
