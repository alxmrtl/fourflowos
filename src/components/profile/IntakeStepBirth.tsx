'use client';

import { motion } from 'framer-motion';

interface IntakeStepBirthProps {
  data: {
    birth_date: string;
    birth_time: string;
    birth_time_known: boolean;
    birth_location: string;
  };
  onChange: (field: string, value: string | boolean) => void;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
}

export default function IntakeStepBirth({ data, onChange, focusedField, setFocusedField }: IntakeStepBirthProps) {
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
          Birth Information
        </h2>
        <p className="text-gray-400">
          Used to calculate your natal chart — an archetypal layer we weave into your profile.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="birth_date" className="block text-sm font-medium text-gray-400 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            id="birth_date"
            required
            value={data.birth_date}
            onChange={(e) => onChange('birth_date', e.target.value)}
            onFocus={() => setFocusedField('birth_date')}
            onBlur={() => setFocusedField(null)}
            className={`${inputClasses('birth_date')} [color-scheme:dark]`}
          />
        </div>

        {/* Birth time toggle */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <button
              type="button"
              onClick={() => onChange('birth_time_known', !data.birth_time_known)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                data.birth_time_known ? 'bg-white/30' : 'bg-white/10'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  data.birth_time_known ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className="text-sm text-gray-400">
              I know my birth time
            </span>
          </div>

          {data.birth_time_known ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <label htmlFor="birth_time" className="block text-sm font-medium text-gray-400 mb-2">
                Time of Birth
              </label>
              <input
                type="time"
                id="birth_time"
                value={data.birth_time}
                onChange={(e) => onChange('birth_time', e.target.value)}
                onFocus={() => setFocusedField('birth_time')}
                onBlur={() => setFocusedField(null)}
                className={`${inputClasses('birth_time')} [color-scheme:dark]`}
              />
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-gray-500 p-3 bg-white/[0.02] rounded-lg border border-white/5"
            >
              Without a birth time, we can still create your Flow Profile — the archetypal layer will focus on planetary signs and aspects rather than house placements. You can always add your birth time later.
            </motion.p>
          )}
        </div>

        <div>
          <label htmlFor="birth_location" className="block text-sm font-medium text-gray-400 mb-2">
            Place of Birth
          </label>
          <input
            type="text"
            id="birth_location"
            required
            value={data.birth_location}
            onChange={(e) => onChange('birth_location', e.target.value)}
            onFocus={() => setFocusedField('birth_location')}
            onBlur={() => setFocusedField(null)}
            className={inputClasses('birth_location')}
            placeholder="City, Country (e.g., London, UK)"
          />
        </div>
      </div>
    </motion.div>
  );
}
