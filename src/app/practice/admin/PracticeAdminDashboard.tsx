'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AMETHYST, STEEL, CORAL, SAGE, GRADIENTS } from '@/styles/brand-colors';

type Pillar = 'self' | 'space' | 'story' | 'spirit';

const PILLAR_COLORS: Record<string, string> = {
  self: CORAL, space: SAGE, story: STEEL, spirit: AMETHYST,
};

const PILLAR_LABELS: Record<string, string> = {
  self: 'SELF', space: 'SPACE', story: 'STORY', spirit: 'SPIRIT',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface FlowLensRow {
  id: string;
  user_id: string;
  gravity_pillar: string;
  blind_side_pillar: string;
  generated_at: string;
  flow_lens_intakes: { answers: Record<string, string>; pillar_scores: Record<string, number>; created_at: string } | null;
}

interface EsotericRow {
  id: string;
  user_id: string;
  generated_at: string;
  esoteric_intakes: { full_name: string; birth_date: string; birth_location: string | null; created_at: string } | null;
}

interface DetailProfile {
  type: 'flow_lens' | 'esoteric';
  data: Record<string, unknown> | null;
  loading: boolean;
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function PracticeAdminDashboard() {
  const [tab, setTab] = useState<'flow_lens' | 'esoteric'>('flow_lens');
  const [flowLens, setFlowLens] = useState<FlowLensRow[]>([]);
  const [esoteric, setEsoteric] = useState<EsotericRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<DetailProfile | null>(null);

  const adminKey = typeof window !== 'undefined' ? sessionStorage.getItem('profile_admin_key') ?? '' : '';

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/core/admin/list', {
        headers: { 'x-admin-key': adminKey },
      });
      const data = await res.json();
      if (data.success) {
        setFlowLens(data.flow_lens ?? []);
        setEsoteric(data.esoteric ?? []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => { loadList(); }, [loadList]);

  async function loadDetail(id: string, type: 'flow_lens' | 'esoteric') {
    setDetail({ type, data: null, loading: true });
    try {
      const res = await fetch(`/api/core/admin/${id}?type=${type}`, {
        headers: { 'x-admin-key': adminKey },
      });
      const data = await res.json();
      setDetail({ type, data: data.profile ?? null, loading: false });
    } catch (e) {
      setDetail({ type, data: null, loading: false });
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.07] px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Practice Admin</h1>
            <p className="text-xs text-white/30 mt-0.5">Flow Lens + Timeless Map profiles</p>
          </div>
          <a
            href="/profile/admin"
            className="text-xs text-white/25 hover:text-white/50 transition-colors"
          >
            Legacy profiles →
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 flex gap-6">
        {/* Left panel: list */}
        <div className="flex-1 min-w-0">
          {/* Tab switcher */}
          <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl mb-5 w-fit">
            {(['flow_lens', 'esoteric'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: tab === t ? 'rgba(255,255,255,0.07)' : 'transparent',
                  color: tab === t ? '#fff' : 'rgba(255,255,255,0.35)',
                }}
              >
                {t === 'flow_lens' ? 'Flow Lens' : 'Timeless Map'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-5 h-5 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
            </div>
          ) : tab === 'flow_lens' ? (
            <FlowLensList rows={flowLens} onSelect={r => loadDetail(r.id, 'flow_lens')} formatDate={formatDate} />
          ) : (
            <EsotericList rows={esoteric} onSelect={r => loadDetail(r.id, 'esoteric')} formatDate={formatDate} />
          )}
        </div>

        {/* Right panel: detail */}
        {detail && (
          <div className="w-80 flex-shrink-0">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  {detail.type === 'flow_lens' ? 'Flow Lens Profile' : 'Timeless Map'}
                </p>
                <button
                  onClick={() => setDetail(null)}
                  className="text-white/20 hover:text-white/50 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>

              {detail.loading ? (
                <div className="flex items-center justify-center h-24">
                  <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
                </div>
              ) : detail.data ? (
                <DetailView profile={detail.data} type={detail.type} formatDate={formatDate} />
              ) : (
                <p className="text-xs text-white/30">Failed to load.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Flow Lens list ───────────────────────────────────────────────────────────

function FlowLensList({
  rows,
  onSelect,
  formatDate,
}: {
  rows: FlowLensRow[];
  onSelect: (r: FlowLensRow) => void;
  formatDate: (s: string) => string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-white/25 py-8 text-center">No Flow Lens profiles yet.</p>;
  }

  return (
    <div className="space-y-2">
      {rows.map(row => (
        <button
          key={row.id}
          onClick={() => onSelect(row)}
          className="w-full text-left p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: `${PILLAR_COLORS[row.gravity_pillar] ?? AMETHYST}20`,
                  color: PILLAR_COLORS[row.gravity_pillar] ?? AMETHYST,
                }}
              >
                {PILLAR_LABELS[row.gravity_pillar] ?? row.gravity_pillar.toUpperCase()}
              </span>
              <span className="text-white/20 text-xs">→</span>
              <span
                className="text-xs font-bold tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: `${PILLAR_COLORS[row.blind_side_pillar] ?? STEEL}15`,
                  color: `${PILLAR_COLORS[row.blind_side_pillar] ?? STEEL}80`,
                }}
              >
                {PILLAR_LABELS[row.blind_side_pillar] ?? row.blind_side_pillar.toUpperCase()} gap
              </span>
            </div>
            <span className="text-[10px] text-white/20">{formatDate(row.generated_at)}</span>
          </div>
          <div className="flex gap-3">
            {(['self', 'space', 'story', 'spirit'] as Pillar[]).map(p => {
              const score = row.flow_lens_intakes?.pillar_scores?.[p] ?? 0;
              return (
                <div key={p} className="flex flex-col items-center gap-1">
                  <div
                    className="w-1 rounded-full"
                    style={{
                      height: `${Math.max(4, score * 3)}px`,
                      background: PILLAR_COLORS[p],
                      opacity: p === row.gravity_pillar ? 1 : 0.3,
                    }}
                  />
                  <span className="text-[8px] text-white/20">{p[0].toUpperCase()}</span>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-white/15 mt-2 font-mono truncate">{row.user_id}</p>
        </button>
      ))}
    </div>
  );
}

// ─── Esoteric list ────────────────────────────────────────────────────────────

function EsotericList({
  rows,
  onSelect,
  formatDate,
}: {
  rows: EsotericRow[];
  onSelect: (r: EsotericRow) => void;
  formatDate: (s: string) => string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-white/25 py-8 text-center">No Timeless Map profiles yet.</p>;
  }

  return (
    <div className="space-y-2">
      {rows.map(row => (
        <button
          key={row.id}
          onClick={() => onSelect(row)}
          className="w-full text-left p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-white/70 font-medium">
              {row.esoteric_intakes?.full_name ?? 'Unknown'}
            </p>
            <span className="text-[10px] text-white/20">{formatDate(row.generated_at)}</span>
          </div>
          <p className="text-xs text-white/30">
            {row.esoteric_intakes?.birth_date}{row.esoteric_intakes?.birth_location ? ` · ${row.esoteric_intakes.birth_location}` : ''}
          </p>
          <p className="text-[10px] text-white/15 mt-1 font-mono truncate">{row.user_id}</p>
        </button>
      ))}
    </div>
  );
}

// ─── Detail view ──────────────────────────────────────────────────────────────

function DetailView({
  profile,
  type,
  formatDate,
}: {
  profile: Record<string, unknown>;
  type: 'flow_lens' | 'esoteric';
  formatDate: (s: string) => string;
}) {
  if (type === 'flow_lens') {
    const intake = profile.flow_lens_intakes as Record<string, unknown> | null;
    const profileJson = profile.profile_json as Record<string, unknown> | null;
    const sections = profileJson?.sections as Record<string, string> | null;

    return (
      <div className="space-y-4 text-sm">
        <div className="flex gap-2 flex-wrap">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: `${PILLAR_COLORS[profile.gravity_pillar as string] ?? AMETHYST}20`,
              color: PILLAR_COLORS[profile.gravity_pillar as string] ?? AMETHYST,
            }}
          >
            {PILLAR_LABELS[profile.gravity_pillar as string] ?? 'GRAVITY'}
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            {PILLAR_LABELS[profile.blind_side_pillar as string] ?? 'BLIND'} gap
          </span>
        </div>

        {sections?.gravity && (
          <div>
            <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Gravity</p>
            <p className="text-xs text-white/50 leading-relaxed">{sections.gravity}</p>
          </div>
        )}
        {sections?.blind_side && (
          <div>
            <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Blind Side</p>
            <p className="text-xs text-white/50 leading-relaxed">{sections.blind_side}</p>
          </div>
        )}
        {sections?.compounding_move && (
          <div>
            <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Compounding Move</p>
            <p className="text-xs text-white/50 leading-relaxed">{sections.compounding_move}</p>
          </div>
        )}
        {intake && (
          <div>
            <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Intake answers</p>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(intake.answers as Record<string, string>).map(([k, v]) => (
                <div key={k} className="text-[10px] text-white/30">
                  <span className="text-white/20">{k}: </span>{v}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Esoteric
  const intake = profile.esoteric_intakes as Record<string, unknown> | null;
  const profileJson = profile.profile_json as Record<string, unknown> | null;
  const sections = profileJson?.sections as Record<string, string> | null;

  return (
    <div className="space-y-4 text-sm">
      {intake && (
        <div>
          <p className="text-base text-white font-semibold">{intake.full_name as string}</p>
          <p className="text-xs text-white/35">{intake.birth_date as string}{intake.birth_location ? ` · ${intake.birth_location}` : ''}</p>
        </div>
      )}

      {sections?.name_signal && (
        <div>
          <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Name Signal</p>
          <p className="text-xs text-white/50 leading-relaxed">{sections.name_signal}</p>
        </div>
      )}
      {sections?.birth_code && (
        <div>
          <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Birth Code</p>
          <p className="text-xs text-white/50 leading-relaxed">{sections.birth_code}</p>
        </div>
      )}
      {sections?.natal_pattern && (
        <div>
          <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Natal Pattern</p>
          <p className="text-xs text-white/50 leading-relaxed">{sections.natal_pattern}</p>
        </div>
      )}
      {sections?.flow_architecture && (
        <div>
          <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Flow Architecture</p>
          <p className="text-xs text-white/50 leading-relaxed">{sections.flow_architecture}</p>
        </div>
      )}
    </div>
  );
}
