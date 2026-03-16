'use client';

import { motion } from 'framer-motion';
import KeywordPicker from '../intake-ui/KeywordPicker';

const ACCENT = '#4E8C73';

const TOOLS_KEYWORDS = [
  'strategic', 'minimalist', 'ritualistic', 'adaptive', 'layered',
  'improvised', 'overwhelmed', 'scattered', 'resistant', 'reactive',
  'methodical', 'intuitive', 'automated', 'manual', 'experimental',
];

interface Props {
  data: { space_tools_keywords: string[] };
  onChange: (field: string, value: string[]) => void;
}

export default function Slide09HowYouWork({ data, onChange }: Props) {
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
          How you work
        </h2>
        <p className="text-gray-400 text-sm">
          My relationship to systems, tools, and routines. Select up to 4.
        </p>
      </div>

      <KeywordPicker
        words={TOOLS_KEYWORDS}
        selected={data.space_tools_keywords}
        onChange={(v) => onChange('space_tools_keywords', v)}
        accent={ACCENT}
        max={4}
      />
    </motion.div>
  );
}
