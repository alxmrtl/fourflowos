'use client';

import { motion } from 'framer-motion';
import CardPicker from './intake-ui/CardPicker';
import type { IntakeFormData } from '@/types/intake';

interface Props {
  data: Pick<IntakeFormData,
    'opening_season' | 'opening_chapter_title' | 'opening_orientation_word'
  >;
  onChange: (field: string, value: string) => void;
}

const SEASONS = [
  {
    value: 'spring',
    title: 'Spring',
    description: 'Something is beginning. New growth. The ground is soft and ready.',
    emoji: '🌱',
  },
  {
    value: 'summer',
    title: 'Summer',
    description: 'Full bloom. High action. Everything is in motion.',
    emoji: '☀️',
  },
  {
    value: 'autumn',
    title: 'Autumn',
    description: 'Harvesting. Releasing. Making room for what comes next.',
    emoji: '🍂',
  },
  {
    value: 'winter',
    title: 'Winter',
    description: 'Still. Integrating. Something is ending before something begins.',
    emoji: '❄️',
  },
];

export default function IntakeStepOpeningFrame({ data, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Where do you find yourself?
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Before we go deeper — let&apos;s get oriented. There are no right answers here.
          Just what feels true right now.
        </p>
      </div>

      {/* Season */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          If your life right now were a season, which would it be?
        </label>
        <CardPicker
          options={SEASONS}
          selected={data.opening_season}
          onChange={(v) => onChange('opening_season', v)}
          accent="#6330A0"
          columns={2}
        />
      </div>

      {/* Chapter title */}
      <div className="space-y-2">
        <label htmlFor="chapter_title" className="block text-sm font-medium text-gray-300">
          Give the current chapter of your life a title.
        </label>
        <p className="text-xs text-gray-500">
          Short is better — 10 words or fewer. Don&apos;t overthink it. The first thing that comes up is usually the right one.
        </p>
        <input
          id="chapter_title"
          type="text"
          maxLength={80}
          value={data.opening_chapter_title}
          onChange={(e) => onChange('opening_chapter_title', e.target.value)}
          placeholder="e.g. &quot;The Gathering&quot; or &quot;Learning to Want Things Again&quot;"
          className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/25 focus:bg-white/[0.07] transition-all duration-200"
        />
      </div>

      {/* Orientation word */}
      <div className="space-y-2">
        <label htmlFor="orientation_word" className="block text-sm font-medium text-gray-300">
          One word that describes the quality of attention you&apos;re bringing to your life right now.
        </label>
        <p className="text-xs text-gray-500">
          Whatever comes first. You can&apos;t get this wrong.
        </p>
        <input
          id="orientation_word"
          type="text"
          maxLength={30}
          value={data.opening_orientation_word}
          onChange={(e) => onChange('opening_orientation_word', e.target.value)}
          placeholder="e.g. attentive, raw, searching, expanding..."
          className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/25 focus:bg-white/[0.07] transition-all duration-200"
        />
      </div>
    </motion.div>
  );
}
