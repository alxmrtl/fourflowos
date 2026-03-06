'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { IntakeFormData } from '@/types/intake';

interface Props {
  data: IntakeFormData;
  onGoToStep: (step: number) => void;
}

interface Section {
  title: string;
  step: number;
  color: string;
  summary: () => string;
}

export default function IntakeStepReview({ data, onGoToStep }: Props) {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const sections: Section[] = [
    {
      title: 'Personal Info',
      step: 1,
      color: 'rgba(255,255,255,0.4)',
      summary: () => [data.name, data.email].filter(Boolean).join(' · '),
    },
    {
      title: 'Signal Origin',
      step: 2,
      color: 'rgba(255,255,255,0.4)',
      summary: () => [
        data.birth_date,
        data.birth_time_known && data.birth_time ? data.birth_time : null,
        data.birth_location,
      ].filter(Boolean).join(' · '),
    },
    {
      title: 'Opening Frame',
      step: 3,
      color: '#6330A0',
      summary: () => [
        data.opening_season ? `Season: ${data.opening_season}` : null,
        data.opening_chapter_title ? `"${data.opening_chapter_title}"` : null,
      ].filter(Boolean).join(' · '),
    },
    {
      title: 'Self',
      step: 4,
      color: '#E84535',
      summary: () => [
        data.self_emotions_keywords.length ? `${data.self_emotions_keywords.length} emotion words` : null,
        `Energy: ${data.self_body_energy}/10`,
        `Mind: ${data.self_mind_clarity}/10`,
      ].filter(Boolean).join(' · '),
    },
    {
      title: 'Space',
      step: 5,
      color: '#4E8C73',
      summary: () => [
        data.space_environment_feel || null,
        data.space_feedback_channel ? `Feedback: ${data.space_feedback_channel}` : null,
      ].filter(Boolean).join(' · '),
    },
    {
      title: 'Story',
      step: 6,
      color: '#3E6FA3',
      summary: () => [
        data.story_narrative_arc || null,
        data.story_mission_clarity || null,
      ].filter(Boolean).join(' · '),
    },
    {
      title: 'Spirit',
      step: 7,
      color: '#6330A0',
      summary: () => [
        data.spirit_values_selected.length ? `${data.spirit_values_selected.length} values` : null,
        data.spirit_curiosity_intersection ? `"${data.spirit_curiosity_intersection}"` : null,
      ].filter(Boolean).join(' · '),
    },
    {
      title: 'Soul Signature',
      step: 8,
      color: '#6330A0',
      summary: () => [
        data.soul_myth_character ? `${data.soul_myth_character}` : null,
        data.soul_word ? `"${data.soul_word}"` : null,
      ].filter(Boolean).join(' · '),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Almost there.
        </h2>
        <p className="text-gray-400 text-sm">
          Take a moment to look over your responses. Click any section to review, or hit Edit to change something.
          When you&apos;re ready — send it through.
        </p>
      </div>

      <div className="space-y-2">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: section.color }} />
                <span className="font-medium text-white text-sm">{section.title}</span>
                <span className="text-xs text-gray-500 truncate hidden sm:block">{section.summary()}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onGoToStep(section.step); }}
                  className="text-xs px-3 py-1 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
                >
                  Edit
                </button>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${expandedSection === idx ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            <AnimatePresence>
              {expandedSection === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 pt-3 border-t border-white/5">
                    <p className="text-xs text-gray-400 leading-relaxed">{section.summary() || '(no summary available)'}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
