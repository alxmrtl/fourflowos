'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SAGE, AMETHYST, BREATHWORK_PATTERNS } from './constants';
import { BreathworkPattern } from './types';
import { useBreathwork } from './useBreathwork';

const PATTERN_ACCENTS = ['#6BA292', '#5B84B1', '#7A4DA4', '#FF6F61'];

interface BreathworkProps {
  onDone: () => void;
  onSkip: () => void;
  label: string;
  /** If provided, auto-starts this pattern (no picker shown) */
  patternId?: string;
}

export default function Breathwork({ onDone, onSkip, label, patternId }: BreathworkProps) {
  const [selectedPattern, setSelectedPattern] = useState<BreathworkPattern | null>(null);
  const { isActive, currentPhase, phaseProgress, cycleCount, start, stop } = useBreathwork();
  const [autoStarted, setAutoStarted] = useState(false);

  // Auto-start with the given pattern
  useEffect(() => {
    if (patternId && !autoStarted) {
      const pattern = BREATHWORK_PATTERNS.find(p => p.id === patternId);
      if (pattern) {
        setSelectedPattern(pattern);
        start(pattern);
        setAutoStarted(true);
      }
    }
  }, [patternId, autoStarted, start]);

  const handleSelectAndStart = (pattern: BreathworkPattern) => {
    setSelectedPattern(pattern);
    start(pattern);
  };

  const handleDone = () => {
    stop();
    onDone();
  };

  const circleScale = currentPhase
    ? currentPhase.label === 'Inhale'
      ? 0.6 + 0.4 * phaseProgress
      : currentPhase.label === 'Exhale'
      ? 1.0 - 0.4 * phaseProgress
      : currentPhase.label === 'Hold'
      ? (phaseProgress < 0.01 ? 1.0 : 0.6 + 0.4 * (1 - phaseProgress * 0.05))
      : 0.8
    : 0.6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <p
        className="text-xs font-bold uppercase tracking-widest mb-4"
        style={{ color: SAGE }}
      >
        {label} Breathwork
      </p>

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
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#7A4DA4]/40 text-left transition-all group flex items-stretch gap-3 overflow-hidden"
                >
                  {/* Colored accent bar */}
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
                  {/* Wind motif icon */}
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
            {/* Breathing circle with concentric rings */}
            <div className="relative w-48 h-48 mb-8">
              {/* Outer ring — amethyst, slightly offset timing */}
              <motion.div
                className="absolute inset-[-12px] rounded-full"
                style={{
                  border: `1px solid ${AMETHYST}25`,
                }}
                animate={{ scale: circleScale * 0.95 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              {/* Middle ring */}
              <motion.div
                className="absolute inset-[-4px] rounded-full"
                style={{
                  border: `1px solid ${SAGE}20`,
                }}
                animate={{ scale: circleScale * 0.98 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
              {/* Main breathing circle */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${SAGE}40, ${AMETHYST}15)`,
                  border: `2px solid ${SAGE}60`,
                }}
                animate={{ scale: circleScale }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-white font-semibold text-lg">
                  {currentPhase?.label || '...'}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Cycle {cycleCount + 1}
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
