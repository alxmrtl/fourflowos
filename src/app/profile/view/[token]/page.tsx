'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import AuthModal from '@/components/auth/AuthModal';

const PILLAR_COLORS = {
  SELF: '#FF6F61',
  SPACE: '#6BA292',
  STORY: '#5B84B1',
  SPIRIT: '#7A4DA4',
};

interface ProfileData {
  name: string;
  content: string;
  created_at: string;
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

interface SignalData {
  sessions: SessionRow[];
  curiosity: CuriosityData | null;
}

function relativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return 'never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function CopyButton({ profile, signals }: { profile: ProfileData; signals: SignalData | null }) {
  const [copied, setCopied] = useState(false);

  function buildLlmContext() {
    const lines: string[] = [
      `# My FourFlow Profile`,
      ``,
      `**Name:** ${profile.name}`,
      `**Generated:** ${new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      ``,
      `---`,
      ``,
      profile.content,
    ];

    if (signals) {
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
    }

    return lines.join('\n');
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildLlmContext());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/15 text-gray-400 hover:text-white hover:border-white/30 transition-all"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="#6BA292" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span style={{ color: '#6BA292' }}>Copied</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy for LLM
        </>
      )}
    </button>
  );
}

function SignalDashboard({ profile }: { profile: ProfileData }) {
  const { user, loading: authLoading } = useAuth();
  const [signals, setSignals] = useState<SignalData | null>(null);
  const [fetching, setFetching] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    const supabase = getSupabaseBrowser();

    Promise.all([
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
    ])
      .then(([sessionsResult, curiosityResult]) => {
        setSignals({
          sessions: (sessionsResult.data ?? []) as SessionRow[],
          curiosity: curiosityResult.data as CuriosityData | null,
        });
      })
      .finally(() => setFetching(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (authLoading) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      className="max-w-3xl mx-auto px-6 pb-10"
    >
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-white">Live Signals</h2>
          <p className="text-xs text-gray-600 mt-0.5">Your tools, feeding the profile</p>
        </div>
        {user && signals && (
          <CopyButton profile={profile} signals={signals} />
        )}
      </div>

      {!user ? (
        <div className="p-6 rounded-2xl border border-white/10 text-center" style={{ background: 'rgba(20,20,20,0.8)' }}>
          <p className="text-sm text-gray-400 mb-1">This is your profile.</p>
          <p className="text-xs text-gray-600 mb-4">Sign in to see your live signals alongside it — FlowZone sessions, curiosity map, and more.</p>
          <button
            onClick={() => setShowAuth(true)}
            className="px-4 py-2 text-sm rounded-lg text-white transition-colors hover:opacity-80"
            style={{ background: 'linear-gradient(135deg, #5B84B1, #7A4DA4)' }}
          >
            Activate dashboard
          </button>
          {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </div>
      ) : fetching ? (
        <div className="py-6 flex justify-center">
          <div className="w-4 h-4 rounded-full border border-white/20 border-t-white/60 animate-spin" />
        </div>
      ) : signals ? (
        <div className="grid md:grid-cols-2 gap-4">
          <CompactFlowZoneCard sessions={signals.sessions} />
          <CompactCuriosityCard curiosity={signals.curiosity} />
        </div>
      ) : null}

      {user && (
        <div className="mt-4 text-center">
          <Link href="/me" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            Open full dashboard →
          </Link>
        </div>
      )}
    </motion.section>
  );
}

function CompactFlowZoneCard({ sessions }: { sessions: SessionRow[] }) {
  const totalSessions = sessions.length;
  const totalReps = sessions.reduce((sum, s) => sum + (s.focus_reps ?? 0), 0);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const sessionsThisWeek = sessions.filter(
    (s) => s.started_at && new Date(s.started_at).getTime() > weekAgo
  ).length;
  const lastSession = sessions[0]?.ended_at ?? null;
  const connected = totalSessions > 0;

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: 'rgba(20,20,20,0.95)' }}>
      <div style={{ height: 2, background: `linear-gradient(90deg, #FF6F61, #6BA292)` }} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">FlowZone</h3>
          <span className="text-[10px]" style={{ color: connected ? '#4ade80' : '#555' }}>● {connected ? 'Connected' : 'No data'}</span>
        </div>
        {connected ? (
          <>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <div className="text-lg font-bold" style={{ color: '#FF6F61' }}>{totalSessions}</div>
                <div className="text-[10px] text-gray-600">sessions</div>
              </div>
              <div>
                <div className="text-lg font-bold" style={{ color: '#6BA292' }}>{totalReps}</div>
                <div className="text-[10px] text-gray-600">reps</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">{sessionsThisWeek}</div>
                <div className="text-[10px] text-gray-600">this week</div>
              </div>
            </div>
            {lastSession && <p className="text-[10px] text-gray-700">Last session {relativeTime(lastSession)}</p>}
          </>
        ) : (
          <p className="text-xs text-gray-600">No sessions yet.</p>
        )}
      </div>
    </div>
  );
}

function CompactCuriosityCard({ curiosity }: { curiosity: CuriosityData | null }) {
  const connected = !!curiosity;
  const itemCount = curiosity?.items?.length ?? 0;
  const intersectionCount = curiosity?.intersections?.length ?? 0;

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: 'rgba(20,20,20,0.95)' }}>
      <div style={{ height: 2, background: '#7A4DA4' }} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Curiosity Map</h3>
          <span className="text-[10px]" style={{ color: connected ? '#4ade80' : '#555' }}>● {connected ? 'Connected' : 'No data'}</span>
        </div>
        {connected ? (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-lg font-bold" style={{ color: '#7A4DA4' }}>{itemCount}</div>
              <div className="text-[10px] text-gray-600">curiosities</div>
            </div>
            <div>
              <div className="text-lg font-bold" style={{ color: '#7A4DA4' }}>{intersectionCount}</div>
              <div className="text-[10px] text-gray-600">intersections</div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-600">No curiosities mapped yet.</p>
        )}
      </div>
    </div>
  );
}

export default function ProfileViewPage() {
  const params = useParams();
  const token = params.token as string;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile/view/${token}`);
        const data = await res.json();
        if (data.success) {
          setProfile(data.profile);
        } else {
          setError(data.error || 'Profile not found');
        }
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-[#6BA292] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading your Flow Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/[0.05] flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Profile not available</h1>
          <p className="text-gray-500">
            {error === 'Profile not yet available'
              ? 'Your profile is still being prepared. Check back soon.'
              : 'This link may be invalid or expired.'}
          </p>
        </div>
      </div>
    );
  }

  const firstName = profile.name.split(' ')[0];
  const profileDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-12 pb-8 px-6"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-sm tracking-[0.2em] text-gray-500 uppercase mb-4">FourFlow</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Flow Profile
            </h1>
            <p className="text-lg text-gray-400">{profile.name}</p>
            <p className="text-xs text-gray-600 mt-2">{profileDate}</p>

            {/* Four pillar dots */}
            <div className="flex items-center justify-center gap-3 mt-6">
              {Object.entries(PILLAR_COLORS).map(([name, color]) => (
                <div key={name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[10px] tracking-wider text-gray-600 uppercase">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Copy for LLM — below the header */}
          <div className="flex justify-center">
            <CopyButton profile={profile} signals={null} />
          </div>
        </div>
      </motion.header>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Profile content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-3xl mx-auto px-6 py-10"
      >
        <div className="profile-content prose prose-invert prose-lg max-w-none">
          <ProfileMarkdown content={profile.content} />
        </div>
      </motion.main>

      {/* Signal Dashboard */}
      <SignalDashboard profile={profile} />

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-3xl mx-auto px-6 pb-20"
      >
        <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Go Deeper
            </h2>
            <p className="text-gray-400 mb-2 max-w-lg mx-auto">
              This profile is based on your intake responses. A live facilitated session reveals what sits beneath the surface.
            </p>
            <p className="text-gray-500 text-sm mb-6 max-w-lg mx-auto">
              The blind spots, the cascades between pillars, the patterns that only emerge when someone asks the right question at the right time.
            </p>
            <a
              href="mailto:fourflowos@gmail.com?subject=Book a Live Flow Session&body=Hi, I'd like to book a facilitated Flow Session to go deeper on my profile."
              className="inline-block px-8 py-3.5 bg-gradient-to-r from-[#6BA292] to-[#7A4DA4] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]"
            >
              Book a Live Flow Session
            </a>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-xs text-gray-700">
          {firstName}&apos;s Flow Profile &middot; FourFlow &middot; {profileDate}
        </p>
      </footer>

      <style jsx global>{`
        .profile-content h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .profile-content h2 {
          font-size: 1.375rem;
          font-weight: 600;
          color: #fff;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .profile-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #e5e5e5;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .profile-content p {
          font-size: 1rem;
          line-height: 1.75;
          color: #a1a1aa;
          margin-bottom: 1rem;
        }
        .profile-content strong {
          color: #e5e5e5;
          font-weight: 600;
        }
        .profile-content ul, .profile-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .profile-content li {
          font-size: 1rem;
          line-height: 1.75;
          color: #a1a1aa;
          margin-bottom: 0.25rem;
        }
        .profile-content hr {
          border: none;
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 2rem 0;
        }
        .profile-content blockquote {
          border-left: 3px solid #6BA292;
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: #a1a1aa;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

/**
 * Simple markdown-to-HTML renderer for the profile content.
 * Handles headers, bold, italic, lists, blockquotes, and paragraphs.
 */
function ProfileMarkdown({ content }: { content: string }) {
  const html = markdownToHtml(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function markdownToHtml(md: string): string {
  let html = md
    // Escape HTML entities
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Horizontal rules
    .replace(/^---+$/gm, '<hr />')
    // Headers (process before other inline formatting)
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Blockquotes
    .replace(/^&gt; (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // Process lists and paragraphs
  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;
  let listType = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ulMatch = line.match(/^[-*] (.+)/);
    const olMatch = line.match(/^\d+\. (.+)/);

    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        if (inList) result.push(`</${listType}>`);
        result.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      result.push(`<li>${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (!inList || listType !== 'ol') {
        if (inList) result.push(`</${listType}>`);
        result.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      result.push(`<li>${olMatch[1]}</li>`);
    } else {
      if (inList) {
        result.push(`</${listType}>`);
        inList = false;
        listType = '';
      }
      // Blank lines or already-processed tags
      if (line.trim() === '') {
        result.push('');
      } else if (line.startsWith('<h') || line.startsWith('<hr') || line.startsWith('<blockquote')) {
        result.push(line);
      } else {
        result.push(`<p>${line}</p>`);
      }
    }
  }
  if (inList) result.push(`</${listType}>`);

  return result.join('\n');
}
