'use client';

import { motion } from 'framer-motion';

interface Props {
  data: { opening_chapter_title: string };
  onChange: (field: string, value: string) => void;
}

export default function Slide04Chapter({ data, onChange }: Props) {
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
          Give it a title
        </h2>
        <p className="text-gray-400 text-sm">
          The current chapter of your life — give it a title. Ten words or less.
        </p>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          maxLength={80}
          value={data.opening_chapter_title}
          onChange={(e) => onChange('opening_chapter_title', e.target.value)}
          placeholder="e.g. &quot;The Long Winter&quot; or &quot;Learning to Want Things Again&quot;"
          className="w-full px-4 py-4 bg-white/[0.05] border border-white/10 rounded-xl text-white text-lg placeholder-gray-600 focus:outline-none focus:border-white/25 focus:bg-white/[0.08] transition-all duration-200"
          autoFocus
        />
        <p className="text-xs text-gray-600">
          Don&apos;t think too hard — the first thing that comes is usually the truest.
        </p>
      </div>
    </motion.div>
  );
}
