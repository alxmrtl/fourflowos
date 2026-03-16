'use client';

import { motion } from 'framer-motion';
import KeywordPicker from '../intake-ui/KeywordPicker';

const ACCENT = '#E84535';

const EMOTION_KEYWORDS = [
  'electric', 'open', 'tender', 'steady', 'fluid', 'calibrated', 'present', 'alive',
  'grounded', 'expansive', 'curious', 'lit up', 'clear', 'whole',
  'defended', 'stormy', 'flat', 'raw', 'reactive', 'numb', 'intense', 'disconnected',
  'contracted', 'scattered', 'heavy', 'restless', 'depleted', 'guarded',
];

interface Props {
  data: { self_emotions_keywords: string[] };
  onChange: (field: string, value: string[]) => void;
}

export default function Slide05Emotions({ data, onChange }: Props) {
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
          Your emotional range
        </h2>
        <p className="text-gray-400 text-sm">
          Select the words that tend to be true for you emotionally. Don&apos;t filter — there are no good or bad words here.
        </p>
      </div>

      <KeywordPicker
        words={EMOTION_KEYWORDS}
        selected={data.self_emotions_keywords}
        onChange={(v) => onChange('self_emotions_keywords', v)}
        accent={ACCENT}
      />

      {data.self_emotions_keywords.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-600"
        >
          {data.self_emotions_keywords.length} selected — select as many as feel true.
        </motion.p>
      )}
    </motion.div>
  );
}
