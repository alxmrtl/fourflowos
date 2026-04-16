'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';

type Pillar = 'self' | 'space' | 'story' | 'spirit';

const PILLAR_COLOR: Record<Pillar, string> = {
  self: CORAL, space: SAGE, story: STEEL, spirit: AMETHYST,
};

// ── Inline SVG Shapes ──────────────────────────────────────────────────────────

function SpiralShape({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M28 28
           C 28 22.5 34 18 38.5 22
           C 43 26 40 36 33 38
           C 22 41 13 33 13 24
           C 13 13 22 6 33 6
           C 46 6 53 16 52 28
           C 51 36 46 42 40 44"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="28" cy="28" r="2.5" fill={color} opacity="0.7" />
    </svg>
  );
}

function GridShape({ color }: { color: string }) {
  const dots: React.ReactNode[] = [];
  const count = 4;
  const spacing = 13;
  const start = 28 - (spacing * (count - 1)) / 2;
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={start + c * spacing}
          cy={start + r * spacing}
          r="2.2"
          fill={color}
        />
      );
    }
  }
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {dots}
    </svg>
  );
}

function ArrowShape({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Speed lines */}
      <line x1="6" y1="22" x2="16" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="4" y1="28" x2="14" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="6" y1="34" x2="16" y2="34" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      {/* Main arrow */}
      <path d="M 16 28 L 42 28" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      <path d="M 34 19 L 44 28 L 34 37" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function StarburstShape({ color }: { color: string }) {
  const rays: React.ReactNode[] = [];
  const cx = 28, cy = 28;
  const innerR = 5, outerR = 24;
  for (let i = 0; i < 8; i++) {
    const angle = (i * 45 * Math.PI) / 180;
    const x1 = cx + innerR * Math.cos(angle);
    const y1 = cy + innerR * Math.sin(angle);
    const x2 = cx + outerR * Math.cos(angle);
    const y2 = cy + outerR * Math.sin(angle);
    rays.push(
      <line
        key={i}
        x1={x1} y1={y1}
        x2={x2} y2={y2}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    );
  }
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {rays}
      <circle cx={cx} cy={cy} r="4" fill={color} opacity="0.45" />
    </svg>
  );
}

const SHAPE: Record<Pillar, (color: string) => React.ReactNode> = {
  self:   (c) => <SpiralShape color={c} />,
  space:  (c) => <GridShape color={c} />,
  story:  (c) => <ArrowShape color={c} />,
  spirit: (c) => <StarburstShape color={c} />,
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  onSelect: (value: Pillar, elapsedMs: number) => void;
}

const TIMER_DURATION = 5000;

export default function ShapePick({ onSelect }: Props) {
  const pillars = useMemo(() => shuffleArray(['self', 'space', 'story', 'spirit'] as Pillar[]), []);
  const [selected, setSelected] = useState<Pillar | null>(null);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(Date.now());
  const firedRef = useRef(false);

  useEffect(() => {
    startRef.current = Date.now();
    firedRef.current = false;

    const timeout = setTimeout(() => {
      if (!firedRef.current) {
        firedRef.current = true;
        onSelect(pillars[0], TIMER_DURATION);
      }
    }, TIMER_DURATION);

    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      setProgress(Math.min(elapsed / TIMER_DURATION, 1));
    }, 50);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTap(pillar: Pillar) {
    if (firedRef.current) return;
    firedRef.current = true;
    const elapsed = Date.now() - startRef.current;
    setSelected(pillar);
    setTimeout(() => onSelect(pillar, elapsed), 200);
  }

  const circumference = 2 * Math.PI * 10;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2.5 mb-6">
        <svg width="26" height="26" className="flex-shrink-0 -rotate-90">
          <circle cx="13" cy="13" r="10" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
          <circle
            cx="13" cy="13" r="10"
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${(1 - progress) * circumference} ${circumference}`}
            style={{ transition: 'stroke-dasharray 0.05s linear' }}
          />
        </svg>
        <p className="text-[9px] uppercase tracking-widest text-white/25">First instinct</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {pillars.map(pillar => {
          const color = PILLAR_COLOR[pillar];
          const isSelected = selected === pillar;
          return (
            <motion.button
              key={pillar}
              onClick={() => handleTap(pillar)}
              whileTap={{ scale: 0.94 }}
              className="rounded-2xl border flex items-center justify-center transition-all duration-200"
              style={{
                height: 120,
                background: isSelected ? `${color}1A` : 'rgba(255,255,255,0.025)',
                borderColor: isSelected ? `${color}55` : 'rgba(255,255,255,0.07)',
                boxShadow: isSelected ? `0 0 32px ${color}28` : 'none',
              }}
            >
              <div
                className="transition-all duration-200"
                style={{ opacity: isSelected ? 1 : 0.35 }}
              >
                {SHAPE[pillar](isSelected ? color : 'rgba(255,255,255,0.8)')}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
