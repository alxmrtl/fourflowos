'use client';

import { motion } from 'framer-motion';

const input = 'w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-200 text-sm';

interface Props {
  data: { soul_gift: string };
  onChange: (field: string, value: string) => void;
}

export default function Slide19Gift({ data, onChange }: Props) {
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
          Your deepest gift
        </h2>
        <p className="text-gray-400 text-sm">
          The thing I give effortlessly that others struggle with.
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={data.soul_gift}
          onChange={(e) => onChange('soul_gift', e.target.value)}
          placeholder="e.g. translating what people feel into words they can use..."
          className={input}
          autoFocus
        />
        <p className="text-xs text-gray-600">
          Not your credential. Not your job title. The thing people come to you for that you do naturally,
          sometimes without realizing it&apos;s rare.
        </p>
      </div>
    </motion.div>
  );
}
