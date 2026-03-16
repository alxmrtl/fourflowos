'use client';

import { motion } from 'framer-motion';
import CardPicker from '../intake-ui/CardPicker';
import type { FeedbackChannel } from '@/types/intake';

const ACCENT = '#4E8C73';

const FEEDBACK_OPTIONS: { value: FeedbackChannel; title: string; description: string; emoji: string }[] = [
  {
    value: 'internal',
    title: 'Internal compass',
    description: 'Something shifts inside — I just know.',
    emoji: '🧭',
  },
  {
    value: 'external',
    title: 'Others reflect it back',
    description: 'I need someone I respect to confirm it.',
    emoji: '🪞',
  },
  {
    value: 'data',
    title: 'Data and metrics',
    description: 'Numbers or visible results tell me.',
    emoji: '📊',
  },
  {
    value: 'embodied',
    title: 'My body tells me',
    description: 'Something relaxes — or tightens — and that tells me everything.',
    emoji: '🫀',
  },
];

interface Props {
  data: { space_feedback_channel: FeedbackChannel | '' };
  onChange: (field: string, value: string) => void;
}

export default function Slide10HowYouKnow({ data, onChange }: Props) {
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
          How you know
        </h2>
        <p className="text-gray-400 text-sm">
          I know I&apos;m on the right track when:
        </p>
      </div>

      <CardPicker
        options={FEEDBACK_OPTIONS}
        selected={data.space_feedback_channel}
        onChange={(v) => onChange('space_feedback_channel', v)}
        accent={ACCENT}
        columns={2}
      />
    </motion.div>
  );
}
