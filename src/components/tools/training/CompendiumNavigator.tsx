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
}> = {
  self: {
    label: 'text-self',
    bg: 'bg-self/5',
    border: 'border-self',
    dot: 'bg-self',
    barBg: (s) => ['bg-self/5', 'bg-self/8', 'bg-self/12', 'bg-self/18', 'bg-self/25'][Math.max(0, Math.min(4, s - 1))],
    badgeBg: 'bg-self/10 text-self',
  },
  space: {
    label: 'text-space',
    bg: 'bg-space/5',
    border: 'border-space',
    dot: 'bg-space',
    barBg: (s) => ['bg-space/5', 'bg-space/8', 'bg-space/12', 'bg-space/18', 'bg-space/25'][Math.max(0, Math.min(4, s - 1))],
    badgeBg: 'bg-space/10 text-space',
  },
  story: {
    label: 'text-story',
    bg: 'bg-story/5',
    border: 'border-story',
    dot: 'bg-story',
    barBg: (s) => ['bg-story/5', 'bg-story/8', 'bg-story/12', 'bg-story/18', 'bg-story/25'][Math.max(0, Math.min(4, s - 1))],
    badgeBg: 'bg-story/10 text-story',
  },
  spirit: {
    label: 'text-spirit',
    bg: 'bg-spirit/5',
    border: 'border-spirit',
    dot: 'bg-spirit',
    barBg: (s) => ['bg-spirit/5', 'bg-spirit/8', 'bg-spirit/12', 'bg-spirit/18', 'bg-spirit/25'][Math.max(0, Math.min(4, s - 1))],
    badgeBg: 'bg-spirit/10 text-spirit',
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
  self: ['tuned-emotions', 'focused-body', 'open-mind'],
  space: ['intentional-space', 'optimized-tools', 'feedback-systems'],
  story: ['generative-story', 'clear-mission', 'empowered-role'],
  spirit: ['grounding-values', 'ignited-curiosity', 'visualized-vision'],
};

// ── Helpers ──────────────────────────────────────────────────────────

function formatKeyLabel(key: string): string {
  return key.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

function isDue(nextReview: string | null): boolean {
  if (!nextReview) return false;
  return new Date(nextReview) <= new Date();
}

// ── SVG Icons ────────────────────────────────────────────────────────

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
  const [expandedQualityIds, setExpandedQualityIds] = useState<Set<string>>(new Set());

  // Modal state
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

  // Build the nested hierarchy: pillar → flow_key → mechanics → children
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
        for (const o of orphans) {
          nested.push({ ...o, children: [] });
        }

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

  const toggleQuality = (id: string) => {
    setExpandedQualityIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openStateModal = (pillar: Pillar, key: string, label: string, mechanics: NestedMechanic[]) => {
    setModalStateData({
      key,
      label,
      pillar,
      qualities: mechanics.map(m => ({
        id: m.id,
        title: m.title,
        definition: m.definition,
        mastery_level: m.mastery_level,
        enrichment_score: m.enrichment_score,
      })),
    });
    setModalCardId(null);
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-sm text-neutral-light">
        Loading compendium...
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="w-full">
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

      {/* Grid — 4 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pillarGroups.map(({ pillar, keys }) => {
          const c = PILLAR_COLORS[pillar];

          return (
            <div key={pillar} className="min-w-0">
              {/* Pillar header — branded, non-interactive */}
              <div className={`mb-5 pb-3 border-b-2 ${c.border} opacity-100`}>
                <div className="flex items-center gap-2.5">
                  <Image
                    src={PILLAR_LOGO[pillar]}
                    alt={pillar}
                    width={32}
                    height={32}
                    className="rounded-sm opacity-90"
                  />
                  <span className={`font-display text-xl font-bold uppercase tracking-wider ${c.label}`}>
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
                    {/* State label — clickable → state modal */}
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
                      <span className={`text-sm font-semibold uppercase tracking-wider ${c.label} group-hover:opacity-80 transition-opacity`}>
                        {label}
                      </span>
                      <span className="ml-auto opacity-25 group-hover:opacity-70 transition-opacity text-neutral-light">
                        <ExpandIcon />
                      </span>
                    </button>

                    {/* Quality bars + nested children */}
                    <div className="space-y-2">
                      {mechanics.map(mechanic => {
                        const isChildrenExpanded = expandedQualityIds.has(mechanic.id);
                        return (
                          <div key={mechanic.id}>
                            <QualityBar
                              item={mechanic}
                              pillar={pillar}
                              isExpanded={isChildrenExpanded}
                              onToggle={() => toggleQuality(mechanic.id)}
                              onOpenDetail={() => {
                                setModalCardId(mechanic.id);
                                setModalStateData(null);
                              }}
                            />

                            {/* Children — visible only when quality is expanded */}
                            {isChildrenExpanded && mechanic.children.map(child => (
                              <div key={child.id} className="ml-4 mt-1.5">
                                <ChildBar
                                  item={child}
                                  pillar={pillar}
                                  onOpenDetail={() => {
                                    setModalCardId(child.id);
                                    setModalStateData(null);
                                  }}
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

      {/* Detail modal */}
      <CardDetailModal
        cardId={modalCardId}
        stateData={modalStateData}
        onClose={closeModal}
      />
    </div>
  );
}

// ── Quality Bar ───────────────────────────────────────────────────────

function QualityBar({
  item,
  pillar,
  isExpanded,
  onToggle,
  onOpenDetail,
}: {
  item: NestedMechanic;
  pillar: Pillar;
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
        {/* Row 1: due dot + title + expand icon */}
        <div className="flex items-center gap-2 w-full">
          {due && (
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse flex-shrink-0`} />
          )}
          <span className="text-sm font-medium text-white flex-1 leading-snug">
            {item.title}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onOpenDetail(); }}
            className="opacity-25 group-hover/quality:opacity-70 transition-opacity text-neutral-light hover:text-white flex-shrink-0 p-0.5"
            title="View full entry"
          >
            <ExpandIcon />
          </button>
        </div>

        {/* Row 2: definition + enrichment dots + chevron */}
        <div className="flex items-start gap-2 w-full">
          {item.definition ? (
            <span className="text-xs text-neutral-light flex-1 leading-snug">
              {item.definition}
            </span>
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

// ── Child Bar (Technique / Concept) ──────────────────────────────────

function ChildBar({
  item,
  pillar,
  onOpenDetail,
}: {
  item: MechanicItem;
  pillar: Pillar;
  onOpenDetail: () => void;
}) {
  const c = PILLAR_COLORS[pillar];
  const isTechnique = item.card_type === 'technique';
  const borderStyle = isTechnique ? 'border-solid' : 'border-dashed';
  const due = isDue(item.next_review_at);
  const hasContent = (item.enrichment_score ?? 0) > 0;

  if (!hasContent) {
    return (
      <div
        className={`
          w-full h-8 rounded-md flex items-center gap-2 px-2.5
          border-l-2 border-dashed border-neutral/20
          bg-neutral/[0.02]
        `}
      >
        <span className="flex-shrink-0 text-neutral/25">
          {isTechnique ? <TechniqueIcon /> : <ConceptIcon />}
        </span>
        <span className="text-xs text-neutral/25 truncate flex-1 text-left">
          {item.title}
        </span>
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
      {due && (
        <span className={`w-1 h-1 rounded-full ${c.dot} animate-pulse flex-shrink-0`} />
      )}
      <span className={`flex-shrink-0 ${c.label} ${isTechnique ? '' : 'opacity-60'}`}>
        {isTechnique ? <TechniqueIcon /> : <ConceptIcon />}
      </span>
      <span className="text-xs text-neutral-light truncate flex-1 text-left">
        {item.title}
      </span>
      <span className="opacity-20 group-hover/child:opacity-60 transition-opacity text-neutral-light flex-shrink-0">
        <ExpandIcon />
      </span>
    </button>
  );
}
