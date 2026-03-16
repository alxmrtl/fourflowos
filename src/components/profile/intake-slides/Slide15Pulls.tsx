'use client';

import { motion } from 'framer-motion';

const input = 'w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-200 text-sm';

interface Props {
  data: { spirit_curiosity_intersection: string };
  onChange: (field: string, value: string) => void;
}

export default function Slide15Pulls({ data, onChange }: Props) {
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
          What pulls you
        </h2>
        <p className="text-gray-400 text-sm">
          The intersection you keep returning to — even when you have no reason to.
        </p>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={data.spirit_curiosity_intersection}
          onChange={(e) => onChange('spirit_curiosity_intersection', e.target.value)}
          placeholder="e.g. ancient philosophy + product design"
          className={input}
          autoFocus
        />
        <p className="text-xs text-gray-600">
          The weird intersection. The thing that doesn&apos;t quite have a name yet.
        </p>
      </div>
    </motion.div>
  );
}
