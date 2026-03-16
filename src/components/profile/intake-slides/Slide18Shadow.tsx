'use client';

import { motion } from 'framer-motion';

const input = 'w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-200 text-sm';

interface Props {
  data: { soul_shadow_projection: string };
  onChange: (field: string, value: string) => void;
}

export default function Slide18Shadow({ data, onChange }: Props) {
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
          Your shadow
        </h2>
        <p className="text-gray-400 text-sm">
          Answer quickly, before your inner editor wakes up.
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm text-gray-300">
          The thing that frustrates you most in other people:
        </label>
        <input
          type="text"
          value={data.soul_shadow_projection}
          onChange={(e) => onChange('soul_shadow_projection', e.target.value)}
          placeholder="e.g. when people waste their gifts / when someone knows the truth and stays quiet..."
          className={input}
          autoFocus
        />
        <p className="text-xs text-gray-500 italic">
          What we judge in others is often what we haven&apos;t yet owned in ourselves.
        </p>
      </div>
    </motion.div>
  );
}
