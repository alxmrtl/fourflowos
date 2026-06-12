'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AMETHYST, STEEL } from '@/styles/brand-colors';
import FlowLensIntake from './FlowLensIntake';
import FlowLensProfileV1 from './FlowLensProfileV1';
import { type FlowLensDisplayProfile, DEMO_PROFILE } from './flow-lens-demo-profile';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

type CardState = 'empty' | 'intake' | 'generating' | 'profile';

interface Props {
  initialProfile: FlowLensDisplayProfile | null;
}

async function getAccessToken(): Promise<string | null> {
  const { data: { session } } = await getSupabaseBrowser().auth.getSession();
  return session?.access_token ?? null;
}

export default function FlowLensCard({ initialProfile }: Props) {
  const { user } = useAuth();
  const [cardState, setCardState] = useState<CardState>(initialProfile ? 'profile' : 'empty');
  const [profile, setProfile] = useState<FlowLensDisplayProfile | null>(initialProfile);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleIntakeSubmit(payload: any) {
    setSubmitting(true);
    setCardState('generating');
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Not authenticated');

      // Payload shape: { answers, answer_metadata } from new intake
      const answers = payload?.answers ?? payload;
      const answerMetadata = payload?.answer_metadata;

      const res = await fetch('/api/core/flow-lens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ answers, answer_metadata: answerMetadata }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'Generation failed');

      setProfile(data.profile as FlowLensDisplayProfile);
      setCardState('profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setCardState('intake');
    } finally {
      setSubmitting(false);
    }
  }

  // Renders inside ToolShell — the shell owns the header; this is body only.
  return (
    <div className="text-white">
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
                8 questions, 3 min. Reads what&apos;s actually blocking you and gives you the specific move to break it.
              </p>
              <button
                onClick={() => setCardState('intake')}
                className="px-5 py-2 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${STEEL}, ${AMETHYST})` }}
              >
                Find my block
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

          {cardState === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FlowLensProfileV1
                profile={profile ?? DEMO_PROFILE}
                onRegenerate={() => setCardState('intake')}
              />
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
