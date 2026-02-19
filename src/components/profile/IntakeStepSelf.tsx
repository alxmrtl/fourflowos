'use client';

import { motion } from 'framer-motion';

const ACCENT = '#FF6F61';

interface IntakeStepSelfProps {
  data: {
    self_energy: string;
    self_emotions: string;
    self_focus: string;
  };
  onChange: (field: string, value: string) => void;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
}

export default function IntakeStepSelf({ data, onChange, focusedField, setFocusedField }: IntakeStepSelfProps) {
  const textareaClasses = (fieldName: string) =>
    `w-full px-4 py-3 bg-white/[0.05] border rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none resize-none ${
      focusedField === fieldName
        ? `border-[${ACCENT}]/40 bg-white/[0.08] ring-2 ring-[${ACCENT}]/20`
        : 'border-white/10 hover:border-white/20'
    }`;

  const questions = [
    {
      field: 'self_energy',
      key: 'Focused Body',
      label: 'How is your physical energy?',
      placeholder: 'Describe your relationship with your body — sleep, exercise, energy levels throughout the day. Do you feel physically capable of doing what matters to you?',
    },
    {
      field: 'self_emotions',
      key: 'Tuned Emotions',
      label: 'How do you relate to your emotions?',
      placeholder: 'When strong emotions arise, what happens? Do you process them, suppress them, get overwhelmed? How would you describe your emotional baseline?',
    },
    {
      field: 'self_focus',
      key: 'Open Mind',
      label: 'How is your mental clarity?',
      placeholder: 'Can you focus when you need to? Are you open to new perspectives, or do you find yourself rigid in thinking? What does your inner dialogue sound like?',
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
          <span style={{ color: ACCENT }}>Self</span> — Your Inner State
        </h2>
        <p className="text-gray-400">
          Can you receive alignment signals? These questions explore your body, emotions, and mind.
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
