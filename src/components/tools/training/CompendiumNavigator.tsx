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

// ── Inline card content renderer ────────────────────────────────────

function renderContentMd(md: string, dark = true): string {
  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const applyInline = (s: string) =>
    s
      .replace(/\*\*(.+?)\*\*/g, `<strong class="font-semibold ${dark ? 'text-white/88' : 'text-neutral/88'}">$1</strong>`)
      .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');

  const textColor   = dark ? 'text-white/65'  : 'text-neutral/65';
  const headColor   = dark ? 'text-white/40'  : 'text-neutral/40';
  const h1Color     = dark ? 'text-white/70'  : 'text-neutral/70';
  const numBg       = dark ? 'bg-white/[0.08] text-white/40'  : 'bg-black/[0.06] text-neutral/40';
  const quoteStyle  = dark ? 'border-white/15 text-white/40'  : 'border-black/15 text-neutral/40';

  const lines = md.split('\n');
  const out: string[] = [];
  let inOl = false;
  let olCounter = 0;

  const closeOl = () => { if (inOl) { out.push('</ol>'); inOl = false; olCounter = 0; } };

  for (const raw of lines) {
    const t = raw.trim();
    if (!t) { closeOl(); continue; }

    if (t.startsWith('### ')) {
      closeOl();
      out.push(`<h4 class="text-[10px] font-black uppercase tracking-[0.16em] mt-5 mb-1.5 ${headColor}">${applyInline(escapeHtml(t.slice(4)))}</h4>`);
    } else if (t.startsWith('## ')) {
      closeOl();
      out.push(`<h3 class="text-xs font-black uppercase tracking-wider mt-4 mb-1.5 ${headColor}">${applyInline(escapeHtml(t.slice(3)))}</h3>`);
    } else if (t.startsWith('# ')) {
      closeOl();
      out.push(`<h2 class="text-sm font-bold mt-5 mb-2 ${h1Color}">${applyInline(escapeHtml(t.slice(2)))}</h2>`);
    } else if (/^\d+\.\s/.test(t)) {
      const text = t.replace(/^\d+\.\s+/, '');
      if (!inOl) { out.push('<ol class="space-y-2 mt-2 mb-2">'); inOl = true; olCounter = 0; }
      olCounter++;
      out.push(`<li class="flex gap-2.5 ${textColor} text-sm leading-relaxed"><span class="flex-shrink-0 w-5 h-5 rounded-full ${numBg} flex items-center justify-center text-[10px] font-bold mt-0.5">${olCounter}</span><span>${applyInline(escapeHtml(text))}</span></li>`);
    } else if (t.startsWith('> ')) {
      closeOl();
      out.push(`<blockquote class="border-l-2 ${quoteStyle} pl-3 my-2 text-sm italic">${applyInline(escapeHtml(t.slice(2)))}</blockquote>`);
    } else if (t.startsWith('- ') || t.startsWith('* ')) {
      closeOl();
      out.push(`<li class="text-sm ${textColor} leading-relaxed ml-3 list-disc">${applyInline(escapeHtml(t.slice(2)))}</li>`);
    } else {
      closeOl();
      out.push(`<p class="text-sm ${textColor} leading-relaxed">${applyInline(escapeHtml(t))}</p>`);
    }
  }
  closeOl();
  return out.join('\n');
}

function InlineCardContent({ cardId, dark = true }: { cardId: string; dark?: boolean }) {
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
      dangerouslySetInnerHTML={{ __html: renderContentMd(content, dark) }}
    />
  );
}

// ── Component ────────────────────────────────────────────────────────

export default function CompendiumNavigator() {
  const [stats, setStats] = useState<MasteryStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Desktop FlowStation navigation state
  const [desktopMode, setDesktopMode] = useState<'grid' | 'state'>('grid');
  const [desktopActiveStateIdx, setDesktopActiveStateIdx] = useState(0);
  const [desktopQualIdx, setDesktopQualIdx] = useState(0);
  const [desktopTab, setDesktopTab] = useState<'techniques' | 'concepts'>('techniques');
  const [desktopItemIdx, setDesktopItemIdx] = useState(0);

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
        const QUAL_ORDER: Record<string, number> = { restore: 0, maintain: 1, concentrate: 2 };
        const keyMechanics = mechanics
          .filter(m => m.flow_key === key)
          .sort((a, b) => (QUAL_ORDER[a.quality_type ?? ''] ?? 99) - (QUAL_ORDER[b.quality_type ?? ''] ?? 99));

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

  // ── Desktop derived data ─────────────────────────────────────────
  const desktopStateGroup = allStates[desktopActiveStateIdx] ?? null;
  const desktopPillar: Pillar = desktopStateGroup?.pillar ?? 'self';
  const desktopDqm = desktopStateGroup?.mechanics[desktopQualIdx] ?? null;
  const desktopItems = useMemo(() => {
    const qm = allStates[desktopActiveStateIdx]?.mechanics[desktopQualIdx];
    if (!qm) return [];
    return qm.children.filter(c =>
      desktopTab === 'techniques' ? c.card_type === 'technique' : c.card_type === 'concept'
    );
  }, [allStates, desktopActiveStateIdx, desktopQualIdx, desktopTab]);
  const clampedDesktopItemIdx = Math.min(desktopItemIdx, Math.max(0, desktopItems.length - 1));
  const desktopCurrentItem = desktopItems[clampedDesktopItemIdx] ?? null;
  const desktopPrevLabel = allStates.length > 0
    ? allStates[(desktopActiveStateIdx - 1 + allStates.length) % allStates.length]?.label ?? ''
    : '';
  const desktopNextLabel = allStates.length > 0
    ? allStates[(desktopActiveStateIdx + 1) % allStates.length]?.label ?? ''
    : '';

  // ── Desktop handlers ─────────────────────────────────────────────
  const desktopEnterState = (stateKey: string) => {
    const idx = allStates.findIndex(s => s.key === stateKey);
    setDesktopActiveStateIdx(idx >= 0 ? idx : 0);
    setDesktopQualIdx(0);
    setDesktopTab('techniques');
    setDesktopItemIdx(0);
    setDesktopMode('state');
  };

  const desktopBackToGrid = () => setDesktopMode('grid');

  const desktopCycleState = (dir: 1 | -1) => {
    if (allStates.length === 0) return;
    const nextIdx = (desktopActiveStateIdx + dir + allStates.length) % allStates.length;
    setDesktopActiveStateIdx(nextIdx);
    setDesktopQualIdx(0);
    setDesktopTab('techniques');
    setDesktopItemIdx(0);
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
  const activeQualType: QualityType = (activeQualMechanic?.quality_type as QualityType) ?? QUALITY_TYPES[activeQualIndex] ?? 'restore';
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
            {(activeStateGroup?.mechanics ?? []).map((mechanic, i) => {
              const qualType = (mechanic.quality_type as QualityType) ?? QUALITY_TYPES[i] ?? 'restore';
              const isActive = i === activeQualIndex;
              return (
                <button
                  key={mechanic.id}
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
                    {mechanic.title}
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
                      <div className="mt-4">
                        <InlineCardContent cardId={currentItem.id} dark={false} />
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
          DESKTOP UI  (hidden below lg) — FlowStation-style navigation
      ══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block w-full relative overflow-hidden rounded-xl" style={{ height: 'calc(100vh - 285px)', minHeight: 420 }}>

        {/* ─── GRID VIEW ────────────────────────────────────────── */}
        <div
          className="absolute inset-0 p-4"
          style={{
            transform: desktopMode === 'grid' ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 300ms cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div className="grid grid-cols-4 gap-4 h-full">
            {pillarGroups.map(({ pillar, keys }) => {
              const pc = PILLAR_COLORS[pillar];
              const rgb = PILLAR_RGB[pillar];
              return (
                <div
                  key={pillar}
                  className="flex flex-col opacity-55 hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                  style={{ padding: '20px 14px 16px' }}
                >
                  {/* Column header */}
                  <div className={`flex items-center gap-2.5 pb-4 mb-3.5 border-b-2 ${pc.border} flex-shrink-0`}>
                    <Image
                      src={PILLAR_LOGO[pillar]}
                      alt={pillar}
                      width={28} height={28}
                      className="mix-blend-screen flex-shrink-0"
                      style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }}
                    />
                    <span className={`text-[11px] xl:text-[13px] font-black tracking-[0.15em] xl:tracking-[0.20em] uppercase ${pc.label}`}>{pillar}</span>
                  </div>
                  {/* State cards */}
                  <div className="flex flex-col gap-2.5 flex-1 min-h-0">
                    {keys.map(({ key, label, mechanics }) => (
                      <button
                        key={key}
                        onClick={() => desktopEnterState(key)}
                        className="flex-1 min-h-0 rounded-[20px] flex flex-col items-center justify-between text-center relative overflow-hidden group/card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl cursor-pointer"
                        style={{ padding: '14px 12px 12px', background: `rgba(${rgb},0.14)` }}
                      >
                        {/* Shimmer overlay on hover */}
                        <div
                          className="absolute top-0 left-0 right-0 pointer-events-none rounded-[20px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-200"
                          style={{ height: '40%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.10), transparent)' }}
                        />
                        {/* State name top */}
                        <p className="text-[11px] xl:text-[13px] font-black tracking-[0.10em] xl:tracking-[0.14em] uppercase leading-tight text-white/95 relative z-10 flex-shrink-0 line-clamp-2">
                          {label}
                        </p>
                        {/* Icon center */}
                        <div className="flex-1 flex items-center justify-center py-2 relative z-10">
                          {STATE_LOGO[key] && (
                            <Image
                              src={STATE_LOGO[key]}
                              alt={label}
                              width={64} height={64}
                              className="mix-blend-screen transition-all duration-200 group-hover/card:scale-110"
                              style={{ filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.50))' }}
                            />
                          )}
                        </div>
                        {/* Quality names bottom */}
                        <div
                          className="flex justify-around w-full pt-2.5 relative z-10 flex-shrink-0"
                          style={{ borderTop: '1px solid rgba(255,255,255,0.15)', gap: '4px' }}
                        >
                          {mechanics.map((m, qi) => {
                            const qt = QUALITY_TYPES[qi] ?? 'restore';
                            return (
                              <div key={m.id} className="flex flex-col items-center gap-1 flex-1 min-w-0 overflow-hidden">
                                <span className="text-[9px] xl:text-[10px] font-black tracking-[0.04em] xl:tracking-[0.06em] uppercase text-white/90 leading-tight truncate w-full text-center">
                                  {m.title}
                                </span>
                                <div className="flex items-center gap-0.5">
                                  <QualityTypeIcon type={qt} className="w-[10px] h-[10px] opacity-45 flex-shrink-0" />
                                  <span className="text-[7px] xl:text-[8px] font-bold tracking-[0.08em] uppercase text-white/45 hidden xl:inline">
                                    {qt}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── STATE VIEW ───────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col p-1"
          style={{
            transform: desktopMode === 'state' ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 300ms cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          {desktopStateGroup && (() => {
            const dc = PILLAR_COLORS[desktopPillar];
            return (
              <>
                {/* Header bar */}
                <div className="flex items-center gap-3 pb-4 flex-shrink-0">
                  <button
                    onClick={desktopBackToGrid}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] text-white/50 hover:text-white/90 transition-all"
                  >
                    <span className="text-base leading-none">←</span>
                    <span className="text-[9px] font-black uppercase tracking-wider">All States</span>
                  </button>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {STATE_LOGO[desktopStateGroup.key] && (
                      <Image
                        src={STATE_LOGO[desktopStateGroup.key]}
                        alt={desktopStateGroup.label}
                        width={20} height={20}
                        className="rounded-sm mix-blend-screen opacity-90 flex-shrink-0"
                        style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.5))' }}
                      />
                    )}
                    <span className={`text-sm font-black uppercase tracking-wide ${dc.label} truncate`}>
                      {desktopStateGroup.label}
                    </span>
                    <span className={`text-[9px] font-semibold uppercase tracking-wider opacity-40 ${dc.label} flex-shrink-0`}>
                      {desktopPillar}
                    </span>
                  </div>
                  {/* Key icon selector — all 12 states */}
                  <div className="flex items-center gap-0.5 ml-auto">
                    {allStates.map((state, idx) => (
                      <button
                        key={state.key}
                        onClick={() => { setDesktopActiveStateIdx(idx); setDesktopQualIdx(0); setDesktopTab('techniques'); setDesktopItemIdx(0); }}
                        title={state.label}
                        className={`group w-[22px] h-[22px] rounded flex items-center justify-center transition-all duration-150
                          ${idx > 0 && idx % 3 === 0 ? 'ml-1.5' : ''}
                          ${idx === desktopActiveStateIdx ? 'bg-white/15' : 'hover:bg-white/[0.06]'}
                        `}
                      >
                        {STATE_LOGO[state.key] && (
                          <Image
                            src={STATE_LOGO[state.key]}
                            alt={state.label}
                            width={16} height={16}
                            className={`mix-blend-screen transition-opacity duration-150 ${idx === desktopActiveStateIdx ? 'opacity-95' : 'opacity-20 group-hover:opacity-55'}`}
                            style={idx === desktopActiveStateIdx ? { filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' } : undefined}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality row — horizontal */}
                <div className="flex gap-2 pb-3 flex-shrink-0">
                  {(desktopStateGroup.mechanics ?? []).map((mechanic, qi) => {
                    const qt = (mechanic.quality_type as QualityType) ?? QUALITY_TYPES[qi] ?? 'restore';
                    const isActive = qi === desktopQualIdx;
                    return (
                      <button
                        key={mechanic.id}
                        onClick={() => { setDesktopQualIdx(qi); setDesktopItemIdx(0); setDesktopTab('techniques'); }}
                        className={`relative overflow-hidden flex-1 rounded-xl px-3 py-2 flex items-center gap-2 text-left transition-all duration-200
                          ${isActive
                            ? `${dc.activeQualPill} shadow-md`
                            : 'bg-white/[0.04] text-white/40 hover:text-white/70 hover:bg-white/[0.07]'
                          }`}
                      >
                        {isActive && <div className="absolute inset-0 bg-gradient-to-b from-white/[0.10] to-transparent pointer-events-none rounded-xl" />}
                        <div style={isActive ? { filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.45))' } : undefined}>
                          <QualityTypeIcon type={qt} className="w-3 h-3 flex-shrink-0" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black uppercase tracking-wide leading-tight truncate">{mechanic.title}</p>
                          <p className={`text-[8px] uppercase tracking-widest mt-0.5 ${isActive ? 'opacity-60' : 'opacity-35'}`}>{qt}</p>
                          {mechanic.definition && (
                            <p className={`text-[9px] leading-snug mt-1 transition-opacity duration-200 ${isActive ? 'opacity-75' : 'opacity-0'}`}>
                              {mechanic.definition}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Body: left panel + right panel */}
                <div className="flex gap-4 flex-1 min-h-0">

                  {/* Left panel — item list */}
                  <div className="w-[220px] flex-shrink-0 flex flex-col gap-2 min-h-0">
                    {/* Tab */}
                    <div className="flex bg-black/[0.12] rounded-xl p-[3px] gap-[2px] flex-shrink-0">
                      {(['techniques', 'concepts'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => { setDesktopTab(tab); setDesktopItemIdx(0); }}
                          className={`flex-1 h-7 rounded-[9px] text-[9px] font-black tracking-[0.12em] uppercase transition-all duration-200
                            ${desktopTab === tab
                              ? 'bg-neutral-dark text-white shadow-md'
                              : 'text-white/25 hover:text-white/50'
                            }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    {/* Item list */}
                    <div className="flex-1 overflow-y-auto space-y-1 pr-0.5 min-h-0">
                      {desktopItems.length === 0 ? (
                        <p className="text-[11px] text-white/25 text-center py-6">No {desktopTab} yet</p>
                      ) : desktopItems.map((item, ii) => {
                        const isItemActive = ii === clampedDesktopItemIdx;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setDesktopItemIdx(ii)}
                            className={`w-full rounded-lg px-2.5 py-2 flex items-center gap-2 text-left transition-all duration-150 border-l-2
                              ${isItemActive
                                ? `${dc.bg} ${dc.border}`
                                : 'hover:bg-white/[0.04] border-transparent'
                              }`}
                          >
                            <span className={`flex-shrink-0 ${isItemActive ? dc.label : 'text-white/30'}`}>
                              {item.card_type === 'technique' ? <TechniqueIcon /> : <ConceptIcon />}
                            </span>
                            <span className={`text-[11px] font-medium leading-snug flex-1 truncate ${isItemActive ? 'text-white/90' : 'text-white/40'}`}>
                              {item.title}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                  </div>

                  {/* Right panel — full card content inline */}
                  <div className="flex-1 min-w-0 overflow-y-auto">
                    {desktopCurrentItem ? (
                      <div>
                        <p className={`text-[9px] font-black tracking-[0.18em] uppercase mb-1.5 flex items-center gap-1.5 ${dc.label}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dc.dot} inline-block`} />
                          {desktopCurrentItem.card_type.toUpperCase()}
                        </p>
                        <h3
                          className={`text-2xl font-black leading-tight tracking-tight mb-3 ${dc.label}`}
                          style={{ letterSpacing: '-0.02em' }}
                        >
                          {desktopCurrentItem.title}
                        </h3>
                        {desktopCurrentItem.definition && (
                          <p className="text-sm leading-relaxed text-white/65 mb-4">
                            {desktopCurrentItem.definition}
                          </p>
                        )}
                        <InlineCardContent cardId={desktopCurrentItem.id} dark={true} />
                      </div>
                    ) : desktopDqm ? (
                      <div>
                        <p className={`text-[9px] font-black tracking-[0.18em] uppercase mb-2 ${dc.label} opacity-50`}>
                          {(QUALITY_TYPES[desktopQualIdx] ?? 'quality').toUpperCase()} QUALITY
                        </p>
                        <h3
                          className={`text-2xl font-black leading-tight tracking-tight mb-3 ${dc.label}`}
                          style={{ letterSpacing: '-0.02em' }}
                        >
                          {desktopDqm.title}
                        </h3>
                        {desktopDqm.definition && (
                          <p className="text-sm leading-relaxed text-white/65 mb-4">
                            {desktopDqm.definition}
                          </p>
                        )}
                        <p className="text-[10px] text-white/25">
                          Select a {desktopTab === 'techniques' ? 'technique' : 'concept'} from the list to explore
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </>
            );
          })()}
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

