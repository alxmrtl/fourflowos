'use client';

import { motion } from 'framer-motion';
import SpectrumSlider from '../intake-ui/SpectrumSlider';

const ACCENT = '#5B84B1';

interface Props {
  data: {
    story_role_pair1: string;
    story_role_pair2: string;
    story_role_pair3: string;
    story_role_pair4: string;
  };
  onChange: (field: string, value: string) => void;
}

const ROLE_PAIRS = [
  {
    field: 'story_role_pair1',
    labelLeft: 'Architect',
    labelRight: 'Builder',
    descLeft: 'I design the system.',
    descRight: 'I make it real.',
    valueLeft: 'architect',
    valueRight: 'builder',
  },
  {
    field: 'story_role_pair2',
    labelLeft: 'Pioneer',
    labelRight: 'Integrator',
    descLeft: 'I go first.',
    descRight: 'I bring it together.',
    valueLeft: 'pioneer',
    valueRight: 'integrator',
  },
  {
    field: 'story_role_pair3',
    labelLeft: 'Independent',
    labelRight: 'Collaborative',
    descLeft: 'I need autonomy.',
    descRight: 'I need the energy of others.',
    valueLeft: 'independent',
    valueRight: 'collaborative',
  },
  {
    field: 'story_role_pair4',
    labelLeft: 'Teacher',
    labelRight: 'Student',
    descLeft: 'I transmit what I know.',
    descRight: 'I absorb what I don\'t yet understand.',
    valueLeft: 'teacher',
    valueRight: 'student',
  },
];

export default function Slide13Wired({ data, onChange }: Props) {
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
          How you&apos;re wired
        </h2>
        <p className="text-gray-400 text-sm">
          Four spectrums. Slide toward whichever pole feels more like you — not the better option.
        </p>
      </div>

      <div className="space-y-8">
        {ROLE_PAIRS.map((pair) => (
          <div key={pair.field}>
            <SpectrumSlider
              labelLeft={pair.labelLeft}
              labelRight={pair.labelRight}
              descLeft={pair.descLeft}
              descRight={pair.descRight}
              value={(data as Record<string, string>)[pair.field]}
              valueLeft={pair.valueLeft}
              valueRight={pair.valueRight}
              onChange={(v) => onChange(pair.field, v)}
              accent={ACCENT}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
