'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AMETHYST, STEEL, CORAL, SAGE } from '@/styles/brand-colors';
import { KEY_BY_ID, type Pillar } from '@/data/flow-unlock-config';
import FlowLensIntake from './FlowLensIntake';
import FlowUnlockResult from './FlowUnlockResult';
import {
  type FlowLensDisplayProfile,
  type FlowUnlockHistoryItem,
} from './flow-lens-demo-profile';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

type CardState = 'empty' | 'intake' | 'generating' | 'profile';

const PC: Record<Pillar, string> = { self: CORAL, space: SAGE, story: STEEL, spirit: AMETHYST };

interface Props {
  initialProfile: FlowLensDisplayProfile | null;
  history?: FlowUnlockHistoryItem[];
}

async function getAccessToken(): Promise<string | null> {
  const { data: { session } } = await getSupabaseBrowser().auth.getSession();
  return session?.access_token ?? null;
}

function isToday(iso: string): boolean {
  return new Date(iso).toDateString() === new Date().toDateString();
}

// ── Keyhole — the daily invitation ────────────────────────────────────────────

function Keyhole() {
  return (
    <div className="relative w-16 h-16 mb-5" aria-hidden="true">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `1px solid ${AMETHYST}35` }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.15, 0.5] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg viewBox="0 0 64 64" className="absolute inset-0">
        <circle cx="32" cy="26" r="8" fill="none" stroke={`${AMETHYST}B0`} strokeWidth="1.5" />
        <path d="M29 32 L26 46 L38 46 L35 32" fill="none" stroke={`${AMETHYST}B0`} strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <motion.div
        className="absolute rounded-full"
        style={{ width: 4, height: 4, background: AMETHYST, left: 30, top: 24, boxShadow: `0 0 8px ${AMETHYST}` }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

// ── Past unlocks ──────────────────────────────────────────────────────────────

function UnlockHistory({ history }: { history: FlowUnlockHistoryItem[] }) {
  const [open, setOpen] = useState(false);
  if (history.length === 0) return null;

  // Meta-read: which Key keeps coming up across recent unlocks
  const recent = history.slice(0, 5).filter(h => h.bottleneck_key && h.bottleneck_key in KEY_BY_ID);
  let metaLine: string | null = null;
  if (recent.length >= 3) {
    const counts = new Map<string, number>();
    for (const h of recent) counts.set(h.bottleneck_key!, (counts.get(h.bottleneck_key!) ?? 0) + 1);
    const [topKey, topCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (topCount >= 2) {
      metaLine = `${topCount} of your last ${recent.length} unlocks landed on ${KEY_BY_ID[topKey as keyof typeof KEY_BY_ID].name}`;
    }
  }

  return (
    <div className="mt-6 pt-4 border-t border-white/[0.05]">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30 hover:text-white/55 transition-colors"
      >
        <span>Past unlocks</span>
        <span className="text-white/20">{history.length}</span>
        <span className="text-white/20">{open ? '▾' : '▸'}</span>
      </button>
      {metaLine && (
        <p className="text-[10px] text-white/35 mt-1.5 italic">{metaLine}</p>
      )}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mt-3 space-y-2"
          >
            {history.map(h => {
              const card = h.bottleneck_key && h.bottleneck_key in KEY_BY_ID ? KEY_BY_ID[h.bottleneck_key] : null;
              const color = card ? PC[card.dimension] : 'rgba(255,255,255,0.2)';
              const date = new Date(h.generated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <li key={h.id} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 mt-[5px] w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[11px] font-medium" style={{ color: card ? `${color}D0` : 'rgba(255,255,255,0.45)' }}>
                        {card?.name ?? 'Earlier read'}
                      </span>
                      <span className="text-[9px] text-white/20">{date}</span>
                    </div>
                    {h.move && <p className="text-[11px] text-white/35 leading-snug truncate">{h.move}</p>}
                  </div>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

export default function FlowLensCard({ initialProfile, history = [] }: Props) {
  const { user } = useAuth();
  const [cardState, setCardState] = useState<CardState>(initialProfile ? 'profile' : 'empty');
  const [profile, setProfile] = useState<FlowLensDisplayProfile | null>(initialProfile);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unlockedToday = profile ? isToday(profile.generated_at) : false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleIntakeSubmit(payload: any) {
    setSubmitting(true);
    setCardState('generating');
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Not authenticated');

      const answers = payload?.answers ?? payload;
      const answerMetadata = payload?.answer_metadata;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const res = await fetch('/api/core/flow-lens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ answers, answer_metadata: answerMetadata, timezone }),
      });

      const data = await res.json();

      if (res.status === 429 && data.profile) {
        // Already unlocked today — show today's read
        setProfile(data.profile as FlowLensDisplayProfile);
        setCardState('profile');
        return;
      }
      if (!data.success) throw new Error(data.error ?? 'Generation failed');

      setProfile(data.profile as FlowLensDisplayProfile);
      setCardState('profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setCardState('intake');
    } finally {
      setSubmitting(false);
    }
  }

  // Renders inside ToolShell — the shell owns the header; this is body only.
  return (
    <div className="text-white">
        <AnimatePresence mode="wait">
          {cardState === 'empty' && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <Keyhole />
              <p className="text-sm text-white/35 leading-relaxed mb-5 max-w-sm">
                Bring one stuck thing. Six steps, two minutes — it reads where your effort keeps going,
                names the gate worth opening, and gives you a move for each. One unlock a day.
              </p>
              <button
                onClick={() => setCardState('intake')}
                className="px-5 py-2 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${STEEL}, ${AMETHYST})` }}
              >
                Unlock today
              </button>
            </motion.div>
          )}

          {cardState === 'intake' && (
            <motion.div
              key="intake"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
              <FlowLensIntake
                onSubmit={handleIntakeSubmit}
                onCancel={() => setCardState(initialProfile ? 'profile' : 'empty')}
                submitting={submitting}
              />
            </motion.div>
          )}

          {cardState === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 gap-4"
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: `${AMETHYST}40`, borderTopColor: AMETHYST }}
              />
              <p className="text-sm text-white/30">Reading your pattern...</p>
            </motion.div>
          )}

          {cardState === 'profile' && profile && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FlowUnlockResult profile={profile} />

              {/* Daily-lock footer */}
              <div className="mt-4 flex items-center justify-end">
                {unlockedToday ? (
                  <span className="flex items-center gap-1.5 text-[10px] text-white/25">
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M5 7 V5 a3 3 0 0 1 6 0 V7" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                    Next unlock at midnight
                  </span>
                ) : (
                  <button
                    onClick={() => setCardState('intake')}
                    className="text-[10px] text-white/30 hover:text-white/55 transition-colors"
                  >
                    Stuck on something? Unlock today →
                  </button>
                )}
              </div>

              <UnlockHistory history={history.filter(h => h.id !== profile.id)} />
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
