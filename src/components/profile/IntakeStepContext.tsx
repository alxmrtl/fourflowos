'use client';

import { motion } from 'framer-motion';

interface IntakeStepContextProps {
  data: {
    context_working: string;
    context_stuck: string;
    context_building: string;
  };
  onChange: (field: string, value: string) => void;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
}

export default function IntakeStepContext({ data, onChange, focusedField, setFocusedField }: IntakeStepContextProps) {
  const textareaClasses = (fieldName: string) =>
    `w-full px-4 py-3 bg-white/[0.05] border rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none resize-none ${
      focusedField === fieldName
        ? 'border-white/30 bg-white/[0.08] ring-2 ring-white/10'
        : 'border-white/10 hover:border-white/20'
    }`;

  const questions = [
    {
      field: 'context_working',
      label: 'What\'s working?',
      placeholder: 'What areas of your life feel most aligned right now? Where do you feel momentum, energy, and flow?',
    },
    {
      field: 'context_stuck',
      label: 'What\'s stuck?',
      placeholder: 'Where do you feel friction, stagnation, or misalignment? What keeps recurring despite your efforts?',
    },
    {
      field: 'context_building',
      label: 'What are you building toward?',
      placeholder: 'What would your life look like if everything was flowing? What are you moving toward — even if you can\'t fully articulate it yet?',
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
          Life Context
        </h2>
        <p className="text-gray-400">
          Help us understand where you are right now. There are no wrong answers — write what feels true.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.field}>
            <label htmlFor={q.field} className="block text-sm font-medium text-gray-400 mb-2">
              {q.label}
            </label>
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
