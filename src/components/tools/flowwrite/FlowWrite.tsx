'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlowWriteStore } from './useFlowWriteStore';
import {
  DURATIONS, STALL_GRACE_MS, DIM_RAMP_MS, DIM_MAX,
  SAMPLE_INTERVAL_MS, RATE_WINDOW_MS, RATE_FULL, STALL_THRESHOLD_MS,
  STARTER_PROMPTS,
} from './constants';
import type { FlowWriteSession, WritePhase } from './types';
import { CORAL, SAGE, STEEL, AMETHYST, GRADIENTS } from '@/styles/brand-colors';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

/*
 * FlowWrite — momentum writing. CONSUME has FlowRead (words in);
 * CREATE has FlowWrite (words out). Trains the Generative Story Key.
 *
 * Three phases: setup → writing (stall-dim + live flow trace) → signature.
 * Text never leaves the browser; only session stats sync to Supabase
 * (table `flowwrite_sessions` — same pattern as `focus_sessions`).
 */

const countWords = (text: string) => (text.trim().match(/\S+/g) ?? []).length;

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.max(0, Math.floor(totalSeconds % 60));
  return `${m}:${s.toString().padStart(2, '0')}`;
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

  const [phase, setPhase] = useState<WritePhase>('setup');
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [lastSession, setLastSession] = useState<FlowWriteSession | null>(null);
  const [copied, setCopied] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const liveTraceRef = useRef<HTMLCanvasElement>(null);
  const finalTraceRef = useRef<HTMLCanvasElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);

  // Session tracking (refs — no re-renders on keystrokes)
  const keystrokesRef = useRef<number[]>([]);
  const samplesRef = useRef<number[]>([]);
  const lastKeyRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const statsRef = useRef({ stalls: 0, peakStreakMs: 0, streakStart: 0, stalled: false });
  const textRef = useRef('');
  const endedRef = useRef(false);

  // ── Begin ──
  const begin = useCallback(() => {
    const now = performance.now();
    keystrokesRef.current = [];
    samplesRef.current = [];
    lastKeyRef.current = now;
    startRef.current = now;
    statsRef.current = { stalls: 0, peakStreakMs: 0, streakStart: now, stalled: false };
    endedRef.current = false;
    setText(store.draft);
    textRef.current = store.draft;
    setRemaining(store.settings.durationMinutes * 60);
    setPhase('writing');
    setCopied(false);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, [store.draft, store.settings.durationMinutes]);

  // ── Finish ──
  const finish = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;

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

    const session: FlowWriteSession = {
      id: `fw_${Date.now()}`,
      startedAt: Date.now() - (now - startRef.current),
      durationMinutes: Math.round((now - startRef.current) / 60000 * 10) / 10,
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
          if (error) console.warn('[FlowWrite] session sync failed:', error.message);
        });
    }
  }, [store, user]);

  // ── Writing loop: timer, sampling, stall detection, dimming ──
  useEffect(() => {
    if (phase !== 'writing') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sampler = setInterval(() => {
      const now = performance.now();

      // Trace sample: keystroke rate over the trailing window.
      const cutoff = now - RATE_WINDOW_MS;
      keystrokesRef.current = keystrokesRef.current.filter(t => t > cutoff);
      const rate = keystrokesRef.current.length / (RATE_WINDOW_MS / 1000);
      samplesRef.current.push(Math.min(1, rate / RATE_FULL));

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

      // Flow-mode dim: silence past the grace period dims the page;
      // typing restores the light. Gentle, never punitive.
      if (store.settings.flowMode && !reducedMotion && dimRef.current) {
        const dim = silence <= STALL_GRACE_MS
          ? 0
          : Math.min(DIM_MAX, ((silence - STALL_GRACE_MS) / DIM_RAMP_MS) * DIM_MAX);
        dimRef.current.style.opacity = String(dim);
      }

      // Live trace — last ~90 seconds.
      if (liveTraceRef.current) {
        drawTrace(liveTraceRef.current, samplesRef.current.slice(-Math.floor(90000 / SAMPLE_INTERVAL_MS)));
      }
    }, SAMPLE_INTERVAL_MS);

    const timer = setInterval(() => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const left = store.settings.durationMinutes * 60 - elapsed;
      setRemaining(left);
      if (left <= 0) finish();
    }, 1000);

    return () => {
      clearInterval(sampler);
      clearInterval(timer);
    };
  }, [phase, store.settings.flowMode, store.settings.durationMinutes, finish]);

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

  return (
    <div className={`relative ${embedded ? '' : 'flex-1'} text-white flex flex-col`}>
      <AnimatePresence mode="wait">

        {/* ── SETUP ── */}
        {phase === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex-1 flex flex-col items-center justify-center px-6 py-10"
          >
            <div className="w-full max-w-md space-y-7">
              <div className="text-center">
                <p className="font-display italic text-xl text-white/80">Write before you think.</p>
                <p className="text-[13px] text-white/40 mt-2 leading-relaxed">
                  Momentum first, judgment later. Set a container, keep the words moving,
                  and watch your rhythm become visible. Your text stays on this device.
                </p>
              </div>

              {/* Duration */}
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/50 mb-2">Duration</p>
                <div className="grid grid-cols-4 gap-2">
                  {DURATIONS.map(min => (
                    <button
                      key={min}
                      onClick={() => store.setSettings({ durationMinutes: min })}
                      className="py-2.5 rounded-xl border text-sm font-medium transition-all duration-200"
                      style={{
                        borderColor: store.settings.durationMinutes === min ? `${SAGE}85` : 'rgba(255,255,255,0.1)',
                        background: store.settings.durationMinutes === min ? `${SAGE}1a` : 'rgba(255,255,255,0.03)',
                        color: store.settings.durationMinutes === min ? '#fff' : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {min}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Flow mode + font */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => store.setSettings({ flowMode: !store.settings.flowMode })}
                  className="flex-1 flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-left"
                >
                  <span>
                    <span className="block text-sm text-white/85">Flow mode</span>
                    <span className="block text-[11px] text-white/35 mt-0.5">The page dims when you stall</span>
                  </span>
                  <span
                    className="relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0"
                    style={{ background: store.settings.flowMode ? SAGE : 'rgba(255,255,255,0.12)' }}
                  >
                    <span
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
                      style={{ left: store.settings.flowMode ? 18 : 2 }}
                    />
                  </span>
                </button>
                <button
                  onClick={() => store.setSettings({ fontStyle: store.settings.fontStyle === 'serif' ? 'sans' : 'serif' })}
                  className="px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/70 whitespace-nowrap"
                  title="Writing typeface"
                >
                  {store.settings.fontStyle === 'serif' ? 'Serif' : 'Sans'}
                </button>
              </div>

              {/* Optional spark */}
              <div className="text-center">
                {prompt ? (
                  <button
                    onClick={() => setPrompt(STARTER_PROMPTS[(STARTER_PROMPTS.indexOf(prompt) + 1) % STARTER_PROMPTS.length])}
                    className="text-[13px] italic text-white/55 hover:text-white/80 transition-colors font-display"
                  >
                    &ldquo;{prompt}&rdquo;
                  </button>
                ) : (
                  <button
                    onClick={() => setPrompt(STARTER_PROMPTS[Math.floor(Math.random() * STARTER_PROMPTS.length)])}
                    className="text-[11px] uppercase tracking-[0.14em] text-white/30 hover:text-white/60 transition-colors"
                  >
                    need a spark?
                  </button>
                )}
              </div>

              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={begin}
                  className="px-8 py-3.5 rounded-full text-white text-sm font-medium transition-all hover:scale-105"
                  style={{ background: GRADIENTS.tertiaryCta, boxShadow: `0 2px 14px ${SAGE}30` }}
                >
                  {store.draft ? 'Continue writing' : 'Begin'}
                </button>
                {store.draft && (
                  <p className="text-[11px] text-white/30">
                    A draft from last time is waiting ({countWords(store.draft)} words)
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── WRITING ── */}
        {phase === 'writing' && (
          <motion.div
            key="writing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col min-h-[70vh]"
          >
            {/* Status whisper */}
            <div className="flex items-center justify-between px-6 pt-4 text-[11px] text-white/35 tracking-wide">
              <span>{formatTime(remaining)}</span>
              {prompt && <span className="italic font-display text-white/30 truncate max-w-[50%]">&ldquo;{prompt}&rdquo;</span>}
              <span>{countWords(text)} words</span>
            </div>

            {/* Canvas */}
            <div className="relative flex-1 flex flex-col px-6">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={e => {
                  const now = performance.now();
                  keystrokesRef.current.push(now);
                  lastKeyRef.current = now;
                  setText(e.target.value);
                  textRef.current = e.target.value;
                  store.setDraft(e.target.value);
                }}
                placeholder="Don't think. Type."
                spellCheck={false}
                className="flex-1 w-full max-w-2xl mx-auto bg-transparent outline-none resize-none py-8 text-white/85 placeholder-white/20 leading-relaxed scrollbar-dark"
                style={{ fontFamily, fontSize: store.settings.fontStyle === 'serif' ? 19 : 16 }}
              />

              {/* Stall dim — sits over everything except the trace + controls */}
              <div
                ref={dimRef}
                className="absolute inset-0 pointer-events-none bg-black"
                style={{ opacity: 0, transition: 'opacity 0.6s ease' }}
              />
            </div>

            {/* Live flow trace */}
            <div className="px-6 pb-2">
              <canvas ref={liveTraceRef} className="w-full h-12 opacity-80" aria-hidden="true" />
              <div className="flex items-center justify-between pb-3 pt-1">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">your flow trace</p>
                <button
                  onClick={finish}
                  className="text-[11px] text-white/30 hover:text-white/70 transition-colors uppercase tracking-[0.14em]"
                >
                  finish
                </button>
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
              <p className="text-center text-[11px] uppercase tracking-[0.18em] text-white/35 mb-1">session signature</p>
              <p className="text-center font-display italic text-lg text-white/75 mb-5">
                This rhythm was yours alone.
              </p>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 mb-5">
                <canvas ref={finalTraceRef} className="w-full h-20" aria-hidden="true" />
                <div className="grid grid-cols-4 gap-2 mt-5 text-center">
                  {[
                    { label: 'words', value: String(lastSession.words), color: STEEL },
                    { label: 'minutes', value: String(lastSession.durationMinutes), color: SAGE },
                    { label: 'best streak', value: formatTime(lastSession.peakStreakSeconds), color: CORAL },
                    { label: 'stalls', value: String(lastSession.stallCount), color: AMETHYST },
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
                  onClick={() => {
                    navigator.clipboard?.writeText(textRef.current).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    });
                  }}
                  className="px-5 py-2.5 rounded-full border border-white/15 text-sm text-white/70 hover:text-white hover:border-white/30 transition-all"
                >
                  {copied ? 'Copied' : 'Copy text'}
                </button>
                <button
                  onClick={() => { setPhase('setup'); setText(''); textRef.current = ''; setPrompt(null); }}
                  className="px-5 py-2.5 rounded-full text-white text-sm font-medium transition-all hover:scale-105"
                  style={{ background: GRADIENTS.tertiaryCta, boxShadow: `0 2px 14px ${SAGE}30` }}
                >
                  Done
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
