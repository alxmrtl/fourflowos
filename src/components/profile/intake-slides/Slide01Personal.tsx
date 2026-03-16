'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Props {
  data: { name: string; email: string };
  onChange: (field: string, value: string) => void;
}

export default function Slide01Personal({ data, onChange }: Props) {
  const [focused, setFocused] = useState<string | null>(null);

  const inputClasses = (field: string) =>
    `w-full px-4 py-3 bg-white/[0.05] border rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none ${
      focused === field
        ? 'border-white/30 bg-white/[0.08] ring-2 ring-white/10'
        : 'border-white/10 hover:border-white/20'
    }`;

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
          Let&apos;s start with you
        </h2>
        <p className="text-gray-400 text-sm">
          So we can personalize your profile and send it when it&apos;s ready.
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
            onFocus={() => setFocused('name')}
            onBlur={() => setFocused(null)}
            className={inputClasses('name')}
            placeholder="Your full name"
            autoFocus
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
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
            className={inputClasses('email')}
            placeholder="your@email.com"
          />
          <p className="mt-1.5 text-xs text-gray-500">
            We&apos;ll send your Flow Profile here when it&apos;s ready.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
