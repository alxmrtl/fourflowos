'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SAGE, AMETHYST, CORAL, BREATHWORK_PATTERNS } from './constants';
import { BreathworkPattern } from './types';
import { useBreathwork } from './useBreathwork';

const PATTERN_ACCENTS = ['#4E8C73', '#3E6FA3', '#6330A0', '#E84535'];

const PHASE_COLOR: Record<string, string> = {
  Inhale: SAGE,
  Hold:   AMETHYST,
  Exhale: CORAL,
};

interface BreathworkProps {
  onDone: () => void;
  onSkip: () => void;
  label: string;
  targetCycles: number;
  /** If provided, auto-starts this pattern (no picker shown) */
  patternId?: string;
}

interface GlowRing {
  id: number;
  cx: number;
  cy: number;
}

export default function Breathwork({ onDone, onSkip, label, targetCycles, patternId }: BreathworkProps) {
  const [selectedPattern, setSelectedPattern] = useState<BreathworkPattern | null>(null);
  const { isActive, isComplete, currentPhase, phaseProgress, cycleProgress, cycleCount, start, stop } = useBreathwork();
  const [autoStarted, setAutoStarted] = useState(false);
  const [glowRings, setGlowRings] = useState<GlowRing[]>([]);

  // Track hold phase entry time for micro-pulse
  const holdStartRef     = useRef<number | null>(null);
  const lastPhaseRef     = useRef<string | null>(null);
  const prevCycleRef     = useRef(0);

  const phaseLabel = currentPhase?.label ?? null;
  if (phaseLabel !== lastPhaseRef.current) {
    lastPhaseRef.current = phaseLabel;
    holdStartRef.current = phaseLabel === 'Hold' ? Date.now() : null;
  }

  // Dot position helper (shared between render and effect)
  const getDotPos = (i: number) => {
    const angle = (i / targetCycles) * 2 * Math.PI - Math.PI / 2;
    return { cx: 120 + 112 * Math.cos(angle), cy: 120 + 112 * Math.sin(angle) };
  };

  // Detect cycle completion → fire glow ring at that dot
  useEffect(() => {
    if (cycleCount > prevCycleRef.current && isActive) {
      const completedIdx = cycleCount - 1;
      if (completedIdx >= 0 && completedIdx < targetCycles) {
        const pos = getDotPos(completedIdx);
        const id = Date.now() + completedIdx;
        setGlowRings(prev => [...prev, { id, ...pos }]);
        setTimeout(() => setGlowRings(prev => prev.filter(r => r.id !== id)), 900);
      }
    }
    prevCycleRef.current = cycleCount;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleCount, isActive, targetCycles]);

  // Auto-start with given pattern
  useEffect(() => {
    if (patternId && !autoStarted) {
      const pattern = BREATHWORK_PATTERNS.find(p => p.id === patternId);
      if (pattern) {
        setSelectedPattern(pattern);
        start(pattern, targetCycles);
        setAutoStarted(true);
      }
    }
  }, [patternId, autoStarted, start, targetCycles]);

  // Auto-advance when all cycles complete
  useEffect(() => {
    if (isComplete) {
      stop();
      onDone();
    }
  }, [isComplete, stop, onDone]);

  const handleSelectAndStart = (pattern: BreathworkPattern) => {
    setSelectedPattern(pattern);
    start(pattern, targetCycles);
  };

  const handleDone = () => {
    stop();
    onDone();
  };

  // Scale: Hold phases fixed to holdScale + very subtle sine micro-pulse
  const circleScale = (() => {
    if (!currentPhase) return 0.6;
    if (currentPhase.label === 'Inhale') return 0.6 + 0.4 * phaseProgress;
    if (currentPhase.label === 'Exhale') return 1.0 - 0.4 * phaseProgress;
    const holdElapsed = holdStartRef.current ? Date.now() - holdStartRef.current : 0;
    return (currentPhase.holdScale ?? 1.0) + Math.sin(holdElapsed / 1600) * 0.013;
  })();

  // Shorter Framer transition during hold so micro-pulse isn't over-smoothed
  const orbTransition = currentPhase?.label === 'Hold'
    ? { duration: 0.09, ease: 'easeOut' as const }
    : { duration: 0.3,  ease: 'easeOut' as const };

  const phaseAccent = PHASE_COLOR[currentPhase?.label ?? ''] ?? SAGE;

  // Orbit dots with progressive opacity on the active cycle dot
  const orbitDots = Array.from({ length: targetCycles }, (_, i) => {
    const pos = getDotPos(i);
    const completed = i < cycleCount;
    const current   = i === cycleCount;
    return {
      ...pos,
      fill:    completed || current ? SAGE : 'rgba(255,255,255,0.08)',
      opacity: completed ? 1 : current ? Math.max(0.15, cycleProgress) : 1,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <AnimatePresence mode="wait">
        {!isActive ? (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Choose a breathing pattern
            </h3>
            <div className="space-y-2 max-w-sm mx-auto mb-8">
              {BREATHWORK_PATTERNS.map((pattern, i) => (
                <button
                  key={pattern.id}
                  onClick={() => handleSelectAndStart(pattern)}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#6330A0]/40 text-left transition-all group flex items-stretch gap-3 overflow-hidden"
                >
                  <div
                    className="w-1 rounded-full flex-shrink-0"
                    style={{ background: PATTERN_ACCENTS[i % PATTERN_ACCENTS.length] }}
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm group-hover:translate-x-1 transition-transform">
                      {pattern.name}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{pattern.description}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0 self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8h12a4 4 0 100-8M3 16h10a4 4 0 110 8M3 12h16a4 4 0 100-8" />
                  </svg>
                </button>
              ))}
            </div>
            <button
              onClick={onSkip}
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Skip breathwork
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            {/* Orb + orbit progress dots */}
            <div className="relative w-48 h-48 mb-8">

              {/* Orbit dots SVG — overall cycle progress */}
              <svg
                className="absolute pointer-events-none"
                style={{ inset: -24, width: 'calc(100% + 48px)', height: 'calc(100% + 48px)' }}
                viewBox="0 0 240 240"
              >
                {/* Static dots */}
                {orbitDots.map((dot, i) => (
                  <circle
                    key={i}
                    cx={dot.cx}
                    cy={dot.cy}
                    r={3.5}
                    fill={dot.fill}
                    opacity={dot.opacity}
                  />
                ))}

                {/* Glow rings — fire outward on cycle completion */}
                {glowRings.map(ring => (
                  <motion.circle
                    key={ring.id}
                    cx={ring.cx}
                    cy={ring.cy}
                    r={3.5}
                    fill="none"
                    stroke={SAGE}
                    strokeWidth={2}
                    initial={{ r: 3.5, opacity: 0.9, strokeWidth: 2 }}
                    animate={{ r: 18,  opacity: 0,   strokeWidth: 0.5 }}
                    transition={{ duration: 0.75, ease: 'easeOut' }}
                  />
                ))}
              </svg>

              {/* Outer ring */}
              <motion.div
                className="absolute inset-[-12px] rounded-full"
                style={{ border: `1px solid ${AMETHYST}22` }}
                animate={{ scale: circleScale * 0.95 }}
                transition={orbTransition}
              />
              {/* Middle ring — tints with phase */}
              <motion.div
                className="absolute inset-[-4px] rounded-full"
                style={{
                  border: `1px solid ${phaseAccent}20`,
                  transition: 'border-color 0.8s ease',
                }}
                animate={{ scale: circleScale * 0.98 }}
                transition={orbTransition}
              />
              {/* Main orb — border + glow shift with phase */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${SAGE}38, ${AMETHYST}14)`,
                  border: `2px solid ${phaseAccent}55`,
                  boxShadow: `0 0 24px ${phaseAccent}1a`,
                  transition: 'border-color 0.8s ease, box-shadow 0.8s ease',
                }}
                animate={{ scale: circleScale }}
                transition={orbTransition}
              />

              {/* Phase label + cycle counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-white font-semibold text-lg">
                  {currentPhase?.label || '...'}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {cycleCount + 1} / {targetCycles}
                </p>
              </div>
            </div>

            <p className="text-gray-500 text-sm mb-1">{selectedPattern?.name}</p>

            <button
              onClick={handleDone}
              className="mt-6 px-6 py-2.5 rounded-full text-white text-sm font-semibold transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${SAGE}, ${AMETHYST}cc)`,
                boxShadow: `0 2px 12px ${SAGE}30`,
              }}
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
