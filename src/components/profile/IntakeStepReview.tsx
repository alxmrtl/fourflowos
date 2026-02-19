'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  birth_date: string;
  birth_time: string;
  birth_time_known: boolean;
  birth_location: string;
  birth_lat: string;
  birth_lng: string;
  context_working: string;
  context_stuck: string;
  context_building: string;
  self_energy: string;
  self_emotions: string;
  self_focus: string;
  space_environment: string;
  space_tools: string;
  space_feedback: string;
  story_narrative: string;
  story_mission: string;
  story_role: string;
  spirit_values: string;
  spirit_curiosity: string;
  spirit_vision: string;
}

interface IntakeStepReviewProps {
  data: FormData;
  onGoToStep: (step: number) => void;
}

const SECTIONS = [
  {
    title: 'Personal Info',
    step: 1,
    color: '#ffffff',
    fields: [
      { key: 'name' as const, label: 'Name' },
      { key: 'email' as const, label: 'Email' },
    ],
  },
  {
    title: 'Birth Data',
    step: 2,
    color: '#ffffff',
    fields: [
      { key: 'birth_date' as const, label: 'Date' },
      { key: 'birth_time' as const, label: 'Time' },
      { key: 'birth_location' as const, label: 'Location' },
    ],
  },
  {
    title: 'Life Context',
    step: 3,
    color: '#ffffff',
    fields: [
      { key: 'context_working' as const, label: "What's working" },
      { key: 'context_stuck' as const, label: "What's stuck" },
      { key: 'context_building' as const, label: 'Building toward' },
    ],
  },
  {
    title: 'Self',
    step: 4,
    color: '#FF6F61',
    fields: [
      { key: 'self_energy' as const, label: 'Physical energy' },
      { key: 'self_emotions' as const, label: 'Emotions' },
      { key: 'self_focus' as const, label: 'Mental clarity' },
    ],
  },
  {
    title: 'Space',
    step: 5,
    color: '#6BA292',
    fields: [
      { key: 'space_environment' as const, label: 'Environment' },
      { key: 'space_tools' as const, label: 'Tools & systems' },
      { key: 'space_feedback' as const, label: 'Feedback loops' },
    ],
  },
  {
    title: 'Story',
    step: 6,
    color: '#5B84B1',
    fields: [
      { key: 'story_narrative' as const, label: 'Life narrative' },
      { key: 'story_mission' as const, label: 'Mission' },
      { key: 'story_role' as const, label: 'Role' },
    ],
  },
  {
    title: 'Spirit',
    step: 7,
    color: '#7A4DA4',
    fields: [
      { key: 'spirit_values' as const, label: 'Values' },
      { key: 'spirit_curiosity' as const, label: 'Curiosity' },
      { key: 'spirit_vision' as const, label: 'Vision' },
    ],
  },
];

export default function IntakeStepReview({ data, onGoToStep }: IntakeStepReviewProps) {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const truncate = (text: string, length = 120) => {
    if (!text) return '(empty)';
    return text.length > length ? text.slice(0, length) + '...' : text;
  };

  const getDisplayValue = (key: string, value: string | boolean) => {
    if (key === 'birth_time' && !data.birth_time_known) return 'Not provided';
    if (key === 'birth_time' && !value) return 'Not provided';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return truncate(String(value));
  };

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
          Review Your{' '}
          <span className="bg-gradient-to-r from-[#FF6F61] via-[#6BA292] via-[#5B84B1] to-[#7A4DA4] bg-clip-text text-transparent">
            Responses
          </span>
        </h2>
        <p className="text-gray-400">
          Take a moment to review everything before submitting. Click any section to expand, or hit Edit to make changes.
        </p>
      </div>

      <div className="space-y-3">
        {SECTIONS.map((section, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden"
          >
            {/* Section header */}
            <button
              type="button"
              onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: section.color === '#ffffff' ? 'rgba(255,255,255,0.4)' : section.color }}
                />
                <span className="font-medium text-white">{section.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGoToStep(section.step);
                  }}
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

            {/* Expanded content */}
            <AnimatePresence>
              {expandedSection === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 space-y-3 border-t border-white/5 pt-3">
                    {section.fields.map((field) => (
                      <div key={field.key}>
                        <p className="text-xs text-gray-500 mb-1">{field.label}</p>
                        <p className="text-sm text-gray-300">
                          {getDisplayValue(field.key, data[field.key])}
                        </p>
                      </div>
                    ))}
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
