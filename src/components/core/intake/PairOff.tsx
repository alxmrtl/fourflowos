'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Pillar = 'self' | 'space' | 'story' | 'spirit';

interface PairOffOption {
  value: Pillar;
  label: string;
}

// Tournament: 3 rounds, 4 contenders
// Round 0: body vs direction
// Round 1: winner vs purpose
// Round 2: winner vs environment
const INITIAL_PAIR: [PairOffOption, PairOffOption] = [
  { value: 'self',  label: 'MY BODY' },
  { value: 'story', label: 'MY DIRECTION' },
];

const CHALLENGERS: PairOffOption[] = [
  { value: 'spirit', label: 'MY PURPOSE' },
  { value: 'space',  label: 'MY ENVIRONMENT' },
];

const TOTAL_ROUNDS = 3;

interface Props {
  onComplete: (winner: Pillar) => void;
}

export default function PairOff({ onComplete }: Props) {
  const [round, setRound] = useState(0);
  const [pair, setPair] = useState<[PairOffOption, PairOffOption]>(INITIAL_PAIR);
  const [selected, setSelected] = useState<Pillar | null>(null);
  const [animKey, setAnimKey] = useState(0);

  function handleTap(opt: PairOffOption) {
    if (selected) return;
    setSelected(opt.value);

    setTimeout(() => {
      const nextRound = round + 1;
      if (nextRound >= TOTAL_ROUNDS) {
        onComplete(opt.value);
      } else {
        const challenger = CHALLENGERS[nextRound - 1];
        setPair([opt, challenger]);
        setRound(nextRound);
        setSelected(null);
        setAnimKey(k => k + 1);
      }
    }, 240);
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[9px] uppercase tracking-widest text-white/25">
          Which matters more right now
        </p>
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
              style={{ background: i <= round ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)' }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={animKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.16 }}
          className="flex flex-col gap-3"
        >
          {pair.map(opt => {
            const isSelected = selected === opt.value;
            return (
              <motion.button
                key={opt.value}
                onClick={() => handleTap(opt)}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center rounded-2xl border py-9 transition-all duration-200"
                style={{
                  background: isSelected ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.025)',
                  borderColor: isSelected ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.07)',
                  boxShadow: isSelected ? '0 0 28px rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <span
                  className="text-xl font-bold tracking-tight transition-colors duration-200"
                  style={{ color: isSelected ? '#fff' : 'rgba(255,255,255,0.42)' }}
                >
                  {opt.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
