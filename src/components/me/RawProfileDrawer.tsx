'use client';

import { useState } from 'react';
import type { FlowProfileJSON } from '@/types/profile-json';

const SAGE = '#6BA292';

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

function buildLlmContext(assessment: AssessmentData, sessions: SessionRow[], curiosity: CuriosityData | null): string {
  const lines: string[] = [
    '# My FourFlow Profile',
    '',
    `**Generated:** ${new Date(assessment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
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
    lines.push(p.archetype.framing);
    lines.push('');
    for (const [dim, data] of Object.entries(p.dimensions)) {
      lines.push(`### ${dim.toUpperCase()}`);
      lines.push(data.summary);
      lines.push('');
      for (const [key, keyData] of Object.entries(data.keys)) {
        lines.push(`**${key}**`);
        lines.push(keyData.insight ?? '');
        lines.push(`_${keyData.invitation ?? ''}_`);
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
  lines.push(`- **FlowZone:** ${totalSessions} sessions total, ${sessionsThisWeek} this week, ${totalReps} focus reps`);
  lines.push(`- **Curiosity Map:** ${itemCount} curiosities mapped, ${intersectionCount} intersections`);

  return lines.join('\n');
}

export default function RawProfileDrawer({ assessment, sessions, curiosity }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(buildLlmContext(assessment, sessions, curiosity));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-12 border border-dashed border-white/12 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/3 transition-colors"
      >
        <span className="text-xs text-gray-600 font-medium tracking-wider uppercase">Flow Profile Data</span>
        <span className="text-xs text-gray-700">{open ? '↑' : '↓'}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-dashed border-white/8">
          <div className="flex items-center justify-between mt-4 mb-3">
            <span className="text-xs text-gray-600">Raw profile JSON + signal data</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/15 text-gray-400 hover:text-white hover:border-white/30 transition-all"
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy for LLM
                </>
              )}
            </button>
          </div>

          {assessment.flow_profile_json && (
            <pre className="text-[11px] text-gray-600 leading-relaxed bg-white/3 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-words font-mono">
              {JSON.stringify(assessment.flow_profile_json, null, 2)}
            </pre>
          )}

          {!assessment.flow_profile_json && assessment.flow_profile_final && (
            <pre className="text-[11px] text-gray-600 leading-relaxed bg-white/3 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-words font-mono">
              {assessment.flow_profile_final}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
