'use client';

import { motion } from 'framer-motion';

const ACCENT = '#7A4DA4';

interface IntakeStepSpiritProps {
  data: {
    spirit_values: string;
    spirit_curiosity: string;
    spirit_vision: string;
  };
  onChange: (field: string, value: string) => void;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
}

export default function IntakeStepSpirit({ data, onChange, focusedField, setFocusedField }: IntakeStepSpiritProps) {
  const textareaClasses = (fieldName: string) =>
    `w-full px-4 py-3 bg-white/[0.05] border rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none resize-none ${
      focusedField === fieldName
        ? `border-[${ACCENT}]/40 bg-white/[0.08] ring-2 ring-[${ACCENT}]/20`
        : 'border-white/10 hover:border-white/20'
    }`;

  const questions = [
    {
      field: 'spirit_values',
      key: 'Grounding Values',
      label: 'What values anchor you?',
      placeholder: 'What principles or beliefs do you return to when everything else is uncertain? What do you stand for — even when it\'s inconvenient?',
    },
    {
      field: 'spirit_curiosity',
      key: 'Ignited Curiosity',
      label: 'What lights you up?',
      placeholder: 'What topics, activities, or questions make you lose track of time? Where does your natural curiosity lead? What are you genuinely excited to explore?',
    },
    {
      field: 'spirit_vision',
      key: 'Visualized Vision',
      label: 'What is your deepest vision?',
      placeholder: 'If you could see your life 5-10 years from now — fully aligned, fully flowing — what does it look like? What would you want to be known for?',
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
          <span style={{ color: ACCENT }}>Spirit</span> — Your Deeper Truth
        </h2>
        <p className="text-gray-400">
          What is always true for you? These questions explore your values, curiosity, and vision.
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
