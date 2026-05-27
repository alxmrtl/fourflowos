'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import type { MasteryStats, Pillar } from '@/types/training';
import { KEYS } from '@/data/framework';
import type { KeyType } from '@/types/framework';
import CardDetailModal, { type StateData } from './CardDetailModal';
import { renderMarkdown as sharedRenderMarkdown } from '@/lib/renderMarkdown';

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

const PILLAR_RGB: Record<Pillar, string> = {
  self:   '255,111,97',
  space:  '107,162,146',
  story:  '91,132,177',
  spirit: '122,77,164',
};

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

type CompendiumItem = MasteryStats['qualities'][number];

interface NestedQuality extends CompendiumItem {
  children: CompendiumItem[];
}

interface FlowKeyGroup {
  key: string;
  label: string;
  qualities: NestedQuality[];
}

interface PillarGroup {
  pillar: Pillar;
  keys: FlowKeyGroup[];
  totalQualities: number;
  totalTechniques: number;
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

// ── Recall section parser ─────────────────────────────────────────

function parseRecallSections(source: string | null | undefined): { hook: string; mechanism: string } {
  if (!source) return { hook: '', mechanism: '' };
  // If source contains a full ## Recall section, extract just that block first
  const recallBlock = source.match(/##\s+Recall\s*\n([\s\S]*?)(?:\n##|$)/);
  const text = recallBlock ? recallBlock[1] : source;
  const hook = text.match(/\*\*Hook:?\*\*:?\s*([^\n]+)/)?.[1]?.trim() ?? '';
  const mechanism = text.match(/\*\*Mechanism:?\*\*:?\s*([^\n]+)/)?.[1]?.trim() ?? '';
  return { hook, mechanism };
}

// ── Inline card content renderer ────────────────────────────────────

function renderContentMd(md: string, dark = true, headingClass?: string): string {
  return sharedRenderMarkdown(md, { dark, skipRecall: true, skipFirstQuote: true, headingClass });
}

function InlineCardContent({ cardId, dark = true, headingClass }: { cardId: string; dark?: boolean; headingClass?: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setContent(null);
    fetch(`/api/train/card/${encodeURIComponent(cardId)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.content_md) setContent(d.content_md); })
      .finally(() => setLoading(false));
  }, [cardId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4">
        <div className={`w-3.5 h-3.5 rounded-full border-2 ${dark ? 'border-white/15 border-t-white/50' : 'border-black/10 border-t-black/35'} animate-spin`} />
        <span className={`text-[11px] ${dark ? 'text-white/30' : 'text-neutral/35'}`}>Loading…</span>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div
      className="space-y-0.5 mt-1"
      dangerouslySetInnerHTML={{ __html: renderContentMd(content, dark, headingClass) }}
    />
  );
}

// ── Component ────────────────────────────────────────────────────────

export default function CompendiumNavigator() {
  const [stats, setStats] = useState<MasteryStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Desktop navigation state
  const [activeStateKey, setActiveStateKey] = useState<string>('tuned-emotions');
  const [desktopQualIdx, setDesktopQualIdx] = useState(0);
  const [desktopItemIdx, setDesktopItemIdx] = useState(0);
  const [qualRecall, setQualRecall] = useState<{ hook: string; mechanism: string } | null>(null);
  const [qualRecallLoading, setQualRecallLoading] = useState(false);

  // Mobile navigation state
  const [activePillar, setActivePillar] = useState<Pillar>('self');
  const [activeStateIndex, setActiveStateIndex] = useState(0);
  const [activeQualIndex, setActiveQualIndex] = useState(0);
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
    const allItems = stats.qualities;
    const pillars: Pillar[] = ['self', 'space', 'story', 'spirit'];

    return pillars.map(pillar => {
      const pillarItems = allItems.filter(m => m.pillar === pillar);
      const qualityCards = pillarItems.filter(m => m.card_type === 'quality');
      const children = pillarItems.filter(m => m.card_type === 'technique');

      const childMap = new Map<string, CompendiumItem[]>();
      for (const c of children) {
        if (c.parent_quality_id) {
          const existing = childMap.get(c.parent_quality_id) ?? [];
          existing.push(c);
          childMap.set(c.parent_quality_id, existing);
        }
      }

      const orphansByKey = new Map<string, CompendiumItem[]>();
      for (const c of children) {
        if (!c.parent_quality_id) {
          const existing = orphansByKey.get(c.flow_key) ?? [];
          existing.push(c);
          orphansByKey.set(c.flow_key, existing);
        }
      }

      const keyOrder = KEY_ORDER[pillar] ?? [];
      const keys: FlowKeyGroup[] = keyOrder.map(key => {
        const QUAL_ORDER: Record<string, number> = { restore: 0, maintain: 1, concentrate: 2 };
        const keyQualities = qualityCards
          .filter(m => m.flow_key === key)
          .sort((a, b) => (QUAL_ORDER[a.quality_type ?? ''] ?? 99) - (QUAL_ORDER[b.quality_type ?? ''] ?? 99));

        const nested: NestedQuality[] = keyQualities.map(m => ({
          ...m,
          children: (childMap.get(m.id) ?? []).sort((a, b) => a.title.localeCompare(b.title)),
        }));

        const orphans = orphansByKey.get(key) ?? [];
        for (const o of orphans) nested.push({ ...o, children: [] });

        return { key, label: formatKeyLabel(key), qualities: nested };
      });

      return {
        pillar,
        keys,
        totalQualities: qualityCards.length,
        totalTechniques: pillarItems.filter(m => m.card_type === 'technique').length,
      };
    });
  }, [stats]);

  // ── Flat state list (for desktop key cycling) ────────────────────
  const allStates = useMemo(() =>
    pillarGroups.flatMap(pg => pg.keys.map(k => ({ pillar: pg.pillar, ...k }))),
  [pillarGroups]);

  // ── Mobile derived data ──────────────────────────────────────────
  const activePillarGroup = useMemo(
    () => pillarGroups.find(g => g.pillar === activePillar) ?? null,
    [pillarGroups, activePillar]
  );

  const activeStateGroup = useMemo(
    () => activePillarGroup?.keys[activeStateIndex] ?? null,
    [activePillarGroup, activeStateIndex]
  );

  const activeQualCard = useMemo(
    () => activeStateGroup?.qualities[activeQualIndex] ?? null,
    [activeStateGroup, activeQualIndex]
  );

  const mobileItems = useMemo(() => {
    if (!activeQualCard) return [];
    return activeQualCard.children.filter(c => c.card_type === 'technique');
  }, [activeQualCard]);

  const clampedMobileItemIndex = Math.min(mobileItemIndex, Math.max(0, mobileItems.length - 1));

  // ── Desktop derived data ─────────────────────────────────────────
  const desktopStateGroup = useMemo(
    () => allStates.find(s => s.key === activeStateKey) ?? allStates[0] ?? null,
    [allStates, activeStateKey]
  );
  const desktopPillar: Pillar = desktopStateGroup?.pillar ?? 'self';
  const dc = PILLAR_COLORS[desktopPillar];
  const desktopDqm = desktopStateGroup?.qualities[desktopQualIdx] ?? null;
  const desktopItems = useMemo(() => {
    const qm = desktopStateGroup?.qualities[desktopQualIdx];
    if (!qm) return [];
    return qm.children.filter(c => c.card_type === 'technique');
  }, [desktopStateGroup, desktopQualIdx]);
  const clampedDesktopItemIdx = Math.min(desktopItemIdx, Math.max(0, desktopItems.length - 1));
  const desktopCurrentItem = desktopItems[clampedDesktopItemIdx] ?? null;
  const activeKeyData = KEYS[activeStateKey as KeyType] ?? null;

  // ── Desktop handlers ─────────────────────────────────────────────
  const selectDesktopState = useCallback((key: string) => {
    setActiveStateKey(key);
    setDesktopQualIdx(0);
    setDesktopItemIdx(0);
  }, []);

  // Sync activeStateKey to first loaded state if current key isn't found
  useEffect(() => {
    if (allStates.length > 0 && !allStates.find(s => s.key === activeStateKey)) {
      setActiveStateKey(allStates[0].key);
    }
  }, [allStates, activeStateKey]);

  // Fetch recall sections when quality card changes
  useEffect(() => {
    if (!desktopDqm?.id) return;
    setQualRecall(null);
    setQualRecallLoading(true);
    fetch(`/api/train/card/${encodeURIComponent(desktopDqm.id)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setQualRecall(parseRecallSections(d.recall_md || d.content_md)); })
      .finally(() => setQualRecallLoading(false));
  }, [desktopDqm?.id]);

  // ── Mobile handlers ──────────────────────────────────────────────
  const selectPillar = (p: Pillar) => {
    setActivePillar(p);
    setActiveStateIndex(0);
    setActiveQualIndex(0);
    setMobileItemIndex(0);
  };

  const selectState = (i: number) => {
    setActiveStateIndex(i);
    setActiveQualIndex(0);
    setMobileItemIndex(0);
  };

  const selectQual = (i: number) => {
    setActiveQualIndex(i);
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
  const activeQualType: QualityType = (activeQualCard?.quality_type as QualityType) ?? QUALITY_TYPES[activeQualIndex] ?? 'restore';
  const currentItem = mobileItems[clampedMobileItemIndex] ?? null;
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
                  relative overflow-hidden flex-1 h-10 rounded-full text-[10px] font-black tracking-[0.13em] uppercase
                  transition-all duration-200
                  ${p === activePillar
                    ? `${PILLAR_COLORS[p].activePill} shadow-lg`
                    : 'bg-neutral-dark/60 text-white/25 hover:text-white/40'
                  }
                `}
              >
                {p === activePillar && (
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.10] to-transparent pointer-events-none rounded-full" />
                )}
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
                  relative overflow-hidden flex-1 rounded-[14px] py-2 px-1.5 flex flex-col items-center gap-1.5
                  transition-all duration-200
                  ${i === activeStateIndex
                    ? `${c.activeStatePill} shadow-md`
                    : 'bg-neutral-dark/60 text-white/25 hover:text-white/35'
                  }
                `}
              >
                {i === activeStateIndex && (
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.10] to-transparent pointer-events-none rounded-[14px]" />
                )}
                {STATE_LOGO[stateGroup.key] && (
                  <Image
                    src={STATE_LOGO[stateGroup.key]}
                    alt={stateGroup.label}
                    width={26}
                    height={26}
                    className={`object-contain mix-blend-screen transition-opacity duration-200 ${i === activeStateIndex ? 'opacity-95' : 'opacity-30'}`}
                    style={i === activeStateIndex ? { filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.45))' } : undefined}
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
            {(activeStateGroup?.qualities ?? []).map((quality, i) => {
              const qualType = (quality.quality_type as QualityType) ?? QUALITY_TYPES[i] ?? 'restore';
              const isActive = i === activeQualIndex;
              return (
                <button
                  key={quality.id}
                  onClick={() => selectQual(i)}
                  className={`
                    relative overflow-hidden flex-1 rounded-[14px] py-1.5 px-1.5 flex flex-col items-center gap-1
                    transition-all duration-200
                    ${isActive
                      ? `${c.activeQualPill} shadow-md`
                      : 'bg-neutral-dark/60 text-white/25 hover:text-white/35'
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.10] to-transparent pointer-events-none rounded-[14px]" />
                  )}
                  <div style={isActive ? { filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.45))' } : undefined}>
                    <QualityTypeIcon
                      type={qualType}
                      className={`w-4 h-4 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-40'}`}
                    />
                  </div>
                  <span className="text-[9px] font-black tracking-[0.10em] uppercase">
                    {quality.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Row 4: Quality description bar */}
          {activeQualCard?.definition && (
            <div className={`rounded-[14px] px-4 py-2.5 ${c.descBar} flex items-start gap-3`}>
              <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-px">
                <QualityTypeIcon type={activeQualType} className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black tracking-[0.14em] uppercase text-white/60 mb-0.5">
                  {activeQualCard.title} · {activeQualType}
                </p>
                <p className="text-[12px] font-semibold leading-snug text-white/90">
                  {activeQualCard.definition}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Content card ── */}
        <div className="bg-[#111111] rounded-t-[28px] flex flex-col min-h-[48vh]">

          {/* Label + counter */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0">
            <p className="text-[10px] font-black tracking-[0.12em] uppercase text-white/35">Techniques</p>
            {mobileItems.length > 0 && (
              <span className="text-[10px] font-semibold text-white/30 bg-white/[0.06] px-3 py-1 rounded-full">
                {clampedMobileItemIndex + 1} / {mobileItems.length}
              </span>
            )}
          </div>

          {/* Item display */}
          <div className="flex-1 relative flex flex-col min-h-0">
            {mobileItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center px-8 text-center">
                <p className="text-sm text-white/35">
                  No techniques for this quality yet.
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
                        <p className="text-[13px] leading-relaxed text-white/65">
                          {currentItem.definition}
                        </p>
                      )}
                      <div className="mt-4">
                        <InlineCardContent cardId={currentItem.id} dark={true} headingClass={c.label} />
                      </div>
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
          <div className="flex items-center justify-center gap-1.5 px-4 py-4 flex-shrink-0 border-t border-white/[0.06]">
            {mobileItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setMobileItemIndex(i)}
                className={`
                  h-[5px] rounded-full transition-all duration-200
                  ${i === clampedMobileItemIndex
                    ? `w-4 ${c.dot}`
                    : 'w-[5px] bg-white/[0.12]'
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
      <div className="hidden lg:flex lg:flex-col w-full rounded-xl overflow-hidden" style={{ height: 'calc(100vh - 285px)', minHeight: 520 }}>

        {/* ─── TOP NAVIGATION BAR ───────────────────────────────── */}
        <div
          className="flex items-stretch flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* SOUL tab (disabled) */}
          <div
            title="Soul view — coming soon"
            className="flex flex-col items-center justify-center gap-1 px-3 flex-shrink-0 cursor-not-allowed opacity-20 border-r border-white/[0.06]"
          >
            <div className="w-3.5 h-3.5 rounded-full border border-white/50 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white/70" />
            </div>
            <span className="text-[7px] font-black tracking-[0.18em] uppercase">SOUL</span>
          </div>

          {/* Pillar groups */}
          {(['self', 'space', 'story', 'spirit'] as Pillar[]).map((pillar) => {
            const pc = PILLAR_COLORS[pillar];
            const rgb = PILLAR_RGB[pillar];
            const pillarKeys = pillarGroups.find(g => g.pillar === pillar)?.keys ?? [];
            return (
              <div key={pillar} className="flex flex-col flex-1 border-r border-white/[0.05] last:border-r-0">
                {/* Pillar label row */}
                <div className="px-2.5 pt-1.5 pb-1" style={{ borderBottom: `1px solid rgba(${rgb},0.10)` }}>
                  <span className={`text-[6.5px] font-black tracking-[0.22em] uppercase ${pc.label} opacity-65`}>{pillar.toUpperCase()}</span>
                </div>
                {/* State pills */}
                <div className="flex gap-1 flex-1 p-1.5">
                  {pillarKeys.map(({ key, label }) => {
                    const isActive = key === activeStateKey;
                    return (
                      <button
                        key={key}
                        onClick={() => selectDesktopState(key)}
                        title={label}
                        className={`
                          flex-1 flex flex-col items-center gap-1 py-1.5 px-1 rounded-md
                          font-black text-[7px] tracking-[0.05em] uppercase cursor-pointer border-none
                          transition-all duration-150 overflow-hidden
                          ${isActive ? 'text-white' : 'text-white/[0.22] hover:bg-white/[0.07] hover:text-white/[0.72]'}
                        `}
                        style={{
                          borderBottom: `2px solid ${isActive ? `rgb(${rgb})` : 'transparent'}`,
                          background: isActive ? `rgba(${rgb},0.20)` : 'rgba(255,255,255,0.03)',
                          boxShadow: isActive ? `0 0 16px rgba(${rgb},0.18)` : undefined,
                        }}
                      >
                        {STATE_LOGO[key] && (
                          <Image
                            src={STATE_LOGO[key]}
                            alt={label}
                            width={16} height={16}
                            className={`mix-blend-screen flex-shrink-0 transition-opacity duration-150 ${isActive ? 'opacity-90' : 'opacity-25'}`}
                            style={isActive ? { filter: `drop-shadow(0 0 4px rgba(${rgb},0.6))` } : undefined}
                          />
                        )}
                        <span className="truncate w-full text-center leading-tight">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── STATE HEADER + INSIGHT COLUMNS ──────────────────── */}
        {desktopStateGroup && (
          <div
            className="flex-shrink-0"
            style={{
              background: `rgba(${PILLAR_RGB[desktopPillar]},0.08)`,
              borderBottom: `1px solid rgba(${PILLAR_RGB[desktopPillar]},0.16)`,
            }}
          >
            {/* Identity row */}
            <div className="flex items-center gap-4 px-5 pt-4 pb-3">
              {STATE_LOGO[desktopStateGroup.key] && (
                <div
                  className="w-[46px] h-[46px] rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `radial-gradient(circle at 40% 35%, rgba(${PILLAR_RGB[desktopPillar]},0.50), rgba(${PILLAR_RGB[desktopPillar]},0.18))`,
                    border: `1px solid rgba(${PILLAR_RGB[desktopPillar]},0.35)`,
                    boxShadow: `0 0 20px rgba(${PILLAR_RGB[desktopPillar]},0.22)`,
                  }}
                >
                  <Image
                    src={STATE_LOGO[desktopStateGroup.key]}
                    alt={desktopStateGroup.label}
                    width={26} height={26}
                    className="mix-blend-screen opacity-90"
                    style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.5))' }}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2.5 mb-1">
                  <h2 className="text-[20px] font-black text-white leading-none" style={{ letterSpacing: '-0.025em' }}>
                    {desktopStateGroup.label}
                  </h2>
                  <span className={`text-[8px] font-black tracking-[0.18em] uppercase ${dc.label} opacity-75 flex-shrink-0`}>
                    {desktopPillar.toUpperCase()}
                  </span>
                </div>
                {activeKeyData?.description && (
                  <p className="text-[11px] text-white/35 font-medium">{activeKeyData.description}</p>
                )}
              </div>
            </div>

            {/* Three insight columns */}
            <div className="grid grid-cols-3" style={{ borderTop: `1px solid rgba(${PILLAR_RGB[desktopPillar]},0.10)` }}>
              {([
                { label: 'Core Insight',    text: activeKeyData?.coreInsight ?? '' },
                { label: 'Flow Connection', text: activeKeyData?.flowConnection ?? '' },
                { label: 'Without This',    text: activeKeyData?.withoutThis ?? '' },
              ] as const).map(({ label, text }, i) => (
                <div
                  key={label}
                  className="px-5 py-3.5"
                  style={i > 0 ? { borderLeft: `1px solid rgba(${PILLAR_RGB[desktopPillar]},0.10)` } : undefined}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: `rgba(${PILLAR_RGB[desktopPillar]},0.70)` }} />
                    <span className={`text-[7px] font-black tracking-[0.20em] uppercase ${dc.label} opacity-70`}>{label}</span>
                  </div>
                  <p className="text-[12px] font-medium leading-[1.58] text-white/[0.78]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── QUALITIES SECTION ───────────────────────────────── */}
        <div
          className="flex-shrink-0 px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Quality tabs row */}
          <div className="flex items-center gap-3 mb-2.5">
            <span className="text-[7px] font-black tracking-[0.22em] uppercase text-white/[0.20] flex-shrink-0">QUALITIES</span>
            <div className="flex gap-1.5">
              {(desktopStateGroup?.qualities ?? []).map((qual, qi) => {
                const qt = (qual.quality_type as QualityType) ?? QUALITY_TYPES[qi] ?? 'restore';
                const isQActive = qi === desktopQualIdx;
                return (
                  <button
                    key={qual.id}
                    onClick={() => { setDesktopQualIdx(qi); setDesktopItemIdx(0); }}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-[9px] border
                      font-black text-[10px] tracking-[0.07em] uppercase cursor-pointer
                      transition-all duration-150
                      ${isQActive
                        ? 'text-white'
                        : 'bg-white/[0.04] text-white/[0.28] border-transparent hover:bg-white/[0.06] hover:text-white/[0.65]'
                      }
                    `}
                    style={isQActive ? {
                      background: `rgba(${PILLAR_RGB[desktopPillar]},0.22)`,
                      border: `1px solid rgba(${PILLAR_RGB[desktopPillar]},0.32)`,
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                    } : undefined}
                  >
                    <QualityTypeIcon type={qt} className={`w-3 h-3 flex-shrink-0 ${isQActive ? 'opacity-100' : 'opacity-55'}`} />
                    <span>{qual.title}</span>
                    <span className={`text-[7px] font-semibold ${isQActive ? 'opacity-55' : 'opacity-40'}`}>{qt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quality detail: 3-column bar */}
          <div className="grid grid-cols-3 gap-2">

            {/* Definition */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-[10px] px-3.5 py-3">
              <div className="text-[6.5px] font-black tracking-[0.18em] uppercase text-white/[0.25] mb-1.5">Definition</div>
              <p className="text-[11.5px] font-medium leading-[1.58] text-white/[0.72]">
                {desktopDqm?.definition ?? ''}
              </p>
            </div>

            {/* Why This Matters (Hook from recall_md) */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-[10px] px-3.5 py-3">
              <div className="text-[6.5px] font-black tracking-[0.18em] uppercase text-white/[0.25] mb-1.5">
                Why This Matters
              </div>
              {qualRecallLoading ? (
                <div className="flex items-center gap-1.5 py-1">
                  <div className="w-3 h-3 rounded-full border border-white/10 border-t-white/40 animate-spin" />
                  <span className="text-[10px] text-white/25">Loading…</span>
                </div>
              ) : (
                <p className="text-[11.5px] font-medium leading-[1.58] text-white/[0.72]">
                  {qualRecall?.hook ?? ''}
                </p>
              )}
            </div>

            {/* How It Works (Mechanism from recall_md) */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-[10px] px-3.5 py-3">
              <div className="text-[6.5px] font-black tracking-[0.18em] uppercase text-white/[0.25] mb-1.5">How It Works</div>
              {qualRecallLoading ? (
                <div className="flex items-center gap-1.5 py-1">
                  <div className="w-3 h-3 rounded-full border border-white/10 border-t-white/40 animate-spin" />
                  <span className="text-[10px] text-white/25">Loading…</span>
                </div>
              ) : (
                <p className="text-[11.5px] font-medium leading-[1.58] text-white/[0.68]">
                  {qualRecall?.mechanism ?? ''}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* ─── TECHNIQUES SECTION ──────────────────────────────── */}
        <div className="flex flex-1 min-h-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>

          {/* Left: technique list */}
          <div className="w-[230px] flex-shrink-0 flex flex-col border-r border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.012)' }}>
            <div className="px-3.5 py-2.5 flex-shrink-0 border-b border-white/[0.05]">
              <span className="text-[6.5px] font-black tracking-[0.22em] uppercase text-white/[0.22]">
                TECHNIQUES{desktopItems.length > 0 ? ` · ${desktopItems.length}` : ''}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto py-1.5 px-2">
              {desktopItems.length === 0 ? (
                <p className="text-[11px] text-white/25 text-center py-6">No techniques yet</p>
              ) : desktopItems.map((item, ii) => {
                const isItemActive = ii === clampedDesktopItemIdx;
                return (
                  <button
                    key={item.id}
                    onClick={() => setDesktopItemIdx(ii)}
                    className={`
                      flex items-start gap-2.5 w-full px-3 py-2.5 rounded-lg text-left cursor-pointer border-none mb-1
                      transition-all duration-150 border-l-2
                      ${isItemActive
                        ? 'text-white'
                        : 'text-white/[0.35] hover:bg-white/[0.05] hover:text-white/[0.72] border-transparent'
                      }
                    `}
                    style={isItemActive ? {
                      background: `rgba(${PILLAR_RGB[desktopPillar]},0.16)`,
                      borderLeftColor: `rgb(${PILLAR_RGB[desktopPillar]})`,
                    } : undefined}
                  >
                    <span className={`flex-shrink-0 mt-0.5 ${isItemActive ? dc.label : 'text-white/30'}`}>
                      <TechniqueIcon />
                    </span>
                    <span className="text-[10.5px] font-semibold leading-snug">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: technique detail */}
          <div className="flex-1 min-w-0 overflow-y-auto px-8 py-6 text-white">
            {desktopCurrentItem ? (
              <div style={{ maxWidth: 600 }}>
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 mb-4 text-white/[0.28] text-[9.5px] font-semibold tracking-[0.06em]">
                  <span className={`${dc.label} opacity-75`}>{desktopPillar.toUpperCase()}</span>
                  <span className="opacity-40">›</span>
                  <span>{desktopStateGroup?.label}</span>
                  <span className="opacity-40">›</span>
                  <span>{desktopDqm?.title}</span>
                  <span className="opacity-40">›</span>
                  <span className="text-white/60">{desktopCurrentItem.title}</span>
                </div>

                {/* Type + title */}
                <div className="mb-3.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className={`flex-shrink-0 ${dc.label}`}><TechniqueIcon /></span>
                    <span className={`text-[7.5px] font-black tracking-[0.20em] uppercase ${dc.label} opacity-80`}>Technique</span>
                  </div>
                  <h3 className="text-[26px] font-black text-white leading-none" style={{ letterSpacing: '-0.03em' }}>
                    {desktopCurrentItem.title}
                  </h3>
                </div>

                {/* Definition */}
                {desktopCurrentItem.definition && (
                  <p className="text-[13px] font-medium leading-[1.68] text-white/[0.62] mb-6 pb-6 border-b border-white/[0.06]">
                    {desktopCurrentItem.definition}
                  </p>
                )}

                {/* Content */}
                <InlineCardContent cardId={desktopCurrentItem.id} dark={true} headingClass={dc.label} />
              </div>
            ) : desktopDqm ? (
              <div className="flex items-center justify-center h-full text-center px-8">
                <div>
                  <p className={`text-[9px] font-black tracking-[0.18em] uppercase mb-3 ${dc.label} opacity-40`}>
                    {(QUALITY_TYPES[desktopQualIdx] ?? 'quality').toUpperCase()} QUALITY
                  </p>
                  <p className="text-[14px] font-semibold text-white/20">
                    Select a technique from the list
                  </p>
                </div>
              </div>
            ) : null}
          </div>
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

