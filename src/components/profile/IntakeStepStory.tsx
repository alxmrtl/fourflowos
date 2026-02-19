'use client';

import { motion } from 'framer-motion';

const ACCENT = '#5B84B1';

interface IntakeStepStoryProps {
  data: {
    story_narrative: string;
    story_mission: string;
    story_role: string;
  };
  onChange: (field: string, value: string) => void;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
}

export default function IntakeStepStory({ data, onChange, focusedField, setFocusedField }: IntakeStepStoryProps) {
  const textareaClasses = (fieldName: string) =>
    `w-full px-4 py-3 bg-white/[0.05] border rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none resize-none ${
      focusedField === fieldName
        ? `border-[${ACCENT}]/40 bg-white/[0.08] ring-2 ring-[${ACCENT}]/20`
        : 'border-white/10 hover:border-white/20'
    }`;

  const questions = [
    {
      field: 'story_narrative',
      key: 'Generative Story',
      label: 'What story do you tell about your life?',
      placeholder: 'If you had to describe the arc of your life so far, what would you say? Is the story you carry empowering or limiting? What chapter are you in?',
    },
    {
      field: 'story_mission',
      key: 'Clear Mission',
      label: 'What is your mission right now?',
      placeholder: 'What are you trying to accomplish in this season of life? Is it clear and energizing, or fuzzy and draining? How do you decide what to focus on?',
    },
    {
      field: 'story_role',
      key: 'Empowered Role',
      label: 'What role do you play?',
      placeholder: 'How do you see yourself — in your work, your relationships, your creative life? Do you feel empowered in that role, or are you playing a part that doesn\'t fit?',
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
          <span style={{ color: ACCENT }}>Story</span> — Your Direction
        </h2>
        <p className="text-gray-400">
          Where are you in the arc? These questions explore your narrative, mission, and the role you play.
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
