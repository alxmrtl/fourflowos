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

      {/* Clickable archetype grid — tap to select, or type your own below */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ARCHETYPE_HINTS.map((a) => {
          const isSelected = data.soul_fairy_tale_now === a.label;
          return (
            <button
              key={a.label}
              type="button"
              onClick={() => onChange('soul_fairy_tale_now', isSelected ? '' : a.label)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-white/[0.08] border-white/30 text-white'
                  : 'bg-white/[0.03] border-white/[0.07] hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              <div className={`text-xs font-semibold mb-0.5 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                {a.label}
              </div>
              <div className="text-xs text-gray-600 leading-snug">{a.note}</div>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-500">Or describe your own:</p>
        <input
          type="text"
          value={data.soul_fairy_tale_now}
          onChange={(e) => onChange('soul_fairy_tale_now', e.target.value)}
          placeholder="e.g. The Alchemist / Odysseus / something you can't quite name..."
          className={input}
        />
        <p className="text-xs text-gray-600">
          Trust the first thing that comes. It doesn&apos;t need to be impressive.
        </p>
      </div>
    </motion.div>
  );
}
