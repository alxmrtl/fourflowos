'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { FlowProfileJSON } from '@/types/profile-json';
import type { DimensionType } from '@/types/framework';
import ArchetypeHeader from './ArchetypeHeader';
import DimensionBentoCard from './DimensionBentoCard';

const CORAL = '#FF6F61';
const SAGE = '#6BA292';
const STEEL = '#5B84B1';
const AMETHYST = '#7A4DA4';

interface SessionRow {
  id: string;
  focus_reps: number | null;
  ended_at: string | null;
  started_at: string | null;
}

interface CuriosityData {
  items: unknown[];
  intersections: unknown[];
  updated_at: string | null;
}

interface AssessmentData {
  status: string;
  created_at: string;
  view_token: string | null;
  flow_profile_final?: string | null;
  flow_profile_json?: FlowProfileJSON | null;
}

interface Props {
  profile: FlowProfileJSON;
  sessions: SessionRow[];
  curiosity: CuriosityData | null;
  assessment: AssessmentData;
}

const DIM_ORDER: DimensionType[] = ['self', 'space', 'story', 'spirit'];

function SignalMiniCard({
  topEdge,
  title,
  stat,
  label,
  href,
  muted,
}: {
  topEdge: string;
  title: string;
  stat: string | number;
  label: string;
  href: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex-1 rounded-xl overflow-hidden border ${muted ? 'border-white/5' : 'border-white/10'}`}
      style={{ background: muted ? 'rgba(20,20,20,0.5)' : 'rgba(20,20,20,0.95)' }}
    >
      <div style={{ height: 3, background: topEdge }} />
      <div className="p-4">
        <p className={`text-xs font-medium mb-2 ${muted ? 'text-gray-600' : 'text-gray-400'}`}>{title}</p>
        <p className={`text-2xl font-bold mb-0.5 ${muted ? 'text-gray-600' : 'text-white'}`}>{stat}</p>
        <p className={`text-[11px] mb-3 ${muted ? 'text-gray-700' : 'text-gray-500'}`}>{label}</p>
        <Link
          href={href}
          className={`inline-flex items-center gap-1 text-xs transition-colors ${
            muted ? 'text-gray-700 hover:text-gray-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          Open <span>→</span>
        </Link>
      </div>
    </div>
  );
}

export default function BentoGrid({ profile, sessions, curiosity, assessment }: Props) {
  const totalSessions = sessions.length;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const sessionsThisWeek = sessions.filter(
    (s) => s.started_at && new Date(s.started_at).getTime() > weekAgo
  ).length;
  const itemCount = curiosity?.items?.length ?? 0;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[rgba(12,12,12,0.9)] p-6 mb-6">
      <ArchetypeHeader profile={profile} />

      {/* 2×2 Dimension grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {DIM_ORDER.map((dim, idx) => (
          <motion.div
            key={dim}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + 0.1 * idx }}
          >
            <DimensionBentoCard
              dim={dim}
              data={profile.dimensions[dim]}
            />
          </motion.div>
        ))}
      </div>

      {/* Signal row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <SignalMiniCard
          topEdge={`linear-gradient(90deg, ${CORAL}, ${SAGE})`}
          title="FlowZone"
          stat={sessionsThisWeek}
          label={`sessions this week · ${totalSessions} total`}
          href="/tools/flowzone"
        />
        <SignalMiniCard
          topEdge={AMETHYST}
          title="Curiosity Map"
          stat={itemCount}
          label="curiosities mapped"
          href="/tools/curiosity-explorer"
        />
        <div
          className="flex-1 rounded-xl overflow-hidden border border-white/10"
          style={{ background: 'rgba(20,20,20,0.95)' }}
        >
          <div style={{ height: 3, background: STEEL }} />
          <div className="p-4">
            <p className="text-xs font-medium text-gray-400 mb-2">Work Together</p>
            <p className="text-sm text-gray-300 mb-3 leading-snug">
              Walk through your profile with Alex
            </p>
            <Link
              href="/together"
              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Book a session <span>→</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* View token link */}
      {assessment.view_token && (
        <div className="text-center mb-2">
          <Link
            href={`/profile/view/${assessment.view_token}`}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Shareable profile view →
          </Link>
        </div>
      )}
    </div>
  );
}
