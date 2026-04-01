'use client';

import { useState, useCallback, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlowStore } from './useFlowStore';
import Breathwork from './Breathwork';
import FlowSession from './FlowSession';
import SessionComplete from './SessionComplete';
import DayStats from './DayStats';
import { SAGE, CORAL, AMETHYST, FOUR_PILLAR_GRADIENT, TIMER_OPTIONS, BREATHWORK_PATTERNS, AUDIO_OPTIONS } from './constants';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

/* ─── SVG Icons (20x20 consistent size) ──────────────────────── */

const BreathworkIcons: Record<string, ReactNode> = {
  box: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <circle cx="10" cy="10" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),
  '478': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3C6 3 3 6 3 10s3 7 7 7" />
      <path d="M10 17c4 0 7-3 7-7S14 3 10 3" strokeOpacity="0.4" />
      <path d="M10 7v6l3 2" />
    </svg>
  ),
  coherent: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 10c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  energize: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" />
    </svg>
  ),
};

const AudioIcons: Record<string, ReactNode> = {
  'white-noise': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 10h2M6 6h2v8H6zM10 4h2v12h-2zM14 7h2v6h-2zM18 9h-1v2h1" />
    </svg>
  ),
  binaural: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 8a6 6 0 0112 0" />
      <path d="M6 8a4 4 0 018 0" />
      <circle cx="7" cy="13" r="2" />
      <circle cx="13" cy="13" r="2" />
      <path d="M5 13V9M15 13V9" />
    </svg>
  ),
  rain: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M5 8a5 5 0 0110 0 3 3 0 01-1 6H6a3 3 0 01-1-6z" />
      <path d="M7 16l-1 2M10 16l-1 2M13 16l-1 2" />
    </svg>
  ),
  lofi: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="14" height="10" rx="2" />
      <circle cx="10" cy="11" r="3" />
      <circle cx="10" cy="11" r="1" fill="currentColor" stroke="none" />
      <path d="M6 6V4h8v2" />
    </svg>
  ),
  nature: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2l-5 8h3l-3 8h10l-3-8h3z" />
    </svg>
  ),
  classical: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M7 16V6l10-3v10" />
      <circle cx="5" cy="16" r="2" />
      <circle cx="15" cy="13" r="2" />
    </svg>
  ),
  none: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 3l14 14" />
      <path d="M10 4v5M10 14v2" />
      <path d="M6 8a4.5 4.5 0 015-3.5" />
      <path d="M14 12a4.5 4.5 0 01-5 3.5" />
    </svg>
  ),
  custom: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3v14M3 10h14" />
      <circle cx="10" cy="10" r="7" />
    </svg>
  ),
};

/** YouTube play button emblem — small badge */
function YTBadge() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" className="flex-shrink-0 opacity-50">
      <rect width="14" height="10" rx="2" fill="#FF0000" />
      <polygon points="5.5,2 5.5,8 10,5" fill="white" />
    </svg>
  );
}

export default function FlowZone({ hideHeader }: { hideHeader?: boolean } = {}) {
  const store = useFlowStore();
  const { user } = useAuth();
  const [newPriority, setNewPriority] = useState('');
  const [lastSession, setLastSession] = useState<{ focusReps: number; durationMinutes: number } | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [showBreathwork, setShowBreathwork] = useState(false);
  const [breathworkLabel, setBreathworkLabel] = useState('Pre-Session');
  const [editingId, setEditingId] = useState<string | null>(null);
  const editRef = useRef<HTMLInputElement>(null);

  const handleAddPriority = () => {
    if (!newPriority.trim()) return;
    store.addPriority(newPriority);
    setNewPriority('');
  };

  const handleStartSession = useCallback(() => {
    if (!store.selectedPriorityId) return;
    if (store.settings.breathworkPre) {
      setBreathworkLabel('Pre-Session');
      setShowBreathwork(true);
    } else {
      store.setPhase('flow');
    }
  }, [store]);

  const handleFlowComplete = useCallback((focusReps: number, actualMinutes: number) => {
    const startedAt = Date.now() - actualMinutes * 60 * 1000;
    const completedAt = Date.now();

    store.addSession({
      priorityId: store.selectedPriorityId || '',
      priorityText: store.selectedPriority?.text || '',
      durationMinutes: actualMinutes,
      focusReps,
      startedAt,
      completedAt,
    });
    setLastSession({ focusReps, durationMinutes: actualMinutes });
    store.setPhase('dashboard');

    // Sync to Supabase — fire and forget, doesn't block UI
    if (user) {
      getSupabaseBrowser()
        .from('focus_sessions')
        .insert({
          user_id: user.id,
          duration_minutes: actualMinutes,
          focus_reps: focusReps,
          completed: true,
          started_at: new Date(startedAt).toISOString(),
          ended_at: new Date(completedAt).toISOString(),
        })
        .then(({ error }) => {
          if (error) console.warn('[FlowZone] session sync failed:', error.message);
        });
    }

    if (store.settings.breathworkPost) {
      setBreathworkLabel('Cooldown');
      setShowBreathwork(true);
    } else {
      setShowComplete(true);
    }
  }, [store, user]);

  const handleCooldownFromComplete = useCallback(() => {
    setShowComplete(false);
    setBreathworkLabel('Cooldown');
    setShowBreathwork(true);
  }, []);

  const handleDismissComplete = useCallback(() => {
    setShowComplete(false);
    setLastSession(null);
  }, []);

  const handleBreathworkDone = useCallback(() => {
    setShowBreathwork(false);
    if (breathworkLabel === 'Pre-Session') {
      store.setPhase('flow');
    } else {
      if (lastSession) {
        setShowComplete(true);
      }
    }
  }, [breathworkLabel, store, lastSession]);

  const handleBreathworkSkip = useCallback(() => {
    setShowBreathwork(false);
    if (breathworkLabel === 'Pre-Session') {
      store.setPhase('flow');
    } else {
      if (lastSession) {
        setShowComplete(true);
      }
    }
  }, [breathworkLabel, store, lastSession]);

  const handleSelectAudio = (id: string) => {
    const opt = AUDIO_OPTIONS.find(o => o.id === id);
    if (opt?.source === 'youtube' && opt.youtubeId) {
      store.updateSettings({ audioSource: id });
    } else {
      store.updateSettings({ audioSource: id });
    }
  };

  if (!store.mounted) return null;

  // Flow session overlay
  if (store.phase === 'flow' && store.selectedPriority) {
    return (
      <FlowSession
        priority={store.selectedPriority}
        durationMinutes={store.settings.timerMinutes}
        audioSettings={store.settings}
        onComplete={handleFlowComplete}
        onEnd={() => store.setPhase('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header — hidden when embedded in ActivityArea (which renders its own ToolHeader) */}
      {!hideHeader && (
        <>
          <header className="flex items-center justify-between px-6 py-4 pl-[68px]">
            <h1
              className="text-lg font-bold tracking-tight"
              style={{
                background: `linear-gradient(135deg, ${SAGE}, ${AMETHYST})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              FlowZone
            </h1>
            <div />
          </header>
          <div className="h-px mx-6" style={{ background: FOUR_PILLAR_GRADIENT, opacity: 0.4 }} />
        </>
      )}

      {/* Main dashboard */}
      <main className="flex-1 px-6 pb-6 pt-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Left: Today's Focus */}
          <div
            className="relative rounded-2xl p-6 transition-all duration-200 hover:translate-y-[-2px] overflow-hidden"
            style={{
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.03), 0 0 0 0 transparent`,
            }}
          >
            {/* Coral top accent */}
            <div className="absolute top-0 left-4 right-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${CORAL}60, transparent)` }} />

            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              Today&apos;s Focus
            </h2>

            <div className="space-y-2 mb-4">
              {store.dayData.priorities.map(priority => (
                <div key={priority.id} className="flex items-center gap-3 group">
                  <button
                    onClick={() => store.setSelectedPriorityId(
                      store.selectedPriorityId === priority.id ? null : priority.id
                    )}
                    className="w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all"
                    style={
                      store.selectedPriorityId === priority.id
                        ? { borderColor: CORAL, background: CORAL, boxShadow: `0 0 8px ${CORAL}50` }
                        : { borderColor: '#4b5563' }
                    }
                  >
                    {store.selectedPriorityId === priority.id && (
                      <div className="w-full h-full rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </button>

                  {editingId === priority.id ? (
                    <input
                      ref={editRef}
                      type="text"
                      defaultValue={priority.text}
                      autoFocus
                      className="flex-1 bg-transparent text-white text-sm outline-none border-b border-white/20 focus:border-[#E84535]/60 py-1"
                      onBlur={e => {
                        const val = e.target.value.trim();
                        if (val) store.updatePriority(priority.id, val);
                        else store.removePriority(priority.id);
                        setEditingId(null);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                  ) : (
                    <span
                      className="flex-1 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
                      onClick={() => setEditingId(priority.id)}
                    >
                      {priority.text}
                    </span>
                  )}

                  <button
                    onClick={() => store.removePriority(priority.id)}
                    className="text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {store.dayData.priorities.length < 5 && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value)}
                  placeholder="+ Add priority..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none border-b border-white/10 focus:border-[#E84535]/40 py-1.5 transition-colors"
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAddPriority();
                  }}
                />
              </div>
            )}

            {store.dayData.priorities.length === 0 && (
              <p className="text-gray-600 text-xs mt-2">
                Add priorities to get started.
              </p>
            )}

            {store.dayData.priorities.length > 0 && !store.selectedPriorityId && (
              <p className="text-gray-600 text-xs mt-4">
                Select one to start a session.
              </p>
            )}
          </div>

          {/* Right: Session Settings */}
          <div
            className="relative rounded-2xl p-6 transition-all duration-200 hover:translate-y-[-2px] overflow-hidden"
            style={{
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.03)`,
            }}
          >
            {/* Sage top accent */}
            <div className="absolute top-0 left-4 right-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${SAGE}60, transparent)` }} />

            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              Session Settings
            </h2>

            {/* Duration */}
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Duration</p>
            <div className="flex gap-2 mb-5">
              {TIMER_OPTIONS.map(opt => (
                <button
                  key={opt.minutes}
                  onClick={() => store.updateSettings({ timerMinutes: opt.minutes })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    store.settings.timerMinutes === opt.minutes
                      ? 'text-white scale-105'
                      : 'text-gray-500 hover:text-gray-300 bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm'
                  }`}
                  style={
                    store.settings.timerMinutes === opt.minutes
                      ? { background: SAGE, boxShadow: `0 4px 12px ${SAGE}40` }
                      : {}
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Breathwork — button grid */}
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Breathwork</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {BREATHWORK_PATTERNS.map(pattern => {
                const isSelected = store.settings.breathworkPatternId === pattern.id;
                return (
                  <button
                    key={pattern.id}
                    onClick={() => store.updateSettings({ breathworkPatternId: pattern.id })}
                    className={`flex items-start gap-2.5 p-3 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-[#4E8C73]/15 border-[#4E8C73]/40'
                        : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1]'
                    } border`}
                  >
                    <span className={`flex-shrink-0 mt-0.5 ${isSelected ? 'text-[#4E8C73]' : 'text-gray-500'}`}>
                      {BreathworkIcons[pattern.id]}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium leading-tight ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                        {pattern.benefit}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{pattern.name}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mb-5">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={store.settings.breathworkPre}
                  onChange={e => store.updateSettings({ breathworkPre: e.target.checked })}
                  className="accent-[#4E8C73] w-3.5 h-3.5"
                />
                <span className="text-xs text-gray-400">Pre-session</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={store.settings.breathworkPost}
                  onChange={e => store.updateSettings({ breathworkPost: e.target.checked })}
                  className="accent-[#4E8C73] w-3.5 h-3.5"
                />
                <span className="text-xs text-gray-400">Post-session</span>
              </label>
            </div>
          </div>
        </div>

        {/* Audio Section — always expanded */}
        <div
          className="relative rounded-2xl p-6 mb-8 overflow-hidden"
          style={{
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.03)`,
          }}
        >
          <div className="absolute top-0 left-4 right-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${AMETHYST}40, transparent)` }} />

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Audio</h2>
            {/* Volume */}
            <div className="flex items-center gap-2 w-32">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-500 flex-shrink-0">
                <path d="M3 8v4h3l4 4V4L6 8H3z" />
                <path d="M14 7a4 4 0 010 6M16.5 4.5a8 8 0 010 11" />
              </svg>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={store.settings.audioVolume}
                onChange={e => store.updateSettings({ audioVolume: parseFloat(e.target.value) })}
                className="flex-1 accent-[#6330A0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* None button */}
            <AudioButton
              icon={AudioIcons.none}
              title="Silence"
              subtitle="No audio"
              selected={store.settings.audioSource === 'none'}
              onClick={() => store.updateSettings({ audioSource: 'none' })}
            />

            {/* 6 main audio options */}
            {AUDIO_OPTIONS.map(opt => (
              <AudioButton
                key={opt.id}
                icon={AudioIcons[opt.id]}
                title={opt.title}
                subtitle={opt.subtitle}
                selected={store.settings.audioSource === opt.id}
                onClick={() => handleSelectAudio(opt.id)}
                isYoutube={opt.source === 'youtube'}
              />
            ))}

            {/* Custom YouTube button */}
            <AudioButton
              icon={AudioIcons.custom}
              title="Custom"
              subtitle="Paste any URL"
              selected={store.settings.audioSource === 'yt-custom'}
              onClick={() => store.updateSettings({ audioSource: 'yt-custom' })}
              isYoutube
            />
          </div>

          {/* Custom YouTube URL input */}
          <AnimatePresence>
            {store.settings.audioSource === 'yt-custom' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <input
                  type="text"
                  value={store.settings.youtubeCustomUrl}
                  onChange={e => store.updateSettings({ youtubeCustomUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  autoFocus
                  className="w-full mt-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6330A0]/50 transition-colors"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Start button */}
        <div className="text-center mb-6 relative">
          {store.selectedPriorityId && (
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full pointer-events-none"
              style={{ border: `1px solid ${SAGE}10` }}
            />
          )}
          <button
            onClick={handleStartSession}
            disabled={!store.selectedPriorityId}
            className="relative px-14 py-5 rounded-full text-white text-lg font-semibold transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: store.selectedPriorityId
                ? `linear-gradient(135deg, ${SAGE}, ${AMETHYST})`
                : `linear-gradient(135deg, ${SAGE}, ${SAGE}cc)`,
              boxShadow: store.selectedPriorityId ? `0 4px 30px ${SAGE}40, 0 0 60px ${AMETHYST}15` : 'none',
            }}
          >
            {store.selectedPriorityId && (
              <span
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                  animation: 'shimmer 3s infinite',
                }}
              />
            )}
            <span className="relative">Start Session</span>
          </button>
          <style jsx>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>

        {/* Day stats bar */}
        <DayStats
          sessionCount={store.sessionCount}
          totalMinutes={store.totalMinutes}
          totalReps={store.totalReps}
        />

        {/* Reset */}
        {store.dayData.priorities.length > 0 && (
          <div className="text-center mt-4">
            <button
              onClick={store.resetDay}
              className="text-xs text-gray-700 hover:text-red-400 transition-colors"
            >
              Reset Day
            </button>
          </div>
        )}
      </main>

      {/* Session Complete modal */}
      <AnimatePresence>
        {showComplete && lastSession && (
          <SessionComplete
            key="complete"
            priorityText={store.selectedPriority?.text || ''}
            durationMinutes={lastSession.durationMinutes}
            focusReps={lastSession.focusReps}
            onCooldown={handleCooldownFromComplete}
            onDismiss={handleDismissComplete}
          />
        )}
      </AnimatePresence>

      {/* Breathwork overlay */}
      <AnimatePresence>
        {showBreathwork && (
          <motion.div
            key="breathwork-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm flex items-center justify-center"
          >
            <Breathwork
              label={breathworkLabel}
              patternId={store.settings.breathworkPatternId}
              onDone={handleBreathworkDone}
              onSkip={handleBreathworkSkip}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Big audio selection button — matches breathwork button sizing */
function AudioButton({
  icon,
  title,
  subtitle,
  selected,
  onClick,
  isYoutube,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
  isYoutube?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-start gap-2.5 p-3 rounded-xl text-left transition-all ${
        selected
          ? 'bg-[#6330A0]/15 border-[#6330A0]/40'
          : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1]'
      } border`}
    >
      <span className={`flex-shrink-0 mt-0.5 ${selected ? 'text-[#6330A0]' : 'text-gray-500'}`}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className={`text-sm font-medium leading-tight ${selected ? 'text-white' : 'text-gray-300'}`}>
            {title}
          </p>
          {isYoutube && <YTBadge />}
        </div>
        <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{subtitle}</p>
      </div>
    </button>
  );
}
