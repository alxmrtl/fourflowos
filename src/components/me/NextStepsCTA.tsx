'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { FlowProfileJSON } from '@/types/profile-json';

const SAGE = '#6BA292';
const AMETHYST = '#7A4DA4';
const CORAL = '#FF6F61';
const STEEL = '#5B84B1';

interface SessionRow {
  id: string;
  focus_reps: number | null;
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
  assessment: AssessmentData;
  sessions: SessionRow[];
  curiosity: CuriosityData | null;
}

function buildLlmContext(
  assessment: AssessmentData,
  sessions: SessionRow[],
  curiosity: CuriosityData | null
): string {
  const lines: string[] = [
    '# My FourFlow Profile',
    '',
    `**Generated:** ${new Date(assessment.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`,
    '',
    '---',
    '',
  ];

  if (assessment.flow_profile_json) {
    const p = assessment.flow_profile_json;
    lines.push(`## ${p.archetype.name}`);
    lines.push('');
    lines.push(p.archetype.tagline);
    lines.push('');
    lines.push(p.archetype.framing ?? '');
    lines.push('');
    for (const [dim, data] of Object.entries(p.dimensions)) {
      lines.push(`### ${dim.toUpperCase()}`);
      lines.push(data.summary);
      lines.push('');
      for (const [key, keyData] of Object.entries(data.keys)) {
        lines.push(`**${key}**`);
        if (keyData.insight) lines.push(keyData.insight);
        lines.push('');
      }
    }
  } else {
    lines.push(assessment.flow_profile_final ?? '');
  }

  const totalSessions = sessions.length;
  const totalReps = sessions.reduce((sum, s) => sum + (s.focus_reps ?? 0), 0);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const sessionsThisWeek = sessions.filter(
    (s) => s.started_at && new Date(s.started_at).getTime() > weekAgo
  ).length;
  const itemCount = curiosity?.items?.length ?? 0;
  const intersectionCount = curiosity?.intersections?.length ?? 0;

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Live Signals');
  lines.push('');
  lines.push(
    `- **FlowZone:** ${totalSessions} sessions total, ${sessionsThisWeek} this week, ${totalReps} focus reps`
  );
  lines.push(
    `- **Curiosity Map:** ${itemCount} curiosities mapped, ${intersectionCount} intersections`
  );

  return lines.join('\n');
}

interface CTACardProps {
  accentColor: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

function CTACard({ accentColor, title, description, children }: CTACardProps) {
  return (
    <div
      className="rounded-2xl border border-white/10 overflow-hidden"
      style={{ background: 'rgba(20,20,20,0.95)' }}
    >
      <div style={{ height: 2, background: accentColor }} />
      <div className="p-5">
        <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-4">{description}</p>
        {children}
      </div>
    </div>
  );
}

export default function NextStepsCTA({ assessment, sessions, curiosity }: Props) {
  const [copied, setCopied] = useState(false);

  const sessionCount = sessions.length;
  const itemCount = curiosity?.items?.length ?? 0;

  function handleCopy() {
    navigator.clipboard.writeText(buildLlmContext(assessment, sessions, curiosity));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-16 pb-16">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-600 mb-6">
        What to do with your archetype
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Use in AI */}
        <CTACard
          accentColor={SAGE}
          title="Use in AI"
          description="Paste your profile into Claude or ChatGPT to go deeper on any key."
        >
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-white/15 text-gray-400 hover:text-white hover:border-white/30 transition-all"
          >
            {copied ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke={SAGE} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: SAGE }}>Copied</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy for AI →
              </>
            )}
          </button>
        </CTACard>

        {/* FlowZone */}
        <CTACard
          accentColor={CORAL}
          title="FlowZone"
          description="Track your focus sessions. Your reps feed directly into your SELF + SPACE keys."
        >
          <Link
            href="/tools/flowzone"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {sessionCount > 0 ? (
              <span className="text-gray-500 mr-1">
                {sessionCount} session{sessionCount !== 1 ? 's' : ''} —
              </span>
            ) : null}
            Open FlowZone →
          </Link>
        </CTACard>

        {/* Curiosity Map */}
        <CTACard
          accentColor={AMETHYST}
          title="Curiosity Map"
          description="Map what lights you up. Your curiosities are live data for your SPIRIT dimension."
        >
          <Link
            href="/tools/curiosity-explorer"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {itemCount > 0 ? (
              <span className="text-gray-500 mr-1">
                {itemCount} item{itemCount !== 1 ? 's' : ''} —
              </span>
            ) : null}
            Open Curiosity Map →
          </Link>
        </CTACard>

        {/* Book a Session */}
        <CTACard
          accentColor={STEEL}
          title="Book a Session"
          description="Work 1:1 with a certified FourFlow practitioner to move through your profile."
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            Book a call →
          </Link>
        </CTACard>
      </div>
    </div>
  );
}
