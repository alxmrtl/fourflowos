'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { STEEL, AMETHYST } from '@/styles/brand-colors';

export default function ProfileSummary() {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<{
    status: string;
    view_token: string | null;
    flow_profile_json: { archetype?: { name?: string; tagline?: string } } | null;
    flow_profile_final: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabaseBrowser();
    supabase
      .from('assessments')
      .select('status, view_token, flow_profile_json, flow_profile_final')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setAssessment(data);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    );
  }

  const hasProfile =
    assessment &&
    assessment.status !== 'intake_submitted' &&
    (assessment.flow_profile_json || assessment.flow_profile_final);

  if (!hasProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <p className="text-white/30 text-sm mb-2">No Flow Profile yet.</p>
        <p className="text-white/20 text-xs mb-8 max-w-xs leading-relaxed">
          Your profile maps the four dimensions of your flow — revealing what's blocking you and what will unlock you.
        </p>
        <Link
          href="/profile/intake"
          className="px-6 py-2.5 rounded-full text-white text-sm font-semibold"
          style={{ background: `linear-gradient(135deg, ${STEEL}, ${AMETHYST})` }}
        >
          Get your Flow Profile
        </Link>
      </div>
    );
  }

  const archetype = assessment.flow_profile_json?.archetype;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="px-8 py-10 max-w-lg"
    >
      {archetype?.name ? (
        <>
          <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] mb-2">Your Archetype</p>
          <h2 className="text-white text-2xl font-semibold mb-2">{archetype.name}</h2>
          {archetype.tagline && (
            <p className="text-white/40 text-sm italic mb-7 leading-relaxed">{archetype.tagline}</p>
          )}
        </>
      ) : assessment.flow_profile_final ? (
        <p className="text-white/50 text-sm leading-relaxed mb-7 line-clamp-5">
          {assessment.flow_profile_final.slice(0, 320)}
          {assessment.flow_profile_final.length > 320 ? '…' : ''}
        </p>
      ) : null}

      {assessment.view_token && (
        <Link
          href={`/profile/view/${assessment.view_token}`}
          className="inline-flex items-center gap-1.5 text-sm px-5 py-2 rounded-full border border-white/10 text-white/45 hover:text-white/75 hover:border-white/22 transition-colors"
        >
          View full profile →
        </Link>
      )}
    </motion.div>
  );
}
