'use client';

import { useState, useCallback, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlowStore } from './useFlowStore';
import Breathwork from './Breathwork';
import FlowSession from './FlowSession';
import SessionComplete from './SessionComplete';
import FlowSessionCard from './FlowSessionCard';
import DayStats from './DayStats';
import { Priority, FlowSettings } from './types';
import { SAGE, CORAL, AMETHYST, FOUR_PILLAR_GRADIENT, TIMER_OPTIONS, BREATHWORK_PATTERNS, AUDIO_OPTIONS } from './constants';
import { BreathworkIcons, AudioIcons, YTBadge } from './icons';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

/* ─── Settings Row (3-column: Duration | Breathwork | Audio) ─── */

function SettingsRow({
  settings,
  onUpdate,
}: {
  settings: FlowSettings;
  onUpdate: (p: Partial<FlowSettings>) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

      {/* Column 1: Duration */}
      <div
        className="relative rounded-2xl p-4 overflow-hidden"
        style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="absolute top-0 left-4 right-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${CORAL}60, transparent)` }} />
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Duration</p>
        <div className="grid grid-cols-2 gap-1.5">
          {TIMER_OPTIONS.map(opt => (
            <button
              key={opt.minutes}
              onClick={() => onUpdate({ timerMinutes: opt.minutes })}
              className={`py-2 rounded-xl text-xs font-medium transition-all ${
                settings.timerMinutes === opt.minutes
                  ? 'text-white scale-[1.02]'
                  : 'text-gray-500 hover:text-gray-300 bg-white/[0.04] border border-white/[0.08]'
              }`}
              style={
                settings.timerMinutes === opt.minutes
                  ? { background: SAGE, boxShadow: `0 2px 10px ${SAGE}40` }
                  : {}
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Column 2: Breathwork */}
      <div
        className="relative rounded-2xl p-4 overflow-hidden"
        style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="absolute top-0 left-4 right-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${SAGE}60, transparent)` }} />
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Breathwork</p>
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {BREATHWORK_PATTERNS.map(pattern => {
            const isSelected = settings.breathworkPatternId === pattern.id;
            return (
              <button
                key={pattern.id}
                onClick={() => onUpdate({ breathworkPatternId: pattern.id })}
                className={`flex items-start gap-2 p-2 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-[#4E8C73]/15 border-[#4E8C73]/40'
                    : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1]'
                } border`}
              >
                <span className={`flex-shrink-0 mt-0.5 ${isSelected ? 'text-[#4E8C73]' : 'text-gray-500'}`} style={{ width: 16, height: 16 }}>
                  {BreathworkIcons[pattern.id]}
                </span>
                <div className="min-w-0">
                  <p className={`text-[11px] font-medium leading-tight ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {pattern.benefit}
                  </p>
                  <p className="text-[9px] text-gray-600 mt-0.5 leading-tight">{pattern.name}</p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.breathworkPre}
              onChange={e => onUpdate({ breathworkPre: e.target.checked })}
              className="accent-[#4E8C73] w-3.5 h-3.5"
            />
            <span className="text-xs text-gray-400">Pre</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.breathworkPost}
              onChange={e => onUpdate({ breathworkPost: e.target.checked })}
              className="accent-[#4E8C73] w-3.5 h-3.5"
            />
            <span className="text-xs text-gray-400">Post</span>
          </label>
        </div>
      </div>

      {/* Column 3: Audio */}
      <div
        className="relative rounded-2xl p-4 overflow-hidden"
        style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="absolute top-0 left-4 right-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${AMETHYST}40, transparent)` }} />
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Audio</p>
          <div className="flex items-center gap-1.5 w-24">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-500 flex-shrink-0">
              <path d="M3 8v4h3l4 4V4L6 8H3z" />
              <path d="M14 7a4 4 0 010 6" />
            </svg>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.audioVolume}
              onChange={e => onUpdate({ audioVolume: parseFloat(e.target.value) })}
              className="flex-1 accent-[#6330A0]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <AudioButton
            icon={AudioIcons.none}
            title="Silence"
            subtitle="No audio"
            selected={settings.audioSource === 'none'}
            onClick={() => onUpdate({ audioSource: 'none' })}
          />
          {AUDIO_OPTIONS.map(opt => (
            <AudioButton
              key={opt.id}
              icon={AudioIcons[opt.id]}
              title={opt.title}
              subtitle={opt.subtitle}
              selected={settings.audioSource === opt.id}
              onClick={() => onUpdate({ audioSource: opt.id })}
              isYoutube={opt.source === 'youtube'}
            />
          ))}
          <AudioButton
            icon={AudioIcons.custom}
            title="Custom"
            subtitle="Paste any URL"
            selected={settings.audioSource === 'yt-custom'}
            onClick={() => onUpdate({ audioSource: 'yt-custom' })}
            isYoutube
          />
        </div>

        <AnimatePresence>
          {settings.audioSource === 'yt-custom' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <input
                type="text"
                value={settings.youtubeCustomUrl}
                onChange={e => onUpdate({ youtubeCustomUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                autoFocus
                className="w-full mt-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#6330A0]/50 transition-colors"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

/* ─── Done section sub-components ─────────────────────────────── */

function StrikethroughText({ text }: { text: string }) {
  return (
    <div className="relative flex-1 min-w-0">
      <span className="text-sm text-gray-500 leading-tight">{text}</span>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 0 50 L 100 50"
          stroke={`${SAGE}70`}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>
    </div>
  );
}

function DonePrioritiesSection({ priorities }: { priorities: Priority[] }) {
  return (
    <div className="mt-4 pt-3 border-t border-white/[0.06]">
      <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">Done</p>
      <AnimatePresence initial={false}>
        {priorities.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="flex items-center gap-3 py-1"
          >
            <div
              className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ background: `${SAGE}20`, border: `1.5px solid ${SAGE}45` }}
            >
              <svg width="8" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: SAGE }}>
                <path d="M1 4l3 3 5-6" />
              </svg>
            </div>
            <StrikethroughText text={p.text} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main FlowZone Component ──────────────────────────────────── */

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

  const handleCompletePriority = useCallback(() => {
    if (store.selectedPriorityId) {
      store.completePriority(store.selectedPriorityId);
      store.setSelectedPriorityId(null);
    }
  }, [store]);

  const handleBreathworkDone = useCallback(() => {
    setShowBreathwork(false);
    if (breathworkLabel === 'Pre-Session') {
      store.setPhase('flow');
    } else {
      if (lastSession) setShowComplete(true);
    }
  }, [breathworkLabel, store, lastSession]);

  const handleBreathworkSkip = useCallback(() => {
    setShowBreathwork(false);
    if (breathworkLabel === 'Pre-Session') {
      store.setPhase('flow');
    } else {
      if (lastSession) setShowComplete(true);
    }
  }, [breathworkLabel, store, lastSession]);

  if (!store.mounted) return null;

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

      <main className="flex-1 px-6 pb-6 pt-6 max-w-5xl mx-auto w-full">

        {/* 1. Today's Focus — full width */}
        <div
          className="relative rounded-2xl p-6 mb-6 overflow-hidden"
          style={{
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.03)',
          }}
        >
          <div className="absolute top-0 left-4 right-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${CORAL}60, transparent)` }} />

          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
            Today&apos;s Focus
          </h2>

          <div className="space-y-2 mb-4">
            {store.activePriorities.map(priority => (
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

          {store.activePriorities.length < 5 && (
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

          {store.activePriorities.length === 0 && store.donePriorities.length === 0 && (
            <p className="text-gray-600 text-xs mt-2">Add priorities to get started.</p>
          )}

          {store.activePriorities.length > 0 && !store.selectedPriorityId && (
            <p className="text-gray-600 text-xs mt-4">Select one to start a session.</p>
          )}

          {/* Done section */}
          {store.donePriorities.length > 0 && (
            <DonePrioritiesSection priorities={store.donePriorities} />
          )}
        </div>

        {/* 2. Settings Row — 3 columns */}
        <div className="mb-6">
          <SettingsRow settings={store.settings} onUpdate={store.updateSettings} />
        </div>

        {/* 3. Flow Session Card — appears when task selected */}
        <AnimatePresence>
          {store.selectedPriorityId && store.selectedPriority && (
            <FlowSessionCard
              key="session-card"
              priority={store.selectedPriority}
              settings={store.settings}
              onStart={handleStartSession}
            />
          )}
        </AnimatePresence>

        {/* 4. Day Stats */}
        <DayStats
          sessionCount={store.sessionCount}
          totalMinutes={store.totalMinutes}
          totalReps={store.totalReps}
        />

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
            onComplete={handleCompletePriority}
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

/* ─── AudioButton ──────────────────────────────────────────────── */

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
      className={`flex items-start gap-2 p-2 rounded-xl text-left transition-all ${
        selected
          ? 'bg-[#6330A0]/15 border-[#6330A0]/40'
          : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1]'
      } border`}
    >
      <span className={`flex-shrink-0 mt-0.5 ${selected ? 'text-[#6330A0]' : 'text-gray-500'}`} style={{ width: 16, height: 16 }}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <p className={`text-[11px] font-medium leading-tight ${selected ? 'text-white' : 'text-gray-300'}`}>
            {title}
          </p>
          {isYoutube && <YTBadge />}
        </div>
        <p className="text-[9px] text-gray-600 mt-0.5 leading-tight">{subtitle}</p>
      </div>
    </button>
  );
}
