'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ThreeOption<T extends string> {
  value: T;
  primary: string;
  secondary?: string;
  color?: string;
}

interface Props<T extends string> {
  label?: string;
  prompt?: string;
  options: [ThreeOption<T>, ThreeOption<T>, ThreeOption<T>];
  onSelect: (value: T) => void;
}

export default function ThreeWayTap<T extends string>({ label, prompt, options, onSelect }: Props<T>) {
  const [selected, setSelected] = useState<T | null>(null);

  function handleTap(value: T) {
    if (selected) return;
    setSelected(value);
    setTimeout(() => onSelect(value), 200);
  }

  return (
    <div className="flex flex-col">
      {label && (
        <p className="text-[9px] uppercase tracking-widest text-white/25 mb-4">{label}</p>
      )}
      {prompt && (
        <p className="text-white text-base font-medium leading-snug mb-6">{prompt}</p>
      )}
      <div className="flex flex-col gap-2.5">
        {options.map(opt => {
          const isSelected = selected === opt.value;
          return (
            <motion.button
              key={opt.value}
              onClick={() => handleTap(opt.value)}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200"
              style={{
                background: isSelected
                  ? opt.color ? `${opt.color}15` : 'rgba(255,255,255,0.08)'
                  : 'rgba(255,255,255,0.025)',
                borderColor: isSelected
                  ? opt.color ? `${opt.color}55` : 'rgba(255,255,255,0.35)'
                  : 'rgba(255,255,255,0.07)',
                boxShadow: isSelected
                  ? opt.color ? `0 0 24px ${opt.color}18` : 'none'
                  : 'none',
              }}
            >
              <span
                className="text-base font-semibold block transition-colors duration-200"
                style={{ color: isSelected ? '#fff' : 'rgba(255,255,255,0.5)' }}
              >
                {opt.primary}
              </span>
              {opt.secondary && (
                <span
                  className="text-xs mt-0.5 block transition-colors duration-200"
                  style={{ color: isSelected ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)' }}
                >
                  {opt.secondary}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
