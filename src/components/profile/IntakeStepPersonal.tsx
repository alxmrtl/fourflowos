'use client';

import { motion } from 'framer-motion';

interface IntakeStepPersonalProps {
  data: { name: string; email: string };
  onChange: (field: string, value: string) => void;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
}

export default function IntakeStepPersonal({ data, onChange, focusedField, setFocusedField }: IntakeStepPersonalProps) {
  const inputClasses = (fieldName: string) =>
    `w-full px-4 py-3 bg-white/[0.05] border rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none ${
      focusedField === fieldName
        ? 'border-white/30 bg-white/[0.08] ring-2 ring-white/10'
        : 'border-white/10 hover:border-white/20'
    }`;

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
          Let&apos;s start with you
        </h2>
        <p className="text-gray-400">
          Basic information so we can personalize your experience.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            className={inputClasses('name')}
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            className={inputClasses('email')}
            placeholder="your@email.com"
          />
          <p className="mt-1.5 text-xs text-gray-500">
            We&apos;ll use this to send your Flow Profile and schedule your session.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
