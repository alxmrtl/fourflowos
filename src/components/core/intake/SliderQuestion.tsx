'use client';

import { useRef, useState } from 'react';
import { STEEL, AMETHYST } from '@/styles/brand-colors';

interface Props {
  text: string;
  leftLabel: string;
  rightLabel: string;
  onSelect: (value: number) => void;
}

export default function SliderQuestion({ text, leftLabel, rightLabel, onSelect }: Props) {
  const [value, setValue] = useState(0.5);
  const [committed, setCommitted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    setValue(v);
    // Reset auto-advance timer on each move
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!committed) {
        setCommitted(true);
        onSelect(v);
      }
    }, 600);
  }

  function handlePointerUp() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!committed) {
      setTimeout(() => {
        setCommitted(true);
        onSelect(value);
      }, 400);
    }
  }

  const fillPct = value * 100;

  return (
    <div className="flex flex-col">
      <p className="text-[9px] uppercase tracking-widest text-white/25 mb-5">Body awareness</p>
      <p className="text-white text-base font-medium leading-snug mb-8">{text}</p>

      {/* Slider */}
      <div className="relative mb-4">
        {/* Track */}
        <div className="h-0.5 rounded-full bg-white/[0.08] relative overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-75"
            style={{ width: `${fillPct}%`, background: `linear-gradient(90deg, ${STEEL}, ${AMETHYST})` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value}
          onChange={handleChange}
          onPointerUp={handlePointerUp}
          disabled={committed}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ margin: 0, padding: 0 }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white/60 bg-[#0f0f0f] pointer-events-none"
          style={{ left: `calc(${fillPct}% - 8px)`, transition: 'left 0.05s linear' }}
        />
      </div>

      <div className="flex justify-between">
        <span className="text-[10px] text-white/30">{leftLabel}</span>
        <span className="text-[10px] text-white/30">{rightLabel}</span>
      </div>
    </div>
  );
}
