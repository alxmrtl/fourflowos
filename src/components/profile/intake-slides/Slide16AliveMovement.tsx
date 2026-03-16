'use client';

import { motion } from 'framer-motion';

const textarea = 'w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-200 resize-none text-sm leading-relaxed';

interface Props {
  data: { spirit_vision_peak: string };
  onChange: (field: string, value: string) => void;
}

export default function Slide16AliveMovement({ data, onChange }: Props) {
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
          Your most alive moment
        </h2>
        <p className="text-gray-400 text-sm">
          Describe the moment you felt most yourself — most alive, most real, most clear.
        </p>
      </div>

      <div className="space-y-2">
        <textarea
          rows={5}
          value={data.spirit_vision_peak}
          onChange={(e) => onChange('spirit_vision_peak', e.target.value)}
          placeholder="I was in the middle of..."
          className={textarea}
          autoFocus
        />
        <p className="text-xs text-gray-600">
          A specific memory. What were you doing? Who were you with? What made it feel that way?
        </p>
      </div>
    </motion.div>
  );
}
