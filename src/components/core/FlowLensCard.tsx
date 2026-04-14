'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AMETHYST, STEEL } from '@/styles/brand-colors';
import FlowLensIntake from './FlowLensIntake';
import FlowLensProfile from './FlowLensProfile';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

type CardState = 'empty' | 'intake' | 'generating' | 'profile';

type FlowLensProfileData = Parameters<typeof FlowLensProfile>[0]['profile'];

interface Props {
  initialProfile: FlowLensProfileData | null;
}

async function getAccessToken(): Promise<string | null> {
  const { data: { session } } = await getSupabaseBrowser().auth.getSession();
  return session?.access_token ?? null;
}

export default function FlowLensCard({ initialProfile }: Props) {
  const { user } = useAuth();
  const [cardState, setCardState] = useState<CardState>(initialProfile ? 'profile' : 'empty');
  const [profile, setProfile] = useState<FlowLensProfileData | null>(initialProfile);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleIntakeSubmit(answers: any) {
    setSubmitting(true);
    setCardState('generating');
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Not authenticated');

      const res = await fetch('/api/core/flow-lens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'Generation failed');

      setProfile(data.profile as FlowLensProfileData);
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
            <p className="text-[10px] uppercase tracking-widest text-white/25 mb-0.5">Flow Lens</p>
            <p className="text-white font-semibold text-sm">How you&apos;re wired</p>
          </div>
          {cardState === 'profile' && (
            <div className="w-2 h-2 rounded-full mt-1" style={{ background: AMETHYST }} />
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
                12 questions. Reveals where you naturally focus as a lever — and where you leave performance on the table.
              </p>
              <button
                onClick={() => setCardState('intake')}
                className="px-5 py-2 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${STEEL}, ${AMETHYST})` }}
              >
                Take the Flow Lens
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
              <FlowLensIntake
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
                style={{ borderColor: `${AMETHYST}40`, borderTopColor: AMETHYST }}
              />
              <p className="text-sm text-white/30">Reading your pattern...</p>
            </motion.div>
          )}

          {cardState === 'profile' && profile && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FlowLensProfile
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
