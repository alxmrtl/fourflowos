'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PairOption<T extends string> {
  value: T;
  word: string;
  subtext?: string;
  svg?: React.ReactNode;
  color?: string;
}

interface Props<T extends string> {
  label?: string;
  options: [PairOption<T>, PairOption<T>];
  onSelect: (value: T) => void;
}

export default function BigPair<T extends string>({ label, options, onSelect }: Props<T>) {
  const [selected, setSelected] = useState<T | null>(null);

  function handleTap(value: T) {
    if (selected) return;
    setSelected(value);
    setTimeout(() => onSelect(value), 180);
  }

  return (
    <div className="flex flex-col">
      {label && (
        <p className="text-[9px] uppercase tracking-widest text-white/25 mb-5">{label}</p>
      )}
      <div className="flex flex-col gap-3">
        {options.map(opt => {
          const isSelected = selected === opt.value;
          return (
            <motion.button
              key={opt.value}
              onClick={() => handleTap(opt.value)}
              whileTap={{ scale: 0.98 }}
              className="w-full flex flex-col items-center justify-center rounded-2xl border py-7 gap-2.5 transition-all duration-200"
              style={{
                background: isSelected
                  ? opt.color ? `${opt.color}15` : 'rgba(255,255,255,0.08)'
                  : 'rgba(255,255,255,0.025)',
                borderColor: isSelected
                  ? opt.color ? `${opt.color}55` : 'rgba(255,255,255,0.4)'
                  : 'rgba(255,255,255,0.07)',
                boxShadow: isSelected
                  ? opt.color ? `0 0 32px ${opt.color}20` : '0 0 24px rgba(255,255,255,0.05)'
                  : 'none',
              }}
            >
              {opt.svg && (
                <div
                  className="transition-opacity duration-200"
                  style={{ opacity: isSelected ? 1 : 0.4 }}
                >
                  {opt.svg}
                </div>
              )}
              <span
                className="text-2xl font-bold tracking-tight transition-colors duration-200"
                style={{ color: isSelected ? '#fff' : 'rgba(255,255,255,0.4)' }}
              >
                {opt.word}
              </span>
              {opt.subtext && (
                <span
                  className="text-[10px] tracking-wider transition-colors duration-200"
                  style={{ color: isSelected ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)' }}
                >
                  {opt.subtext}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
