'use client';

import { motion } from 'framer-motion';

const input = 'w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-200 text-sm';

interface Props {
  data: { story_mission_completion: string };
  onChange: (field: string, value: string) => void;
}

export default function Slide12Mission({ data, onChange }: Props) {
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
          Your mission
        </h2>
        <p className="text-gray-400 text-sm">
          Not the polished version. The raw one. What actually pulls you?
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-lg text-gray-300 font-medium">I exist to</p>
        <input
          type="text"
          maxLength={120}
          value={data.story_mission_completion}
          onChange={(e) => onChange('story_mission_completion', e.target.value)}
          placeholder="...help people recognize what they already know"
          className={input}
          autoFocus
        />
        <p className="text-xs text-gray-600">
          One sentence. 20 words or fewer. Don&apos;t try to make it sound impressive.
        </p>
      </div>
    </motion.div>
  );
}
