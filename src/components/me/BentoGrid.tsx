'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { FlowProfileJSON } from '@/types/profile-json';
import type { DimensionType, KeyType } from '@/types/framework';
import ArchetypeHeader from './ArchetypeHeader';
import DimensionBentoCard from './DimensionBentoCard';
import KeyDetailPanel from './KeyDetailPanel';

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
  const [activeKey, setActiveKey] = useState<{ slug: KeyType; dim: DimensionType } | null>(null);

  const totalSessions = sessions.length;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const sessionsThisWeek = sessions.filter(
    (s) => s.started_at && new Date(s.started_at).getTime() > weekAgo
  ).length;
  const itemCount = curiosity?.items?.length ?? 0;

  const handleKeyClick = (slug: KeyType, dim: DimensionType) => {
    setActiveKey({ slug, dim });
  };

  const handleClose = () => setActiveKey(null);

  return (
    <>
      <ArchetypeHeader profile={profile} />

      {/* 2×2 Dimension grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {DIM_ORDER.map((dim) => (
          <DimensionBentoCard
            key={dim}
            dim={dim}
            data={profile.dimensions[dim]}
            onKeyClick={handleKeyClick}
          />
        ))}
      </div>

      {/* Signal row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
      </div>

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

      {/* Key detail panel */}
      <KeyDetailPanel
        active={activeKey}
        profile={profile}
        onClose={handleClose}
      />
    </>
  );
}
