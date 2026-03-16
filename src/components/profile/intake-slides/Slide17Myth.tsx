'use client';

import { motion } from 'framer-motion';

const input = 'w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-200 text-sm';

const ARCHETYPE_HINTS = [
  { label: 'The Hero', note: 'Quest, ordeal, transformation' },
  { label: 'The Trickster', note: 'Disruption, wit, shape-shifting' },
  { label: 'The Lover', note: 'Beauty, devotion, deep feeling' },
  { label: 'The Sage', note: 'Truth-seeking, detachment, wisdom' },
  { label: 'The Creator', note: 'Vision, expression, making real' },
  { label: 'The Ruler', note: 'Order, responsibility, stewardship' },
];

interface Props {
  data: { soul_fairy_tale_now: string; soul_myth_character: string };
  onChange: (field: string, value: string) => void;
}

export default function Slide17Myth({ data, onChange }: Props) {
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
          Your myth
        </h2>
        <p className="text-gray-400 text-sm">
          A story — myth, film, novel, fairy tale — that has always felt most true to your life.
        </p>
      </div>

      {/* Optional archetype hint grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ARCHETYPE_HINTS.map((a) => (
          <div
            key={a.label}
            className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-left"
          >
            <div className="text-xs font-semibold text-gray-300 mb-0.5">{a.label}</div>
            <div className="text-xs text-gray-600 leading-snug">{a.note}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={data.soul_fairy_tale_now}
          onChange={(e) => onChange('soul_fairy_tale_now', e.target.value)}
          placeholder="e.g. The Alchemist / Odysseus / something you can't quite name..."
          className={input}
          autoFocus
        />
        <p className="text-xs text-gray-600">
          Trust the first thing that comes. It doesn&apos;t need to be impressive.
        </p>
      </div>
    </motion.div>
  );
}
