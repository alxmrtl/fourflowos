'use client';

import { motion } from 'framer-motion';

const ACCENT = '#6BA292';

interface IntakeStepSpaceProps {
  data: {
    space_environment: string;
    space_tools: string;
    space_feedback: string;
  };
  onChange: (field: string, value: string) => void;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
}

export default function IntakeStepSpace({ data, onChange, focusedField, setFocusedField }: IntakeStepSpaceProps) {
  const textareaClasses = (fieldName: string) =>
    `w-full px-4 py-3 bg-white/[0.05] border rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none resize-none ${
      focusedField === fieldName
        ? `border-[${ACCENT}]/40 bg-white/[0.08] ring-2 ring-[${ACCENT}]/20`
        : 'border-white/10 hover:border-white/20'
    }`;

  const questions = [
    {
      field: 'space_environment',
      key: 'Intentional Space',
      label: 'How does your environment support you?',
      placeholder: 'Describe your physical spaces — where you work, rest, create. Do they energize you or drain you? Have you designed them intentionally, or do they just happen?',
    },
    {
      field: 'space_tools',
      key: 'Optimized Tools',
      label: 'What tools and systems do you rely on?',
      placeholder: 'What systems, apps, routines, or tools do you use to manage your life and work? Do they serve you well, or do you feel overwhelmed by them?',
    },
    {
      field: 'space_feedback',
      key: 'Feedback Systems',
      label: 'How do you know what\'s working?',
      placeholder: 'How do you track progress? Do you have feedback loops — from people, data, or self-reflection — that tell you when you\'re on track or off course?',
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
          <span style={{ color: ACCENT }}>Space</span> — Your Environment
        </h2>
        <p className="text-gray-400">
          Is your environment supporting signal flow? These questions explore your spaces, tools, and feedback loops.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.field}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT }} />
              <label htmlFor={q.field} className="text-sm font-medium text-gray-400">
                {q.label}
              </label>
            </div>
            <textarea
              id={q.field}
              required
              rows={4}
              value={data[q.field as keyof typeof data]}
              onChange={(e) => onChange(q.field, e.target.value)}
              onFocus={() => setFocusedField(q.field)}
              onBlur={() => setFocusedField(null)}
              className={textareaClasses(q.field)}
              placeholder={q.placeholder}
            />
            <p className="mt-1 text-xs text-gray-600">
              Take your time — 100-300 words
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
