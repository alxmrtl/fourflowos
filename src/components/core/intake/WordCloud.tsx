'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const WORDS = [
  'CLEAR', 'FOGGY', 'GROUNDED', 'SCATTERED',
  'PULLED', 'STUCK', 'ALIGNED', 'DRIFTING',
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  maxSelect?: number;
  onSelect: (words: string[]) => void;
}

export default function WordCloud({ maxSelect = 2, onSelect }: Props) {
  const words = useMemo(() => shuffle(WORDS), []);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function toggle(word: string) {
    if (submitted) return;
    setSelected(prev => {
      if (prev.includes(word)) {
        return prev.filter(w => w !== word);
      }
      if (prev.length >= maxSelect) return prev;
      const next = [...prev, word];
      if (next.length === maxSelect) {
        setSubmitted(true);
        setTimeout(() => onSelect(next), 280);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col">
      <p className="text-[9px] uppercase tracking-widest text-white/25 mb-1.5">What&apos;s true right now</p>
      <p className="text-white/30 text-xs mb-7">Pick {maxSelect}</p>
      <div className="flex flex-wrap gap-2.5 justify-center">
        {words.map((word, i) => {
          const isSelected = selected.includes(word);
          const isFull = selected.length >= maxSelect && !isSelected;
          return (
            <motion.button
              key={word}
              onClick={() => toggle(word)}
              whileTap={{ scale: 0.94 }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
              disabled={isFull}
              className="px-4 py-2.5 rounded-xl border text-[13px] font-semibold tracking-widest transition-all duration-200"
              style={{
                background: isSelected ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                borderColor: isSelected ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.08)',
                color: isSelected ? '#fff' : isFull ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.38)',
                boxShadow: isSelected ? '0 0 16px rgba(255,255,255,0.08)' : 'none',
              }}
            >
              {word}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
