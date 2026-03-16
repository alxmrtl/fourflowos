'use client';

import { motion } from 'framer-motion';
import CardPicker from '../intake-ui/CardPicker';
import type { EnvironmentFeel } from '@/types/intake';

const ACCENT = '#4E8C73';

const ENVIRONMENT_OPTIONS: { value: EnvironmentFeel; title: string; description: string; emoji: string }[] = [
  {
    value: 'sanctuary',
    title: 'A sanctuary I\'ve designed',
    description: 'Intentional. Supports how I work and rest.',
    emoji: '🕯️',
  },
  {
    value: 'functional',
    title: 'Functional but not inspiring',
    description: 'Gets the job done — doesn\'t light much up.',
    emoji: '🗂️',
  },
  {
    value: 'chaotic',
    title: 'Chaotic and depleting',
    description: 'I fight my environment more than I work with it.',
    emoji: '🌀',
  },
  {
    value: 'unexamined',
    title: 'Works somehow — but unexamined',
    description: 'I\'ve never really thought about it. It just is.',
    emoji: '🔍',
  },
];

interface Props {
  data: { space_environment_feel: EnvironmentFeel | '' };
  onChange: (field: string, value: string) => void;
}

export default function Slide08Spaces({ data, onChange }: Props) {
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
          Your spaces
        </h2>
        <p className="text-gray-400 text-sm">
          My physical spaces tend to feel like:
        </p>
      </div>

      <CardPicker
        options={ENVIRONMENT_OPTIONS}
        selected={data.space_environment_feel}
        onChange={(v) => onChange('space_environment_feel', v)}
        accent={ACCENT}
        columns={2}
      />
    </motion.div>
  );
}
