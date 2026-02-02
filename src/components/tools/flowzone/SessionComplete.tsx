'use client';

import { motion } from 'framer-motion';
import { SAGE, STEEL, CORAL, AMETHYST, FOUR_PILLAR_GRADIENT } from './constants';

interface SessionCompleteProps {
  priorityText: string;
  durationMinutes: number;
  focusReps: number;
  onCooldown: () => void;
  onDismiss: () => void;
}

export default function SessionComplete({
  priorityText,
  durationMinutes,
  focusReps,
  onCooldown,
  onDismiss,
}: SessionCompleteProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-[#141414] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Checkmark with radial glow */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="relative w-14 h-14 mx-auto mb-5"
        >
          {/* Radial glow burst */}
          <div
            className="absolute inset-[-12px] rounded-full"
            style={{ background: `radial-gradient(circle, ${SAGE}30, transparent 70%)` }}
          />
          {/* Decorative ring */}
          <div
            className="absolute inset-[-6px] rounded-full"
            style={{ border: `1px solid ${SAGE}20` }}
          />
          <div
            className="relative w-full h-full rounded-full flex items-center justify-center"
            style={{ background: `${SAGE}20` }}
          >
            <svg className="w-7 h-7" style={{ color: SAGE }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>

        <h2 className="text-xl font-bold text-white mb-1">Session Complete</h2>
        <p className="text-gray-500 text-sm mb-6">{priorityText}</p>

        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: STEEL }}>{durationMinutes}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Minutes</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: SAGE }}>{focusReps}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Focus Reps</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onCooldown}
            className="w-full px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 text-sm font-medium transition-all"
          >
            Cooldown Breathwork
          </button>
          <button
            onClick={onDismiss}
            className="w-full px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{
              background: FOUR_PILLAR_GRADIENT,
              boxShadow: `0 2px 12px ${SAGE}30`,
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
