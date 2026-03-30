'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';

const PILLARS = [
  {
    name: 'SELF',
    color: CORAL,
    prompt: 'Open the vessel',
    phases: [
      { label: 'Inhale', durationMs: 4000 },
      { label: 'Hold', durationMs: 2000 },
      { label: 'Exhale', durationMs: 4000 },
    ],
  },
  {
    name: 'SPACE',
    color: SAGE,
    prompt: 'Clear the medium',
    phases: [
      { label: 'Inhale', durationMs: 4000 },
      { label: 'Exhale', durationMs: 6000 },
    ],
  },
  {
    name: 'STORY',
    color: STEEL,
    prompt: 'Orient forward',
    phases: [
      { label: 'Inhale', durationMs: 4000 },
      { label: 'Exhale', durationMs: 4000 },
    ],
  },
  {
    name: 'SPIRIT',
    color: AMETHYST,
    prompt: 'Drop the floor',
    phases: [
      { label: 'Inhale', durationMs: 4000 },
      { label: 'Hold', durationMs: 4000 },
      { label: 'Exhale', durationMs: 8000 },
    ],
  },
] as const;

type Phase = (typeof PILLARS)[number]['phases'][number];

interface PillarBreathProps {
  phases: readonly Phase[];
  color: string;
  onComplete: () => void;
}

// Renders one pillar breath cycle. Remounts (via key) when pillar changes.
function PillarBreath({ phases, color, onComplete }: PillarBreathProps) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const activePhases = [...phases];
    let idx = 0;
    let phaseStart = Date.now();
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - phaseStart;
      const current = activePhases[idx];

      if (elapsed >= current.durationMs) {
        idx++;
        if (idx >= activePhases.length) {
          onCompleteRef.current();
          return;
        }
        phaseStart = Date.now();
        setPhaseIdx(idx);
        setProgress(0);
      } else {
        setProgress(elapsed / current.durationMs);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentPhase = phases[phaseIdx];
  const circleScale =
    currentPhase.label === 'Inhale' ? 0.52 + 0.48 * progress
    : currentPhase.label === 'Exhale' ? 1.0 - 0.48 * progress
    : 1.0;

  return (
    <div className="relative w-48 h-48">
      {/* Outer pulse ring */}
      <motion.div
        className="absolute rounded-full"
        style={{ inset: '-20px', border: `1px solid ${color}18` }}
        animate={{ scale: circleScale * 0.9 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
      {/* Mid ring */}
      <motion.div
        className="absolute rounded-full"
        style={{ inset: '-8px', border: `1px solid ${color}28` }}
        animate={{ scale: circleScale * 0.96 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      />
      {/* Main circle */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}35 0%, ${color}10 60%, transparent 100%)`,
          border: `1.5px solid ${color}60`,
        }}
        animate={{ scale: circleScale }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
      {/* Phase label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white/80 font-light text-base tracking-wide">
          {currentPhase.label}
        </p>
      </div>
    </div>
  );
}

interface BreathEntryProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function BreathEntry({ onComplete, onSkip }: BreathEntryProps) {
  const [pillarIdx, setPillarIdx] = useState(0);
  const pillar = PILLARS[pillarIdx];

  const handleCycleComplete = () => {
    if (pillarIdx < PILLARS.length - 1) {
      setPillarIdx(i => i + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative select-none"
    >
      {/* Pillar label + prompt */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${pillarIdx}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35 }}
          className="text-center mb-12"
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: pillar.color }}
          >
            {pillar.name}
          </p>
          <p className="text-white/30 text-sm italic font-light">{pillar.prompt}</p>
        </motion.div>
      </AnimatePresence>

      {/* Breath circle — key forces remount on pillar change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`circle-${pillarIdx}`}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.88 }}
          transition={{ duration: 0.35 }}
        >
          <PillarBreath
            key={pillarIdx}
            phases={pillar.phases}
            color={pillar.color}
            onComplete={handleCycleComplete}
          />
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex gap-2.5 mt-14">
        {PILLARS.map((p, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              width: i === pillarIdx ? 16 : 6,
              height: 6,
              backgroundColor:
                i < pillarIdx
                  ? `${p.color}60`
                  : i === pillarIdx
                  ? p.color
                  : 'rgba(255,255,255,0.12)',
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* Skip */}
      <button
        onClick={onSkip}
        className="absolute bottom-8 right-8 text-[11px] text-white/20 hover:text-white/50 transition-colors tracking-wider uppercase"
      >
        skip
      </button>
    </motion.div>
  );
}
