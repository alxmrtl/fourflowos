'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AMETHYST, STEEL, GRADIENTS } from '@/styles/brand-colors';

interface EsotericFormData {
  full_name: string;
  birth_date: string;
  birth_time: string;
  birth_time_known: boolean;
  birth_location: string;
}

interface EsotericIntakeProps {
  onSubmit: (data: EsotericFormData) => void;
  onCancel: () => void;
  submitting: boolean;
}

export default function EsotericIntake({ onSubmit, onCancel, submitting }: EsotericIntakeProps) {
  const [data, setData] = useState<EsotericFormData>({
    full_name: '',
    birth_date: '',
    birth_time: '',
    birth_time_known: false,
    birth_location: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EsotericFormData, string>>>({});

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!data.full_name.trim()) newErrors.full_name = 'Name is required';
    if (!data.birth_date) newErrors.birth_date = 'Birth date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSubmit(data);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <p className="text-white/40 text-sm leading-relaxed mb-6">
        Your name, birth date, and birthplace are the only inputs needed.
        Birth time improves accuracy but isn&apos;t required.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full name */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-1.5">
            Full name
          </label>
          <input
            type="text"
            value={data.full_name}
            onChange={e => setData(d => ({ ...d, full_name: e.target.value }))}
            placeholder="First Middle Last"
            className="w-full px-4 py-2.5 bg-white/[0.04] border rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
            style={{ borderColor: errors.full_name ? '#E84535' : 'rgba(255,255,255,0.08)' }}
            autoComplete="off"
          />
          {errors.full_name && <p className="text-xs text-red-400 mt-1">{errors.full_name}</p>}
        </div>

        {/* Birth date */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-1.5">
            Birth date
          </label>
          <input
            type="date"
            value={data.birth_date}
            onChange={e => setData(d => ({ ...d, birth_date: e.target.value }))}
            className="w-full px-4 py-2.5 bg-white/[0.04] border rounded-xl text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
            style={{
              borderColor: errors.birth_date ? '#E84535' : 'rgba(255,255,255,0.08)',
              colorScheme: 'dark',
            }}
          />
          {errors.birth_date && <p className="text-xs text-red-400 mt-1">{errors.birth_date}</p>}
        </div>

        {/* Birth time (optional) */}
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/30">
              Birth time <span className="text-white/15 normal-case tracking-normal">(optional)</span>
            </label>
            <button
              type="button"
              onClick={() => setData(d => ({ ...d, birth_time_known: !d.birth_time_known }))}
              className="flex items-center gap-1.5 text-[10px] text-white/30 hover:text-white/50 transition-colors"
            >
              <div
                className="w-3.5 h-3.5 rounded border flex items-center justify-center"
                style={{
                  borderColor: data.birth_time_known ? AMETHYST : 'rgba(255,255,255,0.15)',
                  background: data.birth_time_known ? `${AMETHYST}30` : 'transparent',
                }}
              >
                {data.birth_time_known && (
                  <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              I know it
            </button>
          </div>
          {data.birth_time_known && (
            <input
              type="time"
              value={data.birth_time}
              onChange={e => setData(d => ({ ...d, birth_time: e.target.value }))}
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
              style={{ colorScheme: 'dark' }}
            />
          )}
        </div>

        {/* Birth location */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-1.5">
            Birthplace <span className="text-white/15 normal-case tracking-normal">(city or region, optional)</span>
          </label>
          <input
            type="text"
            value={data.birth_location}
            onChange={e => setData(d => ({ ...d, birth_location: e.target.value }))}
            placeholder="e.g. Montreal, Quebec"
            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
            autoComplete="off"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white font-medium transition-opacity disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${STEEL}, ${AMETHYST})` }}
          >
            {submitting ? 'Reading...' : 'Generate'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
