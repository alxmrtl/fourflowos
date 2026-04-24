'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlowStore } from './useFlowStore';
import Breathwork from './Breathwork';
import FlowSession from './FlowSession';
import SessionComplete from './SessionComplete';
import FlowZoneLayoutB from './FlowZoneLayoutB';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { SAGE, AMETHYST, FOUR_PILLAR_GRADIENT } from './constants';

export default function FlowZone({ hideHeader }: { hideHeader?: boolean } = {}) {
  const store = useFlowStore();
  const { user } = useAuth();
  const [newPriority, setNewPriority] = useState('');
  const [lastSession, setLastSession] = useState<{ focusReps: number; durationMinutes: number } | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [showBreathwork, setShowBreathwork] = useState(false);
  const [breathworkLabel, setBreathworkLabel] = useState('Pre-Session');
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const layoutProps = {
    activePriorities: store.activePriorities,
    donePriorities: store.donePriorities,
    selectedPriorityId: store.selectedPriorityId,
    selectedPriority: store.selectedPriority,
    settings: store.settings,
    sessionCount: store.sessionCount,
    totalMinutes: store.totalMinutes,
    totalReps: store.totalReps,
    onSelectPriority: store.setSelectedPriorityId,
    onUpdateSettings: store.updateSettings,
    onAddPriority: store.addPriority,
    onRemovePriority: store.removePriority,
    onUpdatePriority: store.updatePriority,
    onStart: handleStartSession,
    newPriority,
    setNewPriority,
    editingId,
    setEditingId,
  };

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
        <FlowZoneLayoutB {...layoutProps} />

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
