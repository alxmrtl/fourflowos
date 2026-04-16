'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

// 16 words, 4 per pillar — mapped in route.ts, not here
const WORDS: string[] = [
  'ALIVE',    'FOGGY',    'GROUNDED',  'SCATTERED',  // SELF
  'CLUTTERED','EQUIPPED', 'SQUEEZED',  'FLUID',       // SPACE
  'DRIFTING', 'BUILDING', 'STUCK',     'FOCUSED',     // STORY
  'RESTLESS', 'IGNITED',  'HOLLOW',    'CALLED',      // SPIRIT
];

function shuffle(arr: string[]): string[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  onSelect: (words: string[]) => void;
}

export default function WordStorm({ onSelect }: Props) {
  const words = useMemo(() => shuffle(WORDS), []);
  const [selected, setSelected] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);

  function toggle(word: string) {
    if (locked) return;
    setSelected(prev => {
      if (prev.includes(word)) return prev.filter(w => w !== word);
      if (prev.length >= 3) return prev;
      const next = [...prev, word];
      if (next.length === 3) {
        setLocked(true);
        setTimeout(() => onSelect(next), 320);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col">
      <p className="text-[9px] uppercase tracking-widest text-white/25 mb-1.5">Word storm</p>
      <p className="text-white text-base font-medium leading-snug mb-1">Pick 3 that land.</p>
      <p className="text-[11px] text-white/30 mb-5 leading-relaxed">
        Don&apos;t think — pick what surfaces first.
      </p>

      <div className="grid grid-cols-4 gap-2 mb-5">
        {words.map((word, i) => {
          const isSelected = selected.includes(word);
          const isFull = selected.length >= 3 && !isSelected;
          return (
            <motion.button
              key={word}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.025, duration: 0.18 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => toggle(word)}
              disabled={isFull}
              className="py-2.5 px-1 rounded-xl border text-[9px] uppercase tracking-widest font-semibold text-center leading-tight transition-all duration-150"
              style={{
                background:   isSelected ? 'rgba(255,255,255,0.1)'  : 'rgba(255,255,255,0.025)',
                borderColor:  isSelected ? 'rgba(255,255,255,0.4)'  : 'rgba(255,255,255,0.07)',
                color:        isSelected ? 'rgba(255,255,255,0.95)' : isFull ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.32)',
                boxShadow:    isSelected ? '0 0 12px rgba(255,255,255,0.06)' : 'none',
              }}
            >
              {word}
            </motion.button>
          );
        })}
      </div>

      {/* progress dots */}
      <div className="flex items-center justify-center gap-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{
              background: i < selected.length ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.12)',
              scale: i < selected.length ? 1.15 : 1,
            }}
            transition={{ duration: 0.18 }}
            className="w-1.5 h-1.5 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
