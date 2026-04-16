'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';

type Pillar = 'self' | 'space' | 'story' | 'spirit';

const PILLAR_COLOR: Record<Pillar, string> = {
  self: CORAL, space: SAGE, story: STEEL, spirit: AMETHYST,
};

interface Option {
  value: Pillar;
  label: string;
}

interface Props {
  text: string;
  options: Option[];
  timeoutMs?: number;
  onSelect: (value: Pillar, elapsedMs: number) => void;
}

const TIMER_DURATION = 3000; // ms

export default function InstinctTap({ text, options, timeoutMs = TIMER_DURATION, onSelect }: Props) {
  const [selected, setSelected] = useState<Pillar | null>(null);
  const startRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // track whether we've already fired onSelect (timer expiry or tap)
  const firedRef = useRef(false);

  useEffect(() => {
    startRef.current = Date.now();
    firedRef.current = false;
    timerRef.current = setTimeout(() => {
      if (!firedRef.current) {
        firedRef.current = true;
        // timer expired without selection — skip (null treated upstream as no vote)
        onSelect('self', timeoutMs); // pass timeout signal: full duration = no instinct
      }
    }, timeoutMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTap(value: Pillar) {
    if (firedRef.current) return;
    firedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    const elapsed = Date.now() - startRef.current;
    setSelected(value);
    setTimeout(() => onSelect(value, elapsed), 180);
  }

  // Progress: 0→1 over timeoutMs
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      setProgress(Math.min(elapsed / timeoutMs, 1));
    }, 50);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const circumference = 2 * Math.PI * 10;

  return (
    <div className="flex flex-col">
      {/* Timer ring + label */}
      <div className="flex items-center gap-2.5 mb-5">
        <svg width="26" height="26" className="flex-shrink-0 -rotate-90">
          <circle cx="13" cy="13" r="10" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
          <circle
            cx="13" cy="13" r="10"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${(1 - progress) * circumference} ${circumference}`}
            style={{ transition: 'stroke-dasharray 0.05s linear' }}
          />
        </svg>
        <p className="text-[9px] uppercase tracking-widest text-white/25">First instinct</p>
      </div>

      <p className="text-white text-base font-medium leading-snug mb-5">{text}</p>

      {/* 2×2 grid */}
      <div className="grid grid-cols-2 gap-2">
        {options.map(opt => {
          const color = PILLAR_COLOR[opt.value];
          const isSelected = selected === opt.value;
          return (
            <motion.button
              key={opt.value}
              onClick={() => handleTap(opt.value)}
              whileTap={{ scale: 0.97 }}
              className="text-left px-3.5 py-3 rounded-xl border text-sm leading-snug transition-all duration-150"
              style={{
                background: isSelected ? `${color}20` : 'rgba(255,255,255,0.03)',
                borderColor: isSelected ? `${color}60` : 'rgba(255,255,255,0.07)',
                color: isSelected ? '#fff' : 'rgba(255,255,255,0.55)',
              }}
            >
              {opt.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
