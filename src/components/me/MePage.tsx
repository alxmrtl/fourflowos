'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

const CORAL = '#FF6F61';
const SAGE = '#6BA292';
const STEEL = '#5B84B1';
const AMETHYST = '#7A4DA4';

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
  topEdge: string; // CSS gradient or color string for the 1px top border
  children: React.ReactNode;
  muted?: boolean;
}

function SignalCard({ topEdge, children, muted }: CardProps) {
  return (
    <div
      className={`rounded-2xl overflow-hidden border ${muted ? 'border-white/5' : 'border-white/10'}`}
      style={{ background: muted ? 'rgba(20,20,20,0.6)' : 'rgba(20,20,20,0.95)' }}
    >
      {/* 3px top edge */}
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
}

interface SignalData {
  sessions: SessionRow[];
  curiosity: CuriosityData | null;
  assessment: AssessmentData | null;
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

function FlowProfileCard({ assessment }: { assessment: AssessmentData | null }) {
  const topEdge = `linear-gradient(90deg, ${CORAL}, ${SAGE}, ${STEEL}, ${AMETHYST})`;
  const delivered = assessment?.status === 'delivered';
  const pending = assessment && !delivered;

  return (
    <SignalCard topEdge={topEdge}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-base">Flow Profile</h3>
          <p className="text-xs text-gray-500 mt-0.5">Your diagnostic across all 4 pillars</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: delivered ? '#4ade80' : '#666' }}>●</span>
          <span className="text-xs text-gray-500">
            {delivered ? 'Delivered' : pending ? 'In progress' : 'Not started'}
          </span>
        </div>
      </div>

      <div className="flex gap-1.5 mb-4">
        <PillarBadge name="SELF" color={CORAL} />
        <PillarBadge name="SPACE" color={SAGE} />
        <PillarBadge name="STORY" color={STEEL} />
        <PillarBadge name="SPIRIT" color={AMETHYST} />
      </div>

      {delivered && assessment?.view_token ? (
        <div>
          <p className="text-sm text-gray-400 mb-3">
            Profile delivered {relativeTime(assessment.created_at)}
          </p>
          <Link
            href={`/profile/view/${assessment.view_token}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-white hover:text-gray-300 transition-colors"
          >
            View your profile <span>→</span>
          </Link>
        </div>
      ) : pending ? (
        <p className="text-sm text-gray-500">Assessment in progress — your profile is being prepared.</p>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-3">
            Take the Flow Profile assessment to unlock your full signal picture.
          </p>
          <Link
            href="/profile/intake"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            Start assessment <span>→</span>
          </Link>
        </div>
      )}
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
  const [data, setData] = useState<SignalData>({ sessions: [], curiosity: null, assessment: null });
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    console.log('[/me] fetching data for user:', user.id);

    const supabase = getSupabaseBrowser();

    // Race queries against an 8-second timeout so a hung Supabase connection
    // doesn't block the page indefinitely.
    const queries = Promise.all([
      supabase
        .from('focus_sessions')
        .select('id, focus_reps, ended_at, started_at')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false }),
      supabase
        .from('curiosity_snapshots')
        .select('items, intersections, updated_at')
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('assessments')
        .select('status, created_at, view_token')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),
    ]);

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 8000)
    );

    Promise.race([queries, timeout])
      .then(([sessionsResult, curiosityResult, assessmentResult]) => {
        console.log('[/me] queries ok');
        setData({
          sessions: (sessionsResult.data ?? []) as SessionRow[],
          curiosity: curiosityResult.data as CuriosityData | null,
          assessment: assessmentResult.data as AssessmentData | null,
        });
      })
      .catch((err) => {
        console.warn('[/me] queries failed or timed out:', err?.message);
      })
      .finally(() => {
        setFetching(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // 1. Auth check in progress
  if (loading) return <Spinner label="checking auth…" />;

  // 2. Not authenticated — show sign-in modal
  if (!user) return <AuthModal />;

  // 3. Authenticated, data loading
  if (fetching) return <Spinner label="loading signals…" />;

  // 4. Ready
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Your Signals</h1>
            <p className="text-gray-500 text-sm">What&apos;s feeding your FourFlow profile</p>
            {user.email && (
              <p className="text-gray-600 text-xs mt-1">{user.email}</p>
            )}
          </div>
          <button
            onClick={signOut}
            className="text-sm text-gray-600 hover:text-white transition-colors mt-1"
          >
            Sign out
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FlowZoneCard sessions={data.sessions} />
          <CuriosityCard curiosity={data.curiosity} />
          <div className="md:col-span-2">
            <FlowProfileCard assessment={data.assessment} />
          </div>
          <FlowHabitsCard />
        </div>
      </div>
    </div>
  );
}
