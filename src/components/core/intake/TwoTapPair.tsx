'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TapOption {
  id: string;
  label: string;
}

export interface TwoTapResult {
  clearest: string;
  haziest: string;
}

interface Props {
  label?: string;
  prompt1: string;
  prompt2: string;
  options: TapOption[];
  onComplete: (result: TwoTapResult) => void;
}

export default function TwoTapPair({ label, prompt1, prompt2, options, onComplete }: Props) {
  const [phase, setPhase] = useState<'first' | 'second'>('first');
  const [clearest, setClearest] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const currentOptions = phase === 'first' ? options : options.filter(o => o.id !== clearest);

  function handleFirst(id: string) {
    if (selected) return;
    setSelected(id);
    setTimeout(() => {
      setClearest(id);
      setSelected(null);
      setPhase('second');
    }, 220);
  }

  function handleSecond(id: string) {
    if (selected) return;
    setSelected(id);
    setTimeout(() => {
      onComplete({ clearest: clearest!, haziest: id });
    }, 220);
  }

  return (
    <div className="flex flex-col">
      {label && (
        <p className="text-[9px] uppercase tracking-widest text-white/25 mb-4">{label}</p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.16 }}
          className="flex flex-col"
        >
          <p className="text-white text-sm font-medium leading-snug mb-5">
            {phase === 'first' ? prompt1 : prompt2}
          </p>
          <div className="space-y-2">
            {currentOptions.map(opt => {
              const isSelected = selected === opt.id;
              return (
                <motion.button
                  key={opt.id}
                  onClick={() => phase === 'first' ? handleFirst(opt.id) : handleSecond(opt.id)}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200"
                  style={{
                    background: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.025)',
                    borderColor: isSelected ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.07)',
                    color: isSelected ? '#fff' : 'rgba(255,255,255,0.45)',
                  }}
                >
                  {opt.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
