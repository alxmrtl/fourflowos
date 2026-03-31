'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { STEEL, AMETHYST } from '@/styles/brand-colors';
import { KEYS, DIMENSIONS } from '@/data/framework';
import type { FlowProfileJSON, DimensionData, KeyData } from '@/types/profile-json';
import type { DimensionType, KeyType } from '@/types/framework';


// ─── Structured rendering (mirrors profile view page) ─────────────────────────

const DIM_ORDER: DimensionType[] = ['self', 'space', 'story', 'spirit'];

function StructuredKey({ keySlug, data, accentColor, isLast }: {
  keySlug: KeyType;
  data: KeyData;
  accentColor: string;
  isLast?: boolean;
}) {
  const keyMeta = KEYS[keySlug];
  const [insightOpen, setInsightOpen] = useState(false);

  return (
    <div>
      <div className="flex items-start gap-4 py-5">
        <div className="w-9 h-9 flex-shrink-0">
          {keyMeta?.icon ? (
            <Image src={keyMeta.icon} alt={keyMeta.name} width={36} height={36} className="object-contain opacity-65" />
          ) : (
            <div className="w-9 h-9 rounded-full border border-white/10" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {/* Leading sentence */}
          <p className="text-[11px] font-semibold leading-snug mb-2" style={{ color: accentColor }}>
            {KEYS[keySlug]?.layupStem ?? keyMeta?.name ?? keySlug}
          </p>
          {/* personal_key — always visible, ellipsis prefix */}
          {data.personal_key && (
            <p className="text-sm text-white font-medium leading-snug mb-2 italic">…{data.personal_key}</p>
          )}
          {/* insight — collapsible */}
          {data.insight && (
            <div>
              {insightOpen && (
                <p className="text-sm text-white/45 leading-relaxed mb-1.5">{data.insight}</p>
              )}
              <button
                onClick={() => setInsightOpen((v) => !v)}
                className="text-[11px] transition-colors"
                style={{ color: insightOpen ? 'rgba(255,255,255,0.2)' : accentColor, opacity: insightOpen ? 1 : 0.6 }}
              >
                {insightOpen ? 'Less ↑' : 'More ↓'}
              </button>
            </div>
          )}
        </div>
      </div>
      {!isLast && <div className="h-px ml-13" style={{ background: 'rgba(255,255,255,0.05)' }} />}
    </div>
  );
}

function StructuredDimension({ dimId, data }: { dimId: DimensionType; data: DimensionData }) {
  const dimMeta = DIMENSIONS[dimId];
  const accentColor = dimMeta?.color ?? '#fff';
  const keyEntries = Object.entries(data.keys ?? {}) as [KeyType, KeyData][];

  return (
    <div className="mb-9">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: accentColor }} />
        <h2 className="text-[10px] font-bold tracking-widest uppercase" style={{ color: accentColor }}>
          {dimMeta?.name ?? dimId}
        </h2>
        {data.summary && (
          <p className="text-xs text-white/30 leading-relaxed">{data.summary}</p>
        )}
      </div>
      <div className="pl-4">
        {keyEntries.map(([slug, keyData], i) => (
          <StructuredKey
            key={slug}
            keySlug={slug}
            data={keyData}
            accentColor={accentColor}
            isLast={i === keyEntries.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function StructuredProfile({ profile_json }: { profile_json: FlowProfileJSON }) {
  const { archetype, dimensions } = profile_json;

  return (
    <div>
      {/* Archetype */}
      <div className="mb-10">
        <p className="text-[10px] tracking-widest uppercase text-white/25 mb-1">Your Archetype</p>
        <h1 className="text-2xl font-bold text-white mb-1.5">{archetype.name}</h1>
        {archetype.tagline && (
          <p className="text-sm text-white/40 italic mb-3 leading-relaxed">{archetype.tagline}</p>
        )}
        {archetype.framing && (
          <p className="text-sm text-white/45 leading-relaxed">{archetype.framing}</p>
        )}
      </div>

      <div className="h-px bg-white/[0.06] mb-9" />

      {DIM_ORDER.map(dimId => {
        const data = dimensions[dimId];
        if (!data) return null;
        return <StructuredDimension key={dimId} dimId={dimId} data={data} />;
      })}
    </div>
  );
}

// ─── Markdown fallback ────────────────────────────────────────────────────────

function markdownToHtml(md: string): string {
  let html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^---+$/gm, '<hr />')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^&gt; (.+)$/gm, '<blockquote><p>$1</p></blockquote>');
  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;
  let listType = '';
  for (const line of lines) {
    const ulMatch = line.match(/^[-*] (.+)/);
    const olMatch = line.match(/^\d+\. (.+)/);
    if (ulMatch) {
      if (!inList || listType !== 'ul') { if (inList) result.push(`</${listType}>`); result.push('<ul>'); inList = true; listType = 'ul'; }
      result.push(`<li>${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (!inList || listType !== 'ol') { if (inList) result.push(`</${listType}>`); result.push('<ol>'); inList = true; listType = 'ol'; }
      result.push(`<li>${olMatch[1]}</li>`);
    } else {
      if (inList) { result.push(`</${listType}>`); inList = false; listType = ''; }
      if (line.trim() === '') result.push('');
      else if (line.startsWith('<h') || line.startsWith('<hr') || line.startsWith('<blockquote')) result.push(line);
      else result.push(`<p>${line}</p>`);
    }
  }
  if (inList) result.push(`</${listType}>`);
  return result.join('\n');
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProfileSummary() {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<{
    status: string;
    view_token: string | null;
    flow_profile_json: FlowProfileJSON | null;
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
      <div className="flex items-center justify-center h-48">
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
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col items-start py-12 px-2"
      >
        <p className="text-white/25 text-[10px] uppercase tracking-[0.28em] mb-4">Core</p>
        <p className="text-white text-xl font-semibold mb-2">No profile yet.</p>
        <p className="text-white/35 text-sm leading-relaxed mb-8 max-w-sm">
          Your Flow Profile maps the four dimensions of your consciousness — revealing what&apos;s blocking you and the specific cascade that will unlock flow.
        </p>
        <Link
          href="/profile/intake"
          className="px-6 py-2.5 rounded-full text-white text-sm font-semibold"
          style={{ background: `linear-gradient(135deg, ${STEEL}, ${AMETHYST})` }}
        >
          Get your Flow Profile
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {assessment.flow_profile_json ? (
        <StructuredProfile profile_json={assessment.flow_profile_json} />
      ) : assessment.flow_profile_final ? (
        <div
          className="profile-text"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(assessment.flow_profile_final) }}
        />
      ) : null}

      {/* Subtle share link at the bottom */}
      {assessment.view_token && (
        <div className="mt-10 pt-6 border-t border-white/[0.06]">
          <Link
            href={`/profile/view/${assessment.view_token}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs text-white/25 hover:text-white/50 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Shareable profile link
          </Link>
        </div>
      )}

      <style jsx global>{`
        .profile-text h1 { font-size: 1.5rem; font-weight: 700; color: #fff; margin-top: 2rem; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.07); padding-bottom: 0.5rem; }
        .profile-text h2 { font-size: 1.2rem; font-weight: 600; color: #fff; margin-top: 1.75rem; margin-bottom: 0.5rem; }
        .profile-text h3 { font-size: 1rem; font-weight: 600; color: #e5e5e5; margin-top: 1.25rem; margin-bottom: 0.4rem; }
        .profile-text p { font-size: 0.9rem; line-height: 1.8; color: rgba(255,255,255,0.45); margin-bottom: 0.85rem; }
        .profile-text strong { color: #e5e5e5; font-weight: 600; }
        .profile-text ul, .profile-text ol { padding-left: 1.5rem; margin-bottom: 0.85rem; }
        .profile-text li { font-size: 0.9rem; line-height: 1.8; color: rgba(255,255,255,0.45); margin-bottom: 0.2rem; }
        .profile-text hr { border: none; height: 1px; background: rgba(255,255,255,0.07); margin: 1.75rem 0; }
        .profile-text blockquote { border-left: 2px solid #4E8C73; padding-left: 1rem; margin: 1.25rem 0; color: rgba(255,255,255,0.45); font-style: italic; }
      `}</style>
    </motion.div>
  );
}
