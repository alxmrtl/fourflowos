'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import type { MasteryStats, Pillar } from '@/types/training';
import CardDetailModal, { type StateData } from './CardDetailModal';

// ── Color maps (aligned with ProgressGrid) ──────────────────────────

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

const MASTERY_DOT: Record<string, string> = {
  unseen: 'bg-neutral/30',
  learning: 'bg-amber-400',
  young: 'bg-blue-400',
  mature: 'bg-green-500',
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

// ── Key ordering (matches pillar flow) ───────────────────────────────

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

// ── Component ────────────────────────────────────────────────────────

export default function CompendiumNavigator() {
  const [stats, setStats] = useState<MasteryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQualityIds, setExpandedQualityIds] = useState<Set<string>>(new Set());
  const [collapsedPillars, setCollapsedPillars] = useState<Set<Pillar>>(new Set());

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

  const togglePillar = (p: Pillar) => {
    setCollapsedPillars(prev => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });
  };

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
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-xs text-neutral-light">
        {Object.entries(MASTERY_DOT).map(([level, color]) => (
          <div key={level} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span className="capitalize">{level}</span>
          </div>
        ))}
        <span className="text-neutral/20">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold bg-neutral/10 rounded px-1">T</span>
          <span>Technique</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold bg-neutral/10 rounded px-1">C</span>
          <span>Concept</span>
        </div>
      </div>

      {/* Grid — 4 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillarGroups.map(({ pillar, keys, totalMechanics, totalTechniques, totalConcepts }) => {
          const c = PILLAR_COLORS[pillar];
          const isCollapsed = collapsedPillars.has(pillar);

          return (
            <div key={pillar} className="min-w-0">
              {/* Pillar header */}
              <button
                onClick={() => togglePillar(pillar)}
                className="w-full text-left mb-4"
              >
                <div className="flex items-center justify-between">
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
                  <span className="text-xs text-neutral-light">
                    {isCollapsed ? '▸' : '▾'}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-light mt-1 ml-[44px]">
                  {totalMechanics}q · {totalTechniques}t · {totalConcepts}c
                </div>
              </button>

              {!isCollapsed && (
                <div className="space-y-5">
                  {keys.map(({ key, label, mechanics }) => (
                    <div key={key}>
                      {/* State label — clickable → state modal */}
                      <button
                        onClick={() => openStateModal(pillar, key, label, mechanics)}
                        className="flex items-center gap-2 mb-2.5 ml-1 group w-full text-left"
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
                        <span className={`text-[13px] font-semibold uppercase tracking-wider ${c.label} group-hover:opacity-80 transition-opacity`}>
                          {label}
                        </span>
                        <span className="text-[10px] text-neutral-light opacity-0 group-hover:opacity-40 transition-opacity ml-auto">
                          ↗
                        </span>
                      </button>

                      {/* Quality bars + nested children */}
                      <div className="space-y-1.5">
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
                                <div key={child.id} className="ml-4 mt-1">
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
              )}
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
    <div className="relative group/quality">
      <button
        onClick={onToggle}
        className={`
          w-full rounded-lg flex flex-col gap-1 px-2.5 py-2.5
          border-l-[3px] ${c.border}
          ${bgClass}
          transition-all duration-150
          hover:-translate-y-px hover:brightness-105
          ${isExpanded ? 'ring-1 ring-neutral/10' : ''}
          text-left
        `}
      >
        {/* Row 1: title + due dot + mastery dot + detail icon */}
        <div className="flex items-center gap-2 w-full">
          {due && (
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse flex-shrink-0`} />
          )}
          <span className="text-xs font-medium text-neutral flex-1 pr-6">
            {item.title}
          </span>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${MASTERY_DOT[item.mastery_level]}`} />
        </div>

        {/* Row 2: definition + enrichment dots + chevron */}
        <div className="flex items-start gap-2 w-full">
          {item.definition ? (
            <span className="text-[10px] text-neutral-light italic flex-1 leading-snug pr-6">
              {item.definition}
            </span>
          ) : (
            <span className="flex-1" />
          )}
          <div className="flex items-center gap-1 flex-shrink-0 self-end">
            {item.enrichment_score > 0 && (
              <span className="flex items-center gap-0.5" title={`Enrichment: ${item.enrichment_score}/5`}>
                {[1, 2, 3, 4, 5].map(i => (
                  <span
                    key={i}
                    className={`w-1 h-1 rounded-full ${i <= item.enrichment_score ? c.dot : 'bg-neutral/15'}`}
                  />
                ))}
              </span>
            )}
            {hasChildren && (
              <span className="text-[9px] text-neutral-light ml-1">
                {isExpanded ? '▾' : '▸'}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Detail icon — top-right corner, appears on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); onOpenDetail(); }}
        className="absolute top-1.5 right-1.5 w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover/quality:opacity-60 hover:!opacity-100 transition-opacity text-neutral-light hover:text-neutral bg-neutral/10 hover:bg-neutral/20"
        title="View full entry"
      >
        <span className="text-[9px]">↗</span>
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
  const typeLabel = item.card_type === 'technique' ? 'T' : 'C';
  const borderStyle = item.card_type === 'technique' ? 'border-dashed' : 'border-dotted';
  const due = isDue(item.next_review_at);

  return (
    <button
      onClick={onOpenDetail}
      className={`
        w-full h-6 rounded-md flex items-center gap-1.5 px-2
        border-l-2 ${borderStyle} ${c.border}
        bg-neutral/[0.02]
        transition-all duration-150
        hover:-translate-y-px hover:bg-neutral/5
      `}
    >
      {due && (
        <span className={`w-1 h-1 rounded-full ${c.dot} animate-pulse flex-shrink-0`} />
      )}
      <span className={`text-[10px] font-semibold rounded px-1 flex-shrink-0 ${c.badgeBg}`}>
        {typeLabel}
      </span>
      <span className="text-[11px] text-neutral-light truncate flex-1 text-left">
        {item.title}
      </span>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${MASTERY_DOT[item.mastery_level]}`} />
    </button>
  );
}
