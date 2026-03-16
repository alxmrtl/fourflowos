'use client';

import { motion } from 'framer-motion';

const textarea = 'w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/25 focus:bg-white/[0.08] transition-all duration-200 resize-none text-sm leading-relaxed';

interface Props {
  data: { soul_closing_stem: string };
  onChange: (field: string, value: string) => void;
}

export default function Slide20Closing({ data, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          One last thing.
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          This is the final question. Write what wants to come out — not what sounds good.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-base text-gray-200 font-medium leading-relaxed">
          The thing I most want someone who truly understands me to know is:
        </p>
        <textarea
          rows={6}
          value={data.soul_closing_stem}
          onChange={(e) => onChange('soul_closing_stem', e.target.value)}
          placeholder="..."
          className={textarea}
          autoFocus
        />
      </div>
    </motion.div>
  );
}
