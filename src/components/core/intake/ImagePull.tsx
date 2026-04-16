'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ── SVG icons ──────────────────────────────────────────────────────────────────
// 32×32 viewBox, stroke="currentColor", fill="none"

function PulseSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1,16 H8 L11,5 L16,27 L21,9 L24,16 H31"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function OpenSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.8" />
      <line x1="16" y1="1"  x2="16" y2="8"  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="24" x2="16" y2="31" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="1"  y1="16" x2="8"  y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="24" y1="16" x2="31" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="5.3"  y1="5.3"  x2="10.3" y2="10.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="21.7" y1="5.3"  x2="26.7" y2="10.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" transform="scale(-1,1) translate(-32,0)" />
      <line x1="5.3"  y1="26.7" x2="10.3" y2="21.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="21.7" y1="21.7" x2="26.7" y2="26.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SetupSVG() {
  const positions = [6, 16, 26] as const;
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {positions.flatMap(x =>
        positions.map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="currentColor" />
        ))
      )}
    </svg>
  );
}

function TangleSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3,9 C10,9 13,23 20,23 C27,23 29,9 31,9"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"
      />
      <path
        d="M3,23 C7,23 13,9 20,9 C27,9 29,23 31,23"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"
      />
    </svg>
  );
}

function HorizonSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="2"  y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="2"  y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="2"  y1="20" x2="18" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M21,10 L30,16 L21,22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function PeakSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16,4 L30,28 L2,28 Z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <line x1="16" y1="15" x2="16" y2="28" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

function FlameSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16,30 C9,26 8,20 9,15 C10,11 12,8 11,4 C14,7 18,5 18,10 C20,7 23,10 22,14 C24,12 25,15 24,18 C24,24 23,27 16,30Z"
        stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M16,27 C13,24 13,21 14,19 C15,17 16,17 16,19 C17,17 18,18 18,20 C18,23 17,26 16,27Z"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.45"
      />
    </svg>
  );
}

function NorthSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16,2 L18.8,13.2 L30,16 L18.8,18.8 L16,30 L13.2,18.8 L2,16 L13.2,13.2 Z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Image config ───────────────────────────────────────────────────────────────

interface ImageOption {
  id: string;
  label: string;
  svg: React.ReactNode;
}

const IMAGES: ImageOption[] = [
  { id: 'pulse',   label: 'SIGNAL',   svg: <PulseSVG /> },
  { id: 'open',    label: 'OPEN',     svg: <OpenSVG /> },
  { id: 'setup',   label: 'SETUP',    svg: <SetupSVG /> },
  { id: 'tangle',  label: 'TANGLE',   svg: <TangleSVG /> },
  { id: 'horizon', label: 'HORIZON',  svg: <HorizonSVG /> },
  { id: 'peak',    label: 'PEAK',     svg: <PeakSVG /> },
  { id: 'flame',   label: 'FLAME',    svg: <FlameSVG /> },
  { id: 'north',   label: 'NORTH',    svg: <NorthSVG /> },
];

// ── Component ──────────────────────────────────────────────────────────────────

interface Props {
  onSelect: (images: string[]) => void;
}

export default function ImagePull({ onSelect }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);

  function toggle(id: string) {
    if (locked) return;
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 2) return prev;
      const next = [...prev, id];
      if (next.length === 2) {
        setLocked(true);
        setTimeout(() => onSelect(next), 320);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col">
      <p className="text-[9px] uppercase tracking-widest text-white/25 mb-1.5">Image pull</p>
      <p className="text-white text-base font-medium leading-snug mb-1">Pick 2 that feel most true.</p>
      <p className="text-[11px] text-white/30 mb-5 leading-relaxed">Right now, in this moment.</p>

      <div className="grid grid-cols-4 gap-2 mb-5">
        {IMAGES.map((img, i) => {
          const isSelected = selected.includes(img.id);
          const isFull = selected.length >= 2 && !isSelected;
          return (
            <motion.button
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => toggle(img.id)}
              disabled={isFull}
              className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all duration-150"
              style={{
                background:  isSelected ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.025)',
                borderColor: isSelected ? 'rgba(255,255,255,0.4)'  : 'rgba(255,255,255,0.07)',
                color:       isSelected ? 'rgba(255,255,255,0.95)' : isFull ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.35)',
                boxShadow:   isSelected ? '0 0 14px rgba(255,255,255,0.07)' : 'none',
              }}
            >
              {img.svg}
              <span className="text-[7px] uppercase tracking-widest font-semibold leading-none">
                {img.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* progress dots */}
      <div className="flex items-center justify-center gap-2">
        {[0, 1].map(i => (
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
