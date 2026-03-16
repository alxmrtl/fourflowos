'use client';

import { motion } from 'framer-motion';
import KeywordPicker from '../intake-ui/KeywordPicker';

const ACCENT = '#7A4DA4';

const VALUES_WORDS = [
  'integrity', 'freedom', 'depth', 'beauty', 'truth', 'service', 'mastery',
  'courage', 'connection', 'play', 'solitude', 'impact', 'precision',
  'loyalty', 'adventure', 'stillness', 'power', 'creativity', 'justice',
  'humor', 'reverence', 'clarity', 'wildness', 'devotion', 'simplicity',
  'boldness', 'care', 'wisdom', 'discipline', 'wonder',
];

interface Props {
  data: { spirit_values_selected: string[] };
  onChange: (field: string, value: string[]) => void;
}

export default function Slide14MadeOf({ data, onChange }: Props) {
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
          What you&apos;re made of
        </h2>
        <p className="text-gray-400 text-sm">
          Select 5–7 words that feel like you — not what you aspire to, but what you already are.
        </p>
      </div>

      <KeywordPicker
        words={VALUES_WORDS}
        selected={data.spirit_values_selected}
        onChange={(v) => onChange('spirit_values_selected', v)}
        accent={ACCENT}
        max={7}
      />

      <p className="text-xs text-gray-600">
        {data.spirit_values_selected.length} / 7 selected
      </p>
    </motion.div>
  );
}
