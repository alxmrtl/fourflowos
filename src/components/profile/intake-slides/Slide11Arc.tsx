'use client';

import { motion } from 'framer-motion';

const input = 'w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-200 text-sm';

interface Props {
  data: { story_narrative_last5: string; story_narrative_next5: string };
  onChange: (field: string, value: string) => void;
}

export default function Slide11Arc({ data, onChange }: Props) {
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
          The arc
        </h2>
        <p className="text-gray-400 text-sm">
          Give your life arc a title — both directions. The titles you give things reveal more than the events themselves.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            The last 5 years:
          </label>
          <input
            type="text"
            maxLength={60}
            value={data.story_narrative_last5}
            onChange={(e) => onChange('story_narrative_last5', e.target.value)}
            placeholder='e.g. "The Long Winter"'
            className={input}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            The next 5 years:
          </label>
          <input
            type="text"
            maxLength={60}
            value={data.story_narrative_next5}
            onChange={(e) => onChange('story_narrative_next5', e.target.value)}
            placeholder='e.g. "Learning to Want Things Again"'
            className={input}
          />
        </div>
      </div>
    </motion.div>
  );
}
