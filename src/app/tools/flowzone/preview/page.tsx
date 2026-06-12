'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFlowStore } from '@/components/tools/flowzone/useFlowStore';
import FlowZoneLayoutA from '@/components/tools/flowzone/FlowZoneLayoutA';
import FlowZoneLayoutB from '@/components/tools/flowzone/FlowZoneLayoutB';
import FlowSession from '@/components/tools/flowzone/FlowSession';
import SessionComplete from '@/components/tools/flowzone/SessionComplete';
import Breathwork from '@/components/tools/flowzone/Breathwork';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { SAGE, AMETHYST, FOUR_PILLAR_GRADIENT } from '@/components/tools/flowzone/constants';

type Variant = 'a' | 'b';

export default function FlowZonePreviewPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const store = useFlowStore();

  const [variant, setVariant] = useState<Variant>('a');
  const [newPriority, setNewPriority] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lastSession, setLastSession] = useState<{ focusReps: number; durationMinutes: number } | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [showBreathwork, setShowBreathwork] = useState(false);
  const [breathworkLabel, setBreathworkLabel] = useState('Pre-Session');

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
        .then(({ error }) => { if (error) console.warn('[FlowZone] session sync failed:', error.message); });
    }
    if (store.settings.breathworkPost) {
      setBreathworkLabel('Cooldown');
      setShowBreathwork(true);
    } else {
      setShowComplete(true);
    }
  }, [store, user]);

  const handleBreathworkDone = useCallback(() => {
    setShowBreathwork(false);
    if (breathworkLabel === 'Pre-Session') {
      store.setPhase('flow');
    } else {
      if (lastSession) setShowComplete(true);
    }
  }, [breathworkLabel, store, lastSession]);

  const handleCompletePriority = useCallback(() => {
    if (store.selectedPriorityId) {
      store.completePriority(store.selectedPriorityId);
      store.setSelectedPriorityId(null);
    }
  }, [store]);

  // Guard: auth
  if (!loading && !user) {
    router.replace('/auth/login?redirect=/tools/flowzone/preview');
    return null;
  }

  // Guard: mounting
  if (!store.mounted || loading) {
    return (
      <div className="min-h-screen bg-ground flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
      </div>
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

  // Full-screen flow session
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
    <div className="min-h-screen bg-ground text-white flex flex-col">
      {/* Preview header */}
      <header className="flex items-center justify-between px-6 py-4 pl-[68px]">
        <div className="flex items-center gap-3">
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
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600 bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/[0.08]">
            Preview
          </span>
        </div>

        {/* A/B Toggle */}
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
        >
          {(['a', 'b'] as Variant[]).map(v => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              className="px-5 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all"
              style={
                variant === v
                  ? { background: SAGE, color: 'white' }
                  : { color: '#666' }
              }
            >
              {v === 'a' ? 'Faithful A' : 'Elevated B'}
            </button>
          ))}
        </div>
      </header>

      <div className="h-px mx-6" style={{ background: FOUR_PILLAR_GRADIENT, opacity: 0.4 }} />

      <main className="flex-1 px-6 pb-6 pt-6 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {variant === 'a' ? (
            <motion.div
              key="a"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <FlowZoneLayoutA {...layoutProps} />
            </motion.div>
          ) : (
            <motion.div
              key="b"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <FlowZoneLayoutB {...layoutProps} />
            </motion.div>
          )}
        </AnimatePresence>

        {store.dayData.priorities.length > 0 && (
          <div className="text-center mt-4">
            <button onClick={store.resetDay} className="text-xs text-gray-700 hover:text-red-400 transition-colors">
              Reset Day
            </button>
          </div>
        )}
      </main>

      {/* Session Complete */}
      <AnimatePresence>
        {showComplete && lastSession && (
          <SessionComplete
            key="complete"
            priorityText={store.selectedPriority?.text || ''}
            durationMinutes={lastSession.durationMinutes}
            focusReps={lastSession.focusReps}
            onCooldown={() => {
              setShowComplete(false);
              setBreathworkLabel('Cooldown');
              setShowBreathwork(true);
            }}
            onDismiss={() => { setShowComplete(false); setLastSession(null); }}
            onComplete={handleCompletePriority}
          />
        )}
      </AnimatePresence>

      {/* Breathwork overlay */}
      <AnimatePresence>
        {showBreathwork && (
          <motion.div
            key="breathwork"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ground/95 backdrop-blur-sm flex items-center justify-center"
          >
            <Breathwork
              label={breathworkLabel}
              patternId={store.settings.breathworkPatternId}
              targetCycles={store.settings.breathworkCycles}
              onDone={handleBreathworkDone}
              onSkip={handleBreathworkDone}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
