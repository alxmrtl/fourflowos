'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { FlowProfileJSON, DimensionData, KeyData } from '@/types/profile-json';
import type { DimensionType, KeyType } from '@/types/framework';
import ArchetypeHeader from './ArchetypeHeader';
import DimensionBentoCard from './DimensionBentoCard';
import OverviewCard from './OverviewCard';

// ─── Profile normalisation ────────────────────────────────────────────────────
// The LLM sometimes emits dimension keys (SELF / Space) or key slugs
// (Tuned Emotions / tuned_emotions) that don't match the kebab-case identifiers
// the component expects. Normalise once at the boundary so every downstream
// component can assume the correct format.

const DIM_ALIASES: Record<string, DimensionType> = {
  self: 'self', SELF: 'self', Self: 'self',
  space: 'space', SPACE: 'space', Space: 'space',
  story: 'story', STORY: 'story', Story: 'story',
  spirit: 'spirit', SPIRIT: 'spirit', Spirit: 'spirit',
};

// Map every plausible LLM variant → canonical KeyType
const KEY_ALIASES: Record<string, KeyType> = {
  'tuned-emotions': 'tuned-emotions', 'tuned_emotions': 'tuned-emotions', 'Tuned Emotions': 'tuned-emotions', 'tuned emotions': 'tuned-emotions',
  'focused-body': 'focused-body', 'focused_body': 'focused-body', 'Focused Body': 'focused-body', 'focused body': 'focused-body',
  'open-mind': 'open-mind', 'open_mind': 'open-mind', 'Open Mind': 'open-mind', 'open mind': 'open-mind',
  'intentional-space': 'intentional-space', 'intentional_space': 'intentional-space', 'Intentional Space': 'intentional-space', 'intentional space': 'intentional-space',
  'optimized-tools': 'optimized-tools', 'optimized_tools': 'optimized-tools', 'Optimized Tools': 'optimized-tools', 'optimized tools': 'optimized-tools',
  'feedback-systems': 'feedback-systems', 'feedback_systems': 'feedback-systems', 'Feedback Systems': 'feedback-systems', 'feedback systems': 'feedback-systems',
  'generative-story': 'generative-story', 'generative_story': 'generative-story', 'Generative Story': 'generative-story', 'generative story': 'generative-story',
  'clear-mission': 'clear-mission', 'clear_mission': 'clear-mission', 'Clear Mission': 'clear-mission', 'clear mission': 'clear-mission',
  'empowered-role': 'empowered-role', 'empowered_role': 'empowered-role', 'Empowered Role': 'empowered-role', 'empowered role': 'empowered-role',
  'grounding-values': 'grounding-values', 'grounding_values': 'grounding-values', 'Grounding Values': 'grounding-values', 'grounding values': 'grounding-values',
  'ignited-curiosity': 'ignited-curiosity', 'ignited_curiosity': 'ignited-curiosity', 'Ignited Curiosity': 'ignited-curiosity', 'ignited curiosity': 'ignited-curiosity',
  'visualized-vision': 'visualized-vision', 'visualized_vision': 'visualized-vision', 'Visualized Vision': 'visualized-vision', 'visualized vision': 'visualized-vision',
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/[\s_]+/g, '-');
}

function normalizeProfile(profile: FlowProfileJSON): FlowProfileJSON {
  const normalizedDims = {} as Record<DimensionType, DimensionData>;

  for (const [rawDim, dimData] of Object.entries(profile.dimensions ?? {})) {
    const dim: DimensionType = DIM_ALIASES[rawDim] ?? (slugify(rawDim) as DimensionType);
    if (!dimData) continue;

    const normalizedKeys: Partial<Record<KeyType, KeyData>> = {};
    for (const [rawKey, keyData] of Object.entries(dimData.keys ?? {})) {
      const key: KeyType = KEY_ALIASES[rawKey] ?? KEY_ALIASES[slugify(rawKey)] ?? (slugify(rawKey) as KeyType);
      if (keyData) normalizedKeys[key] = keyData as KeyData;
    }

    normalizedDims[dim] = { summary: dimData.summary ?? '', keys: normalizedKeys };
  }

  return { ...profile, dimensions: normalizedDims };
}

import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';

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
      className={`flex-1 rounded-xl overflow-hidden border flex flex-row ${muted ? 'border-white/5' : 'border-white/10'}`}
      style={{ background: muted ? 'rgba(20,20,20,0.5)' : 'rgba(20,20,20,0.95)' }}
    >
      {/* Left spine accent */}
      <div style={{ width: 3, background: topEdge, flexShrink: 0 }} />
      <div className="p-4 flex-1">
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
  const normalized = normalizeProfile(profile);

  // Diagnose raw key structure in the browser console so mismatches are visible
  if (process.env.NODE_ENV !== 'production') {
    const rawDimKeys = Object.fromEntries(
      Object.entries(profile.dimensions ?? {}).map(([d, data]) => [d, Object.keys((data as DimensionData)?.keys ?? {})])
    );
    console.log('[BentoGrid] raw dimension keys:', rawDimKeys);
    console.log('[BentoGrid] overview present:', !!profile.overview, profile.overview ?? '(none)');
  }

  const totalSessions = sessions.length;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const sessionsThisWeek = sessions.filter(
    (s) => s.started_at && new Date(s.started_at).getTime() > weekAgo
  ).length;
  const itemCount = curiosity?.items?.length ?? 0;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[rgba(12,12,12,0.9)] p-8 mb-6">
      <ArchetypeHeader profile={normalized} />

      {/* Dimension rows */}
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Your Flow Map</p>
      <div className="flex flex-col gap-3 mb-6">
        {DIM_ORDER.map((dim, idx) => (
          <motion.div
            key={dim}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + 0.1 * idx }}
          >
            <DimensionBentoCard
              dim={dim}
              data={normalized.dimensions[dim]}
            />
          </motion.div>
        ))}
      </div>

      {/* Overview */}
      {normalized.overview?.headline && (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Your Signal</p>
          <OverviewCard overview={normalized.overview} />
        </>
      )}

      {/* Signal row */}
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Tools &amp; Next Steps</p>
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
          className="flex-1 rounded-xl overflow-hidden border border-white/10 flex flex-row"
          style={{ background: 'rgba(20,20,20,0.95)' }}
        >
          <div style={{ width: 3, background: STEEL, flexShrink: 0 }} />
          <div className="p-4 flex-1">
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
