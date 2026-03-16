'use client';

import { motion } from 'framer-motion';
import PolaritySlider from '../intake-ui/PolaritySlider';

const ACCENT = '#E84535';

interface Props {
  data: { self_mind_clarity: number };
  onChange: (field: string, value: number) => void;
}

export default function Slide07MentalMode({ data, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Your mental mode
        </h2>
        <p className="text-gray-400 text-sm">
          Most days, my mind is:
        </p>
      </div>

      <div className="py-4">
        <PolaritySlider
          value={data.self_mind_clarity}
          onChange={(v) => onChange('self_mind_clarity', v)}
          labelLeft="Scattered and racing"
          labelRight="Clear and focused"
          accent={ACCENT}
        />
      </div>
    </motion.div>
  );
}
