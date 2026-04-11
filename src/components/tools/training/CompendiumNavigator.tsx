'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import type { MasteryStats, Pillar } from '@/types/training';
import CardDetailModal, { type StateData } from './CardDetailModal';

// ── Color maps ───────────────────────────────────────────────────────

const PILLAR_COLORS: Record<Pillar, {
  label: string;
  bg: string;
  border: string;
  dot: string;
  barBg: (score: number) => string;
  badgeBg: string;
  activePill: string;
  activeStatePill: string;
  activeQualPill: string;
  descBar: string;
}> = {
  self: {
    label: 'text-self',
    bg: 'bg-self/5',
    border: 'border-self',
    dot: 'bg-self',
    barBg: (s) => ['bg-self/5', 'bg-self/8', 'bg-self/12', 'bg-self/18', 'bg-self/25'][Math.max(0, Math.min(4, s - 1))],
    badgeBg: 'bg-self/10 text-self',
    activePill: 'bg-self text-white',
    activeStatePill: 'bg-self/80 text-white',
    activeQualPill: 'bg-self/75 text-white',
    descBar: 'bg-self/80',
  },
  space: {
    label: 'text-space',
    bg: 'bg-space/5',
    border: 'border-space',
    dot: 'bg-space',
    barBg: (s) => ['bg-space/5', 'bg-space/8', 'bg-space/12', 'bg-space/18', 'bg-space/25'][Math.max(0, Math.min(4, s - 1))],
    badgeBg: 'bg-space/10 text-space',
    activePill: 'bg-space text-white',
    activeStatePill: 'bg-space/80 text-white',
    activeQualPill: 'bg-space/75 text-white',
    descBar: 'bg-space/80',
  },
  story: {
    label: 'text-story',
    bg: 'bg-story/5',
    border: 'border-story',
    dot: 'bg-story',
    barBg: (s) => ['bg-story/5', 'bg-story/8', 'bg-story/12', 'bg-story/18', 'bg-story/25'][Math.max(0, Math.min(4, s - 1))],
    badgeBg: 'bg-story/10 text-story',
    activePill: 'bg-story text-white',
    activeStatePill: 'bg-story/80 text-white',
    activeQualPill: 'bg-story/75 text-white',
    descBar: 'bg-story/80',
  },
  spirit: {
    label: 'text-spirit',
    bg: 'bg-spirit/5',
    border: 'border-spirit',
    dot: 'bg-spirit',
    barBg: (s) => ['bg-spirit/5', 'bg-spirit/8', 'bg-spirit/12', 'bg-spirit/18', 'bg-spirit/25'][Math.max(0, Math.min(4, s - 1))],
    badgeBg: 'bg-spirit/10 text-spirit',
    activePill: 'bg-spirit text-white',
    activeStatePill: 'bg-spirit/80 text-white',
    activeQualPill: 'bg-spirit/75 text-white',
    descBar: 'bg-spirit/80',
  },
};

// ── Brand asset maps ─────────────────────────────────────────────────

const PILLAR_LOGO: Record<Pillar, string> = {
  self:   '/assets/LOGOS/SELF - Section Logo.png',
  space:  '/assets/LOGOS/SPACE - Section Logo.png',
  story:  '/assets/LOGOS/STORY - Section Logo.png',
  spirit: '/assets/LOGOS/SPIRIT - Section Logo.png',
};

const STATE_LOGO: Record<string, string> = {
  'tuned-emotions':    '/assets/LOGOS/TUNED EMOTIONS.png',
  'focused-body':      '/assets/LOGOS/FOCUSED BODY.png',
  'open-mind':         '/assets/LOGOS/OPEN MIND.png',
  'intentional-space': '/assets/LOGOS/INTENTIONAL SPACE.png',
  'optimized-tools':   '/assets/LOGOS/OPTIMIZED TOOLS.png',
  'feedback-systems':  '/assets/LOGOS/FEEDBACK SYSTEMS.png',
  'generative-story':  '/assets/LOGOS/GENERATIVE STORY.png',
  'clear-mission':     '/assets/LOGOS/CLEAR MISSION.png',
  'empowered-role':    '/assets/LOGOS/EMPOWERED ROLE.png',
  'grounding-values':  '/assets/LOGOS/GROUNDING VALUES.png',
  'ignited-curiosity': '/assets/LOGOS/IGNITED CURIOSITY.png',
  'visualized-vision': '/assets/LOGOS/VISUALIZED VISION.png',
};

// ── Types ────────────────────────────────────────────────────────────

type MechanicItem = MasteryStats['mechanics'][number];

interface NestedMechanic extends MechanicItem {
  children: MechanicItem[];
}

interface FlowKeyGroup {
  key: string;
  label: string;
  mechanics: NestedMechanic[];
}

interface PillarGroup {
  pillar: Pillar;
  keys: FlowKeyGroup[];
  totalMechanics: number;
  totalTechniques: number;
  totalConcepts: number;
}

// ── Key ordering ─────────────────────────────────────────────────────

const KEY_ORDER: Record<Pillar, string[]> = {
  self:   ['tuned-emotions', 'focused-body', 'open-mind'],
  space:  ['intentional-space', 'optimized-tools', 'feedback-systems'],
  story:  ['generative-story', 'clear-mission', 'empowered-role'],
  spirit: ['grounding-values', 'ignited-curiosity', 'visualized-vision'],
};

const QUALITY_TYPES = ['restore', 'maintain', 'concentrate'] as const;
type QualityType = typeof QUALITY_TYPES[number];

// ── Helpers ──────────────────────────────────────────────────────────

function formatKeyLabel(key: string): string {
  return key.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

function isDue(nextReview: string | null): boolean {
  if (!nextReview) return false;
  return new Date(nextReview) <= new Date();
}

// ── SVG Icons ────────────────────────────────────────────────────────

function RestoreIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

function MaintainIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function ConcentrateIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function QualityTypeIcon({ type, className = '' }: { type: QualityType; className?: string }) {
  if (type === 'restore')     return <RestoreIcon className={className} />;
  if (type === 'maintain')    return <MaintainIcon className={className} />;
  if (type === 'concentrate') return <ConcentrateIcon className={className} />;
  return null;
}

function TechniqueIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
      <path d="M7 1L3 7h3.5L5 11l4-6H5.5L7 1z" fill="currentColor" />
    </svg>
  );
}

function ConceptIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
      <circle cx="6" cy="6" r="1.5" fill="currentColor" />
      <ellipse cx="6" cy="6" rx="5" ry="2.2" stroke="currentColor" strokeWidth="1" fill="none" />
      <ellipse cx="6" cy="6" rx="5" ry="2.2" stroke="currentColor" strokeWidth="1" fill="none" transform="rotate(60 6 6)" />
      <ellipse cx="6" cy="6" rx="5" ry="2.2" stroke="currentColor" strokeWidth="1" fill="none" transform="rotate(120 6 6)" />
    </svg>
  );
}

function ExpandIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`flex-shrink-0 ${className}`}>
      <path d="M1 9L9 1M9 1H5M9 1V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Component ────────────────────────────────────────────────────────

export default function CompendiumNavigator() {
  const [stats, setStats] = useState<MasteryStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Desktop expand state
  const [expandedQualityIds, setExpandedQualityIds] = useState<Set<string>>(new Set());

  // Mobile navigation state
  const [activePillar, setActivePillar] = useState<Pillar>('self');
  const [activeStateIndex, setActiveStateIndex] = useState(0);
  const [activeQualIndex, setActiveQualIndex] = useState(0);
  const [mobileTab, setMobileTab] = useState<'techniques' | 'concepts'>('techniques');
  const [mobileItemIndex, setMobileItemIndex] = useState(0);

  // Modal state (shared desktop + mobile)
  const [modalCardId, setModalCardId] = useState<string | null>(null);
  const [modalStateData, setModalStateData] = useState<StateData | null>(null);
  const closeModal = useCallback(() => {
    setModalCardId(null);
    setModalStateData(null);
  }, []);

  useEffect(() => {
    fetch('/api/train/progress')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setStats(data); })
      .finally(() => setLoading(false));
  }, []);

  // ── Nested hierarchy (shared) ────────────────────────────────────
  const pillarGroups: PillarGroup[] = useMemo(() => {
    if (!stats) return [];
    const allItems = stats.mechanics;
    const pillars: Pillar[] = ['self', 'space', 'story', 'spirit'];

    return pillars.map(pillar => {
      const pillarItems = allItems.filter(m => m.pillar === pillar);
      const mechanics = pillarItems.filter(m => m.card_type === 'mechanic' || m.card_type === 'quality');
      const children = pillarItems.filter(m => m.card_type === 'technique' || m.card_type === 'concept');

      const childMap = new Map<string, MechanicItem[]>();
      for (const c of children) {
        if (c.parent_mechanic_id) {
          const existing = childMap.get(c.parent_mechanic_id) ?? [];
          existing.push(c);
          childMap.set(c.parent_mechanic_id, existing);
        }
      }

      const orphansByKey = new Map<string, MechanicItem[]>();
      for (const c of children) {
        if (!c.parent_mechanic_id) {
          const existing = orphansByKey.get(c.flow_key) ?? [];
          existing.push(c);
          orphansByKey.set(c.flow_key, existing);
        }
      }

      const keyOrder = KEY_ORDER[pillar] ?? [];
      const keys: FlowKeyGroup[] = keyOrder.map(key => {
        const keyMechanics = mechanics
          .filter(m => m.flow_key === key)
          .sort((a, b) => (b.enrichment_score ?? 0) - (a.enrichment_score ?? 0));

        const nested: NestedMechanic[] = keyMechanics.map(m => ({
          ...m,
          children: (childMap.get(m.id) ?? []).sort((a, b) => {
            if (a.card_type !== b.card_type) return a.card_type === 'technique' ? -1 : 1;
            return a.title.localeCompare(b.title);
          }),
        }));

        const orphans = orphansByKey.get(key) ?? [];
        for (const o of orphans) nested.push({ ...o, children: [] });

        return { key, label: formatKeyLabel(key), mechanics: nested };
      });

      return {
        pillar,
        keys,
        totalMechanics: mechanics.length,
        totalTechniques: pillarItems.filter(m => m.card_type === 'technique').length,
        totalConcepts: pillarItems.filter(m => m.card_type === 'concept').length,
      };
    });
  }, [stats]);

  // ── Mobile derived data ──────────────────────────────────────────
  const activePillarGroup = useMemo(
    () => pillarGroups.find(g => g.pillar === activePillar) ?? null,
    [pillarGroups, activePillar]
  );

  const activeStateGroup = useMemo(
    () => activePillarGroup?.keys[activeStateIndex] ?? null,
    [activePillarGroup, activeStateIndex]
  );

  const activeQualMechanic = useMemo(
    () => activeStateGroup?.mechanics[activeQualIndex] ?? null,
    [activeStateGroup, activeQualIndex]
  );

  const mobileItems = useMemo(() => {
    if (!activeQualMechanic) return [];
    return activeQualMechanic.children.filter(c =>
      mobileTab === 'techniques' ? c.card_type === 'technique' : c.card_type === 'concept'
    );
  }, [activeQualMechanic, mobileTab]);

  const clampedMobileItemIndex = Math.min(mobileItemIndex, Math.max(0, mobileItems.length - 1));

  // ── Desktop handlers ─────────────────────────────────────────────
  const toggleQuality = (id: string) => {
    setExpandedQualityIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openStateModal = (pillar: Pillar, key: string, label: string, mechanics: NestedMechanic[]) => {
    setModalStateData({
      key, label, pillar,
      qualities: mechanics.map(m => ({
        id: m.id, title: m.title, definition: m.definition,
        mastery_level: m.mastery_level, enrichment_score: m.enrichment_score,
      })),
    });
    setModalCardId(null);
  };

  // ── Mobile handlers ──────────────────────────────────────────────
  const selectPillar = (p: Pillar) => {
    setActivePillar(p);
    setActiveStateIndex(0);
    setActiveQualIndex(0);
    setMobileTab('techniques');
    setMobileItemIndex(0);
  };

  const selectState = (i: number) => {
    setActiveStateIndex(i);
    setActiveQualIndex(0);
    setMobileTab('techniques');
    setMobileItemIndex(0);
  };

  const selectQual = (i: number) => {
    setActiveQualIndex(i);
    setMobileTab('techniques');
    setMobileItemIndex(0);
  };

  const switchMobileTab = (tab: 'techniques' | 'concepts') => {
    setMobileTab(tab);
    setMobileItemIndex(0);
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-sm text-neutral-light">
        Loading compendium...
      </div>
    );
  }

  if (!stats) return null;

  const c = PILLAR_COLORS[activePillar];
  const activeQualType: QualityType = QUALITY_TYPES[activeQualIndex] ?? 'restore';
  const currentItem = mobileItems[clampedMobileItemIndex] ?? null;
  const techniqueCount = activeQualMechanic?.children.filter(ch => ch.card_type === 'technique').length ?? 0;
  const conceptCount = activeQualMechanic?.children.filter(ch => ch.card_type === 'concept').length ?? 0;

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          MOBILE UI  (hidden at lg+)
      ══════════════════════════════════════════════════════════ */}
      <div className="lg:hidden -mx-4">

        {/* ── Filter rows ── */}
        <div className="px-4 space-y-2 pb-2">

          {/* Row 1: Dimension pills */}
          <div className="flex gap-1.5">
            {(['self', 'space', 'story', 'spirit'] as Pillar[]).map(p => (
              <button
                key={p}
                onClick={() => selectPillar(p)}
                className={`
                  flex-1 h-10 rounded-full text-[10px] font-black tracking-[0.13em] uppercase
                  transition-all duration-200
                  ${p === activePillar
                    ? `${PILLAR_COLORS[p].activePill} shadow-lg`
                    : 'bg-neutral-dark/60 text-white/25 hover:text-white/40'
                  }
                `}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Row 2: State pills */}
          <div className="flex gap-1.5">
            {(activePillarGroup?.keys ?? []).map((stateGroup, i) => (
              <button
                key={stateGroup.key}
                onClick={() => selectState(i)}
                className={`
                  flex-1 rounded-[14px] py-2 px-1.5 flex flex-col items-center gap-1.5
                  transition-all duration-200
                  ${i === activeStateIndex
                    ? `${c.activeStatePill} shadow-md`
                    : 'bg-neutral-dark/60 text-white/25 hover:text-white/35'
                  }
                `}
              >
                {STATE_LOGO[stateGroup.key] && (
                  <Image
                    src={STATE_LOGO[stateGroup.key]}
                    alt={stateGroup.label}
                    width={26}
                    height={26}
                    className={`object-contain mix-blend-screen transition-opacity duration-200 ${i === activeStateIndex ? 'opacity-95' : 'opacity-30'}`}
                  />
                )}
                <span className="text-[9px] font-700 leading-tight text-center max-w-full truncate">
                  {stateGroup.label}
                </span>
              </button>
            ))}
          </div>

          {/* Row 3: Quality pills */}
          <div className="flex gap-1.5">
            {(activeStateGroup?.mechanics ?? []).map((mechanic, i) => {
              const qualType = QUALITY_TYPES[i] ?? 'restore';
              const isActive = i === activeQualIndex;
              return (
                <button
                  key={mechanic.id}
                  onClick={() => selectQual(i)}
                  className={`
                    flex-1 rounded-[14px] py-2 px-1.5 flex flex-col items-center gap-1
                    transition-all duration-200
                    ${isActive
                      ? `${c.activeQualPill} shadow-md`
                      : 'bg-neutral-dark/60 text-white/25 hover:text-white/35'
                    }
                  `}
                >
                  <QualityTypeIcon
                    type={qualType}
                    className={`w-4 h-4 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-40'}`}
                  />
                  <span className="text-[9px] font-black tracking-[0.10em] uppercase">
                    {mechanic.title}
                  </span>
                  <span className={`text-[7px] font-semibold tracking-widest uppercase ${isActive ? 'opacity-60' : 'opacity-35'}`}>
                    {qualType}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Row 4: Quality description bar */}
          {activeQualMechanic?.definition && (
            <div className={`rounded-[14px] px-4 py-2.5 ${c.descBar} flex items-start gap-3`}>
              <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-px">
                <QualityTypeIcon type={activeQualType} className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black tracking-[0.14em] uppercase text-white/60 mb-0.5">
                  {activeQualMechanic.title} · {activeQualType}
                </p>
                <p className="text-[12px] font-semibold leading-snug text-white/90">
                  {activeQualMechanic.definition}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Content card ── */}
        <div className="bg-[#F6F3EF] rounded-t-[28px] flex flex-col min-h-[48vh]">

          {/* Tab toggle + counter */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0">
            <div className="flex bg-black/[0.08] rounded-xl p-[3px] gap-[2px]">
              <button
                onClick={() => switchMobileTab('techniques')}
                className={`
                  h-8 px-4 rounded-[10px] text-[10px] font-black tracking-[0.12em] uppercase
                  transition-all duration-180
                  ${mobileTab === 'techniques'
                    ? 'bg-neutral-dark text-white shadow-md'
                    : 'text-neutral/35 hover:text-neutral/60'
                  }
                `}
              >
                Techniques
              </button>
              <button
                onClick={() => switchMobileTab('concepts')}
                className={`
                  h-8 px-4 rounded-[10px] text-[10px] font-black tracking-[0.12em] uppercase
                  transition-all duration-180
                  ${mobileTab === 'concepts'
                    ? 'bg-neutral-dark text-white shadow-md'
                    : 'text-neutral/35 hover:text-neutral/60'
                  }
                `}
              >
                Concepts
              </button>
            </div>
            {mobileItems.length > 0 && (
              <span className="text-[10px] font-semibold text-neutral/30 bg-black/[0.06] px-3 py-1 rounded-full">
                {clampedMobileItemIndex + 1} / {mobileItems.length}
              </span>
            )}
          </div>

          {/* Item display */}
          <div className="flex-1 relative flex flex-col min-h-0">
            {mobileItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center px-8 text-center">
                <p className="text-sm text-neutral/40">
                  No {mobileTab} for this quality yet.
                </p>
              </div>
            ) : (
              <>
                {/* Item content */}
                <div className="flex-1 overflow-y-auto px-14 pb-4">
                  {currentItem && (
                    <div>
                      <p className={`text-[9px] font-black tracking-[0.18em] uppercase mb-1.5 flex items-center gap-1.5 ${c.label}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.dot} inline-block`} />
                        {currentItem.card_type.toUpperCase()}
                      </p>
                      <h3
                        className={`text-[19px] font-black leading-tight tracking-tight mb-2.5 ${c.label}`}
                        style={{ letterSpacing: '-0.02em' }}
                      >
                        {currentItem.title}
                      </h3>
                      {currentItem.definition && (
                        <p className="text-[13px] leading-relaxed text-neutral/75">
                          {currentItem.definition}
                        </p>
                      )}
                      {currentItem.has_content && (
                        <button
                          onClick={() => { setModalCardId(currentItem.id); setModalStateData(null); }}
                          className={`mt-4 text-[10px] font-black tracking-[0.14em] uppercase ${c.label} flex items-center gap-1.5 hover:opacity-70 transition-opacity`}
                        >
                          Read full entry <ExpandIcon />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Arrow navigation */}
                <button
                  onClick={() => setMobileItemIndex(i => Math.max(0, i - 1))}
                  disabled={clampedMobileItemIndex === 0}
                  aria-label="Previous"
                  className={`
                    absolute left-2 top-1/2 -translate-y-1/2
                    w-9 h-9 flex items-center justify-center
                    text-3xl font-light leading-none transition-opacity
                    ${c.label}
                    ${clampedMobileItemIndex === 0 ? 'opacity-15 pointer-events-none' : 'opacity-80 hover:opacity-100'}
                  `}
                >
                  ‹
                </button>
                <button
                  onClick={() => setMobileItemIndex(i => Math.min(mobileItems.length - 1, i + 1))}
                  disabled={clampedMobileItemIndex >= mobileItems.length - 1}
                  aria-label="Next"
                  className={`
                    absolute right-2 top-1/2 -translate-y-1/2
                    w-9 h-9 flex items-center justify-center
                    text-3xl font-light leading-none transition-opacity
                    ${c.label}
                    ${clampedMobileItemIndex >= mobileItems.length - 1 ? 'opacity-15 pointer-events-none' : 'opacity-80 hover:opacity-100'}
                  `}
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Dot indicators + bottom nav */}
          <div className="flex items-center justify-center gap-1.5 px-4 py-4 flex-shrink-0 border-t border-black/[0.06]">
            {mobileItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setMobileItemIndex(i)}
                className={`
                  h-[5px] rounded-full transition-all duration-200
                  ${i === clampedMobileItemIndex
                    ? `w-4 ${c.dot}`
                    : 'w-[5px] bg-black/[0.12]'
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          DESKTOP UI  (hidden below lg)
      ══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block w-full">
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mb-8 text-xs text-neutral-light">
          <div className="flex items-center gap-2">
            <span className="text-white/40"><TechniqueIcon /></span>
            <span>Technique</span>
          </div>
          <div className="w-px h-3 bg-neutral/20" />
          <div className="flex items-center gap-2">
            <span className="text-white/40"><ConceptIcon /></span>
            <span>Concept</span>
          </div>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {pillarGroups.map(({ pillar, keys }) => {
            const pc = PILLAR_COLORS[pillar];

            return (
              <div key={pillar} className="min-w-0">
                {/* Pillar header */}
                <div className={`mb-5 pb-3 border-b-2 ${pc.border}`}>
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={PILLAR_LOGO[pillar]}
                      alt={pillar}
                      width={32}
                      height={32}
                      className="rounded-sm opacity-90"
                    />
                    <span className={`font-sans text-xl font-black uppercase tracking-wider ${pc.label}`}>
                      {pillar}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {keys.map(({ key, label, mechanics }, keyIndex) => (
                    <div
                      key={key}
                      className={keyIndex < keys.length - 1 ? 'border-b border-neutral/[0.07] pb-6' : ''}
                    >
                      {/* State label */}
                      <button
                        onClick={() => openStateModal(pillar, key, label, mechanics)}
                        className="flex items-center gap-2 mb-3 ml-1 group w-full text-left"
                      >
                        {STATE_LOGO[key] && (
                          <Image
                            src={STATE_LOGO[key]}
                            alt={label}
                            width={22}
                            height={22}
                            className="rounded-sm opacity-85 flex-shrink-0"
                          />
                        )}
                        <span className={`text-sm font-semibold uppercase tracking-wider ${pc.label} group-hover:opacity-80 transition-opacity`}>
                          {label}
                        </span>
                        <span className="ml-auto opacity-25 group-hover:opacity-70 transition-opacity text-neutral-light">
                          <ExpandIcon />
                        </span>
                      </button>

                      {/* Quality bars */}
                      <div className="space-y-2">
                        {mechanics.map((mechanic, qualIdx) => {
                          const isExpanded = expandedQualityIds.has(mechanic.id);
                          const qualType = QUALITY_TYPES[qualIdx] ?? 'restore';
                          return (
                            <div key={mechanic.id}>
                              <QualityBar
                                item={mechanic}
                                pillar={pillar}
                                qualType={qualType}
                                isExpanded={isExpanded}
                                onToggle={() => toggleQuality(mechanic.id)}
                                onOpenDetail={() => { setModalCardId(mechanic.id); setModalStateData(null); }}
                              />
                              {isExpanded && mechanic.children.map(child => (
                                <div key={child.id} className="ml-4 mt-1.5">
                                  <ChildBar
                                    item={child}
                                    pillar={pillar}
                                    onOpenDetail={() => { setModalCardId(child.id); setModalStateData(null); }}
                                  />
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail modal (shared) */}
      <CardDetailModal
        cardId={modalCardId}
        stateData={modalStateData}
        onClose={closeModal}
      />
    </>
  );
}

// ── Quality Bar (desktop) ─────────────────────────────────────────────

function QualityBar({
  item, pillar, qualType, isExpanded, onToggle, onOpenDetail,
}: {
  item: NestedMechanic;
  pillar: Pillar;
  qualType: QualityType;
  isExpanded: boolean;
  onToggle: () => void;
  onOpenDetail: () => void;
}) {
  const c = PILLAR_COLORS[pillar];
  const bgClass = c.barBg(item.enrichment_score ?? 1);
  const due = isDue(item.next_review_at);
  const hasChildren = item.children.length > 0;

  return (
    <div className="group/quality">
      <button
        onClick={onToggle}
        className={`
          w-full rounded-lg flex flex-col gap-1.5 px-3 py-3
          border-l-[3px] ${c.border}
          ${bgClass}
          transition-all duration-150
          hover:-translate-y-px hover:brightness-105
          ${isExpanded ? 'ring-1 ring-neutral/10' : ''}
          text-left
        `}
      >
        <div className="flex items-center gap-2 w-full">
          {due && <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse flex-shrink-0`} />}
          <span className="text-sm font-medium text-white flex-1 leading-snug">{item.title}</span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <QualityTypeIcon type={qualType} className="w-3 h-3 opacity-40" />
            <button
              onClick={(e) => { e.stopPropagation(); onOpenDetail(); }}
              className="opacity-25 group-hover/quality:opacity-70 transition-opacity text-neutral-light hover:text-white p-0.5"
              title="View full entry"
            >
              <ExpandIcon />
            </button>
          </div>
        </div>
        <div className="flex items-start gap-2 w-full">
          {item.definition ? (
            <span className="text-xs text-neutral-light flex-1 leading-snug">{item.definition}</span>
          ) : (
            <span className="flex-1" />
          )}
          {hasChildren && (
            <span className="text-[9px] text-neutral-light flex-shrink-0 self-end">
              {isExpanded ? '▾' : '▸'}
            </span>
          )}
        </div>
      </button>
    </div>
  );
}

// ── Child Bar — Technique / Concept (desktop) ─────────────────────────

function ChildBar({
  item, pillar, onOpenDetail,
}: {
  item: MechanicItem;
  pillar: Pillar;
  onOpenDetail: () => void;
}) {
  const c = PILLAR_COLORS[pillar];
  const isTechnique = item.card_type === 'technique';
  const borderStyle = isTechnique ? 'border-solid' : 'border-dashed';
  const due = isDue(item.next_review_at);
  const hasContent = item.has_content;

  if (!hasContent) {
    return (
      <div className="w-full h-8 rounded-md flex items-center gap-2 px-2.5 border-l-2 border-dashed border-neutral/20 bg-neutral/[0.02]">
        <span className="flex-shrink-0 text-neutral/25">
          {isTechnique ? <TechniqueIcon /> : <ConceptIcon />}
        </span>
        <span className="text-xs text-neutral/25 truncate flex-1 text-left">{item.title}</span>
      </div>
    );
  }

  return (
    <button
      onClick={onOpenDetail}
      className={`
        w-full h-8 rounded-md flex items-center gap-2 px-2.5
        border-l-2 ${borderStyle} ${c.border}
        bg-neutral/[0.02]
        transition-all duration-150
        hover:-translate-y-px hover:bg-neutral/5
        group/child
      `}
    >
      {due && <span className={`w-1 h-1 rounded-full ${c.dot} animate-pulse flex-shrink-0`} />}
      <span className={`flex-shrink-0 ${c.label} ${isTechnique ? '' : 'opacity-60'}`}>
        {isTechnique ? <TechniqueIcon /> : <ConceptIcon />}
      </span>
      <span className="text-xs text-neutral-light truncate flex-1 text-left">{item.title}</span>
      <span className="opacity-20 group-hover/child:opacity-60 transition-opacity text-neutral-light flex-shrink-0">
        <ExpandIcon />
      </span>
    </button>
  );
}
