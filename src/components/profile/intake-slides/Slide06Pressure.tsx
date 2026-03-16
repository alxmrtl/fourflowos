'use client';

import { motion } from 'framer-motion';
import CardPicker from '../intake-ui/CardPicker';
import type { StressPattern } from '@/types/intake';

const ACCENT = '#E84535';

const STRESS_PATTERNS: { value: StressPattern; title: string; description: string; emoji: string }[] = [
  {
    value: 'tightening',
    title: 'I hold tension',
    description: 'Shoulders, jaw, chest — the body grips and braces.',
    emoji: '✊',
  },
  {
    value: 'collapse',
    title: 'I lose energy',
    description: 'I flatten out, go quiet, want to disappear.',
    emoji: '🫠',
  },
  {
    value: 'restlessness',
    title: 'I can\'t stop moving',
    description: 'Pacing, scrolling, doing — anything to not sit still.',
    emoji: '🔄',
  },
  {
    value: 'numbness',
    title: 'I disconnect',
    description: 'I go through the motions but I\'m not really there.',
    emoji: '👻',
  },
];

interface Props {
  data: { self_body_stress: StressPattern | '' };
  onChange: (field: string, value: string) => void;
}

export default function Slide06Pressure({ data, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Under pressure
        </h2>
        <p className="text-gray-400 text-sm">
          When stress or pressure hits, my body&apos;s most reliable response:
        </p>
      </div>

      <CardPicker
        options={STRESS_PATTERNS}
        selected={data.self_body_stress}
        onChange={(v) => onChange('self_body_stress', v)}
        accent={ACCENT}
        columns={2}
      />
    </motion.div>
  );
}
