'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import LandingNav from '@/components/landing/LandingNav';
import BentoGrid from './BentoGrid';
import RawProfileDrawer from './RawProfileDrawer';
import { CORAL, SAGE, STEEL, AMETHYST, GRADIENTS } from '@/styles/brand-colors';

function relativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return 'never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function PillarBadge({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
      style={{ background: `${color}20`, color }}
    >
      {name}
    </span>
  );
}

interface CardProps {
  topEdge: string;
  children: React.ReactNode;
  muted?: boolean;
}

function SignalCard({ topEdge, children, muted }: CardProps) {
  return (
    <div
      className={`rounded-2xl overflow-hidden border ${muted ? 'border-white/5' : 'border-white/10'}`}
      style={{ background: muted ? 'rgba(20,20,20,0.6)' : 'rgba(20,20,20,0.95)' }}
    >
      <div style={{ height: 3, background: topEdge }} />
      <div className="p-5">{children}</div>
    </div>
  );
}

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
  flow_profile_json?: import('@/types/profile-json').FlowProfileJSON | null;
}

interface SignalData {
  sessions: SessionRow[];
  curiosity: CuriosityData | null;
  assessment: AssessmentData | null;
}

function buildLlmContext(assessment: AssessmentData, signals: SignalData): string {
  const lines: string[] = [
    '# My FourFlow Profile',
    '',
    `**Generated:** ${new Date(assessment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    '',
    '---',
    '',
    assessment.flow_profile_final ?? '',
  ];

  const totalSessions = signals.sessions.length;
  const totalReps = signals.sessions.reduce((sum, s) => sum + (s.focus_reps ?? 0), 0);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const sessionsThisWeek = signals.sessions.filter(
    (s) => s.started_at && new Date(s.started_at).getTime() > weekAgo
  ).length;
  const itemCount = signals.curiosity?.items?.length ?? 0;
  const intersectionCount = signals.curiosity?.intersections?.length ?? 0;

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Live Signals');
  lines.push('');
  lines.push(`- **FlowZone:** ${totalSessions} sessions total, ${sessionsThisWeek} this week, ${totalReps} focus reps`);
  lines.push(`- **Curiosity Map:** ${itemCount} curiosities mapped, ${intersectionCount} intersections`);

  return lines.join('\n');
}

function ProfileTextSection({
  assessment,
  signals,
}: {
  assessment: AssessmentData | null;
  signals: SignalData;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const delivered = assessment?.status === 'delivered' && assessment?.flow_profile_final;

  function handleCopy() {
    if (!assessment) return;
    navigator.clipboard.writeText(buildLlmContext(assessment, signals));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!delivered) {
    return (
      <div className="mb-8 rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(20,20,20,0.95)' }}>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${CORAL}, ${SAGE}, ${STEEL}, ${AMETHYST})` }} />
        <div className="p-6">
          <h2 className="text-base font-semibold text-white mb-2">Flow Profile</h2>
          <p className="text-sm text-gray-500 mb-3">
            {assessment
              ? 'Your profile is being prepared. Check back soon.'
              : 'Your baseline diagnostic across all 4 pillars. Take the assessment to get started.'}
          </p>
          {!assessment && (
            <Link
              href="/profile/intake"
              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Start assessment →
            </Link>
          )}
        </div>
      </div>
    );
  }

  const content = assessment.flow_profile_final!;
  const PREVIEW_LENGTH = 350;
  const isLong = content.length > PREVIEW_LENGTH;

  return (
    <div className="mb-8 rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(20,20,20,0.95)' }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${CORAL}, ${SAGE}, ${STEEL}, ${AMETHYST})` }} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Flow Profile</h2>
            <p className="text-xs text-gray-600 mt-0.5">Delivered {relativeTime(assessment.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            {assessment.view_token && (
              <Link
                href={`/profile/view/${assessment.view_token}`}
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                Full view →
              </Link>
            )}
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
        </div>

        <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap font-mono text-[12px]"
          style={{ maxHeight: expanded ? 'none' : '7rem', overflow: 'hidden' }}
        >
          {expanded ? content : content.slice(0, PREVIEW_LENGTH) + (isLong ? '…' : '')}
        </div>

        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            {expanded ? 'Collapse ↑' : 'Read full profile ↓'}
          </button>
        )}
      </div>
    </div>
  );
}

function FlowZoneCard({ sessions }: { sessions: SessionRow[] }) {
  const totalSessions = sessions.length;
  const totalReps = sessions.reduce((sum, s) => sum + (s.focus_reps ?? 0), 0);
  const lastSession = sessions[0]?.ended_at ?? null;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const sessionsThisWeek = sessions.filter(
    (s) => s.started_at && new Date(s.started_at).getTime() > weekAgo
  ).length;

  const topEdge = `linear-gradient(90deg, ${CORAL}, ${SAGE})`;
  const connected = totalSessions > 0;

  return (
    <SignalCard topEdge={topEdge}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-base">FlowZone</h3>
          <p className="text-xs text-gray-500 mt-0.5">Focus sessions + reps</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: connected ? '#4ade80' : '#666' }}>●</span>
          <span className="text-xs text-gray-500">{connected ? 'Connected' : 'No data'}</span>
        </div>
      </div>

      <div className="flex gap-1.5 mb-4">
        <PillarBadge name="SELF" color={CORAL} />
        <PillarBadge name="SPACE" color={SAGE} />
      </div>

      {connected ? (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-xl font-bold" style={{ color: CORAL }}>{totalSessions}</div>
              <div className="text-[11px] text-gray-500">sessions</div>
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: SAGE }}>{totalReps}</div>
              <div className="text-[11px] text-gray-500">focus reps</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{sessionsThisWeek}</div>
              <div className="text-[11px] text-gray-500">this week</div>
            </div>
          </div>
          {lastSession && (
            <p className="text-xs text-gray-600">Last session {relativeTime(lastSession)}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-3">
          Complete your first session to start building your signal.
        </p>
      )}

      <Link
        href="/tools/flowzone"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors mt-3"
      >
        Open FlowZone <span>→</span>
      </Link>
    </SignalCard>
  );
}

function CuriosityCard({ curiosity }: { curiosity: CuriosityData | null }) {
  const connected = !!curiosity;
  const itemCount = curiosity?.items?.length ?? 0;
  const intersectionCount = curiosity?.intersections?.length ?? 0;

  return (
    <SignalCard topEdge={AMETHYST}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-base">Curiosity Map</h3>
          <p className="text-xs text-gray-500 mt-0.5">Your curiosity intersections</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: connected ? '#4ade80' : '#666' }}>●</span>
          <span className="text-xs text-gray-500">{connected ? 'Connected' : 'No data'}</span>
        </div>
      </div>

      <div className="flex gap-1.5 mb-4">
        <PillarBadge name="SPIRIT" color={AMETHYST} />
      </div>

      {connected ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xl font-bold" style={{ color: AMETHYST }}>{itemCount}</div>
              <div className="text-[11px] text-gray-500">curiosities</div>
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: AMETHYST }}>{intersectionCount}</div>
              <div className="text-[11px] text-gray-500">intersections</div>
            </div>
          </div>
          {curiosity.updated_at && (
            <p className="text-xs text-gray-600">Synced {relativeTime(curiosity.updated_at)}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-3">
          Map your curiosities to feed your SPIRIT signal.
        </p>
      )}

      <Link
        href="/tools/curiosity-explorer"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors mt-3"
      >
        Open Curiosity Map <span>→</span>
      </Link>
    </SignalCard>
  );
}

function FlowHabitsCard() {
  return (
    <SignalCard topEdge={CORAL} muted>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-gray-500 font-semibold text-base">FlowHabits</h3>
          <p className="text-xs text-gray-600 mt-0.5">Four Pillars habit tracker</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: '#666' }}>●</span>
          <span className="text-xs text-gray-600">Not connected</span>
        </div>
      </div>

      <div className="flex gap-1.5 mb-4">
        <PillarBadge name="SELF" color={`${CORAL}60`} />
      </div>

      <p className="text-sm text-gray-600 mb-1">iOS integration coming soon.</p>
      <p className="text-xs text-gray-700 mb-3">Your daily habit completions will feed this signal automatically.</p>

      <a
        href="https://fourflowos.com/apps"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors"
      >
        FlowHabits iOS app <span>→</span>
      </a>
    </SignalCard>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
        <p className="text-[11px] text-gray-700">{label}</p>
      </div>
    </div>
  );
}

export default function MePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get('auth_error') as 'expired' | 'used' | 'failed' | null;
  const [data, setData] = useState<SignalData>({ sessions: [], curiosity: null, assessment: null });
  const [fetching, setFetching] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  useEffect(() => {
    if (!user) return;
    setFetching(true);

    const supabase = getSupabaseBrowser();

    function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T | null> {
      return Promise.race([
        Promise.resolve(promise),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
      ]);
    }

    function fetchAssessment() {
      return supabase
        .from('assessments')
        .select('status, created_at, view_token, flow_profile_final, flow_profile_json')
        .eq('user_id', user!.id)
        .eq('status', 'delivered')
        .not('flow_profile_final', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .then((r) => (r.data as AssessmentData[] | null)?.[0] ?? null);
    }

    // Assessment fetches independently — signal queries can't block it.
    // Limit sessions to 50 rows — enough for all stats, avoids fetching thousands.
    const assessmentQuery = fetchAssessment();

    const sessionsQuery = supabase
      .from('focus_sessions')
      .select('id, focus_reps, ended_at, started_at')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(50)
      .then((r) => (r.data ?? []) as SessionRow[]);

    const curiosityQuery = supabase
      .from('curiosity_snapshots')
      .select('items, intersections, updated_at')
      .eq('user_id', user.id)
      .single()
      .then((r) => r.data as CuriosityData | null);

    Promise.all([
      withTimeout(assessmentQuery, 8000),
      withTimeout(sessionsQuery, 8000),
      withTimeout(curiosityQuery, 8000),
    ]).then(([assessment, sessions, curiosity]) => {
      setData({
        assessment: assessment ?? null,
        sessions: sessions ?? [],
        curiosity: curiosity ?? null,
      });

      // If assessment came back null, this might be an auto-link race: the user
      // submitted their intake unauthenticated, signed in, and the background
      // UPDATE (linking assessment.user_id) hadn't finished before this query ran.
      // Retry once after 2 seconds — cheap operation, big UX win.
      if (!assessment) {
        setTimeout(() => {
          withTimeout(fetchAssessment(), 5000).then((retried) => {
            if (retried) setData((prev) => ({ ...prev, assessment: retried }));
          });
        }, 2000);
      }
    }).catch((err) => {
      console.warn('[/me] data fetch error:', err?.message);
    }).finally(() => {
      setFetching(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (loading) return <Spinner label="checking auth…" />;
  if (!user) return <AuthModal authError={authError} />;
  if (fetching) return <Spinner label="loading signals…" />;

  const hasStructuredProfile = !!data.assessment?.flow_profile_json;

  // ── Bento dashboard (structured JSON profile) ──────────────────────────────
  if (hasStructuredProfile) {
    const profile = data.assessment!.flow_profile_json!;

    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <LandingNav />
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Flow Archetype</p>
            <h1 className="text-3xl font-light text-white mb-3">Your Signal</h1>
            <div
              className="h-px"
              style={{ background: `linear-gradient(90deg, ${CORAL}, ${SAGE}, ${STEEL}, ${AMETHYST})` }}
            />
          </motion.div>

          {/* Dashboard card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <BentoGrid
              profile={profile}
              sessions={data.sessions}
              curiosity={data.curiosity}
              assessment={data.assessment!}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <RawProfileDrawer
              assessment={data.assessment!}
              sessions={data.sessions}
              curiosity={data.curiosity}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Legacy text-based layout ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Your Flow Profile</h1>
            <p className="text-gray-500 text-sm">Your diagnostic + live signal data</p>
            {user.email && (
              <p className="text-gray-600 text-xs mt-1">{user.email}</p>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-600 hover:text-white transition-colors mt-1"
          >
            Sign out
          </button>
        </div>

        {/* Profile text — primary surface */}
        <ProfileTextSection assessment={data.assessment} signals={data} />

        {/* Live signals */}
        <div className="mb-4">
          <h2 className="text-xs font-medium tracking-widest text-gray-600 uppercase mb-4">Live Signals</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <FlowZoneCard sessions={data.sessions} />
            <CuriosityCard curiosity={data.curiosity} />
            <div className="md:col-span-2">
              <FlowHabitsCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
