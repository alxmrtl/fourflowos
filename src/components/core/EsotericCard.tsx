'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AMETHYST, STEEL } from '@/styles/brand-colors';
import EsotericIntake from './EsotericIntake';
import EsotericProfile from './EsotericProfile';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

type CardState = 'empty' | 'intake' | 'generating' | 'profile';

type EsotericProfileData = Parameters<typeof EsotericProfile>[0]['profile'];

interface Props {
  initialProfile: EsotericProfileData | null;
  esotericName?: string;
}

async function getAccessToken(): Promise<string | null> {
  const { data: { session } } = await getSupabaseBrowser().auth.getSession();
  return session?.access_token ?? null;
}

export default function EsotericCard({ initialProfile, esotericName = 'Timeless Map' }: Props) {
  const { user } = useAuth();
  const [cardState, setCardState] = useState<CardState>(initialProfile ? 'profile' : 'empty');
  const [profile, setProfile] = useState<EsotericProfileData | null>(initialProfile);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleIntakeSubmit(formData: {
    full_name: string;
    birth_date: string;
    birth_time: string;
    birth_time_known: boolean;
    birth_location: string;
  }) {
    setSubmitting(true);
    setCardState('generating');
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Not authenticated');

      const res = await fetch('/api/core/esoteric', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          birth_date: formData.birth_date,
          birth_time: formData.birth_time_known && formData.birth_time ? formData.birth_time : null,
          birth_location: formData.birth_location || null,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'Generation failed');

      setProfile(data.profile as EsotericProfileData);
      setCardState('profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setCardState('intake');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.05]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/25 mb-0.5">{esotericName}</p>
            <p className="text-white font-semibold text-sm">The deep architecture</p>
          </div>
          {cardState === 'profile' && (
            <div className="w-2 h-2 rounded-full mt-1" style={{ background: STEEL }} />
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5">
        <AnimatePresence mode="wait">
          {cardState === 'empty' && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-start"
            >
              <p className="text-sm text-white/35 leading-relaxed mb-5">
                A reading across name etymology, numerology, and natal astrology — translated into plain language. What you were born carrying.
              </p>
              <button
                onClick={() => setCardState('intake')}
                className="px-5 py-2 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${AMETHYST}, ${STEEL})` }}
              >
                Get your {esotericName}
              </button>
            </motion.div>
          )}

          {cardState === 'intake' && (
            <motion.div
              key="intake"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
              <EsotericIntake
                onSubmit={handleIntakeSubmit}
                onCancel={() => setCardState(initialProfile ? 'profile' : 'empty')}
                submitting={submitting}
              />
            </motion.div>
          )}

          {cardState === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 gap-4"
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: `${STEEL}40`, borderTopColor: STEEL }}
              />
              <p className="text-sm text-white/30">Reading the deep layers...</p>
            </motion.div>
          )}

          {cardState === 'profile' && profile && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EsotericProfile
                profile={profile}
                onRegenerate={() => setCardState('intake')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
