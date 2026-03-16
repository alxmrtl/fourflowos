'use client';

import { motion } from 'framer-motion';
import type { Season } from '@/types/intake';

const SEASONS: { value: Season; label: string; description: string; emoji: string }[] = [
  {
    value: 'spring',
    label: 'Spring',
    description: 'Something new is emerging — tentative, possible, not yet proven.',
    emoji: '🌱',
  },
  {
    value: 'summer',
    label: 'Summer',
    description: 'Full momentum. The work is happening. Energy is high.',
    emoji: '☀️',
  },
  {
    value: 'autumn',
    label: 'Autumn',
    description: 'Harvesting what was built. Some things are ending. Clarity is coming.',
    emoji: '🍂',
  },
  {
    value: 'winter',
    label: 'Winter',
    description: 'Quiet. Resting. Composting. Not visible yet — but necessary.',
    emoji: '❄️',
  },
];

interface Props {
  data: { opening_season: Season | '' };
  onChange: (field: string, value: string) => void;
}

export default function Slide03Season({ data, onChange }: Props) {
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
          What season is this?
        </h2>
        <p className="text-gray-400 text-sm">
          If your life right now were a season, which would it be?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SEASONS.map((s) => {
          const isSelected = data.opening_season === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => onChange('opening_season', s.value)}
              className={`
                text-left p-5 rounded-2xl border transition-all duration-200
                ${isSelected
                  ? 'border-white/30 bg-white/[0.08]'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                }
              `}
            >
              <div className="text-2xl mb-3">{s.emoji}</div>
              <div className={`font-semibold text-sm mb-1.5 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                {s.label}
              </div>
              <div className="text-xs text-gray-500 leading-relaxed">{s.description}</div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
