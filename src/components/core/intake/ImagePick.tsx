'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';

type Pillar = 'self' | 'space' | 'story' | 'spirit';

const PILLAR_COLOR: Record<Pillar, string> = {
  self: CORAL, space: SAGE, story: STEEL, spirit: AMETHYST,
};

const IMAGES: Record<Pillar, string> = {
  self:   '/assets/LOGOS/MAIN LOGO - ELEMENTS/SELF - Frequencies.png',
  space:  '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPACE - Sqaure.png',
  story:  '/assets/LOGOS/MAIN LOGO - ELEMENTS/STORY - Cross.png',
  spirit: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPIRIT - Circle.png',
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  text: string;
  onSelect: (value: Pillar) => void;
}

export default function ImagePick({ text, onSelect }: Props) {
  const [selected, setSelected] = useState<Pillar | null>(null);
  // Shuffle once on mount
  const pillars = useMemo(() => shuffle(['self', 'space', 'story', 'spirit'] as Pillar[]), []);

  function handlePick(pillar: Pillar) {
    if (selected) return;
    setSelected(pillar);
    setTimeout(() => onSelect(pillar), 220);
  }

  return (
    <div className="flex flex-col">
      <p className="text-[9px] uppercase tracking-widest text-white/25 mb-5">Intuitive resonance</p>
      <p className="text-white text-base font-medium leading-snug mb-6">{text}</p>

      <div className="grid grid-cols-2 gap-3">
        {pillars.map(pillar => {
          const color = PILLAR_COLOR[pillar];
          const isSelected = selected === pillar;
          return (
            <motion.button
              key={pillar}
              onClick={() => handlePick(pillar)}
              whileTap={{ scale: 0.95 }}
              className="relative rounded-2xl border overflow-hidden flex items-center justify-center"
              style={{
                height: 110,
                background: isSelected ? `${color}18` : 'rgba(255,255,255,0.03)',
                borderColor: isSelected ? `${color}60` : 'rgba(255,255,255,0.07)',
                boxShadow: isSelected ? `0 0 20px ${color}30` : 'none',
                transition: 'all 0.18s ease',
              }}
            >
              <div className="relative w-14 h-14">
                <Image
                  src={IMAGES[pillar]}
                  alt=""
                  fill
                  className="object-contain"
                  style={{
                    filter: isSelected
                      ? `drop-shadow(0 0 8px ${color}cc)`
                      : 'brightness(0.7)',
                    transition: 'filter 0.18s ease',
                  }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
