'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useFlowStore } from './useFlowStore';
import Breathwork from './Breathwork';
import FlowSession from './FlowSession';
import SessionComplete from './SessionComplete';
import DayStats from './DayStats';
import { SAGE, TIMER_OPTIONS, BREATHWORK_PATTERNS, AMBIENT_SOUNDS, CURATED_PLAYLISTS } from './constants';

export default function FlowZone() {
  const store = useFlowStore();
  const [newPriority, setNewPriority] = useState('');
  const [lastSession, setLastSession] = useState<{ focusReps: number; durationMinutes: number } | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [showBreathwork, setShowBreathwork] = useState(false);
  const [breathworkLabel, setBreathworkLabel] = useState('Pre-Session');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [audioExpanded, setAudioExpanded] = useState(false);
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
    store.addSession({
      priorityId: store.selectedPriorityId || '',
      priorityText: store.selectedPriority?.text || '',
      durationMinutes: actualMinutes,
      focusReps,
      startedAt: Date.now() - actualMinutes * 60 * 1000,
      completedAt: Date.now(),
    });
    setLastSession({ focusReps, durationMinutes: actualMinutes });
    store.setPhase('dashboard');

    if (store.settings.breathworkPost) {
      setBreathworkLabel('Cooldown');
      setShowBreathwork(true);
    } else {
      setShowComplete(true);
    }
  }, [store]);

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
      // Post-session breathwork done — show completion if we have a session
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

  // Audio source label for dashboard display
  const audioSourceLabel = (() => {
    const src = store.settings.audioSource;
    if (src === 'none') return 'None';
    if (src === 'white-noise') return 'White Noise';
    if (src === 'rain') return 'Rain';
    if (src === 'binaural') return 'Binaural Beats';
    if (src.startsWith('yt:')) {
      const vid = src.slice(3);
      const curated = CURATED_PLAYLISTS.find(p => p.youtubeId === vid);
      return curated ? curated.title : 'YouTube';
    }
    if (src === 'yt-custom') return 'Custom YouTube';
    return 'None';
  })();

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
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="text-lg font-bold tracking-tight" style={{ color: SAGE }}>
          FlowZone
        </h1>
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors hidden sm:block">
            FourFlow<span className="text-gray-700 group-hover:text-gray-500">OS</span>
          </span>
          <div className="relative w-6 h-6 opacity-40 group-hover:opacity-70 transition-opacity">
            <Image
              src="/assets/LOGOS/FOURFLOW - MAIN LOGO.png"
              alt="FourFlowOS"
              fill
              className="object-contain"
            />
          </div>
        </Link>
      </header>

      {/* Main dashboard */}
      <main className="flex-1 px-6 pb-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Left: Today's Focus */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
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
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                      store.selectedPriorityId === priority.id
                        ? 'border-[#6BA292] bg-[#6BA292]'
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
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
                      className="flex-1 bg-transparent text-white text-sm outline-none border-b border-white/20 focus:border-[#6BA292]/60 py-1"
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
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none border-b border-white/10 focus:border-[#6BA292]/40 py-1.5 transition-colors"
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
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
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
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-300 bg-white/5 border border-white/10'
                  }`}
                  style={
                    store.settings.timerMinutes === opt.minutes
                      ? { background: SAGE, boxShadow: `0 2px 8px ${SAGE}40` }
                      : {}
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Breathwork */}
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Breathwork</p>
            <div className="flex items-center gap-2 mb-3">
              <select
                value={store.settings.breathworkPatternId}
                onChange={e => store.updateSettings({ breathworkPatternId: e.target.value })}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#6BA292]/60 appearance-none cursor-pointer"
              >
                {BREATHWORK_PATTERNS.map(p => (
                  <option key={p.id} value={p.id} className="bg-[#1a1a1a]">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={store.settings.breathworkPre}
                  onChange={e => store.updateSettings({ breathworkPre: e.target.checked })}
                  className="accent-[#6BA292] w-3.5 h-3.5"
                />
                <span className="text-xs text-gray-400">Pre-session</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={store.settings.breathworkPost}
                  onChange={e => store.updateSettings({ breathworkPost: e.target.checked })}
                  className="accent-[#6BA292] w-3.5 h-3.5"
                />
                <span className="text-xs text-gray-400">Post-session</span>
              </label>
            </div>

            {/* Audio — collapsible */}
            <button
              onClick={() => setAudioExpanded(!audioExpanded)}
              className="flex items-center justify-between w-full mb-2"
            >
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Audio</p>
              <span className="text-[10px] text-gray-600 flex items-center gap-1.5">
                {audioSourceLabel}
                <svg className={`w-3 h-3 transition-transform ${audioExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            <AnimatePresence>
              {audioExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {/* Volume */}
                  <div className="flex items-center gap-2 mb-3 mt-1">
                    <span className="text-[10px] text-gray-600">Vol</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={store.settings.audioVolume}
                      onChange={e => store.updateSettings({ audioVolume: parseFloat(e.target.value) })}
                      className="flex-1 accent-[#6BA292]"
                    />
                  </div>

                  {/* All audio choices as a radio group */}
                  <div className="space-y-1.5 mb-3">
                    {/* None */}
                    <AudioChoice
                      selected={store.settings.audioSource === 'none'}
                      label="None"
                      sublabel="Silent focus"
                      onClick={() => store.updateSettings({ audioSource: 'none' })}
                    />

                    {/* Ambient sounds */}
                    {AMBIENT_SOUNDS.map(sound => (
                      <AudioChoice
                        key={sound.id}
                        selected={store.settings.audioSource === sound.id}
                        label={`${sound.icon} ${sound.name}`}
                        onClick={() => store.updateSettings({ audioSource: sound.id })}
                      />
                    ))}

                    {/* Curated YouTube */}
                    {CURATED_PLAYLISTS.map(pl => (
                      <AudioChoice
                        key={pl.id}
                        selected={store.settings.audioSource === `yt:${pl.youtubeId}`}
                        label={pl.title}
                        sublabel="YouTube"
                        onClick={() => store.updateSettings({ audioSource: `yt:${pl.youtubeId}` })}
                      />
                    ))}

                    {/* Custom YouTube */}
                    <AudioChoice
                      selected={store.settings.audioSource === 'yt-custom'}
                      label="Custom YouTube"
                      sublabel={store.settings.youtubeCustomUrl ? 'URL set' : 'Paste a URL'}
                      onClick={() => store.updateSettings({ audioSource: 'yt-custom' })}
                    />
                  </div>

                  {/* Custom YouTube URL input */}
                  {store.settings.audioSource === 'yt-custom' && (
                    <input
                      type="text"
                      value={store.settings.youtubeCustomUrl}
                      onChange={e => store.updateSettings({ youtubeCustomUrl: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#6BA292]/60"
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Start button */}
        <div className="text-center mb-6">
          <button
            onClick={handleStartSession}
            disabled={!store.selectedPriorityId}
            className="px-12 py-4 rounded-full text-white text-lg font-semibold transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: `linear-gradient(135deg, ${SAGE}, ${SAGE}cc)`,
              boxShadow: store.selectedPriorityId ? `0 4px 24px ${SAGE}40` : 'none',
            }}
          >
            Start Session
          </button>
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

/** Minimal radio-style row for audio selection */
function AudioChoice({
  selected,
  label,
  sublabel,
  onClick,
}: {
  selected: boolean;
  label: string;
  sublabel?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-left text-xs transition-all ${
        selected
          ? 'bg-[#6BA292]/15 text-white'
          : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
      }`}
    >
      <div
        className={`w-3 h-3 rounded-full border-2 flex-shrink-0 transition-all ${
          selected ? 'border-[#6BA292] bg-[#6BA292]' : 'border-gray-600'
        }`}
      >
        {selected && (
          <div className="w-full h-full rounded-full flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-white" />
          </div>
        )}
      </div>
      <span className="flex-1">{label}</span>
      {sublabel && <span className="text-[10px] text-gray-600">{sublabel}</span>}
    </button>
  );
}
