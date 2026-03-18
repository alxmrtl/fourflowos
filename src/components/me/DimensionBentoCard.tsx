'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { DimensionType, KeyType } from '@/types/framework';
import type { DimensionData } from '@/types/profile-json';
import { DIMENSIONS, KEYS } from '@/data/framework';

// Strip the layup stem prefix from a personal_key so only the completion is shown.
function getKeyCompletion(personalKey: string, stem: string | null | undefined): string {
  if (!stem) return personalKey;
  const prefix = stem.replace(/[.…]+$/, '').trim();
  if (personalKey.toLowerCase().startsWith(prefix.toLowerCase())) {
    return personalKey.slice(prefix.length).replace(/^\s+/, '');
  }
  return personalKey;
}

// Split text at the first sentence boundary — returns [firstSentence, remainder].
function splitFirstSentence(text: string): [string, string] {
  const match = text.match(/^(.+?[.!?])(\s+[\s\S]+)$/);
  if (match) return [match[1], match[2].trimStart()];
  return [text, ''];
}

const DIM_KEYS: Record<DimensionType, KeyType[]> = {
  self: ['tuned-emotions', 'focused-body', 'open-mind'],
  space: ['intentional-space', 'optimized-tools', 'feedback-systems'],
  story: ['generative-story', 'clear-mission', 'empowered-role'],
  spirit: ['grounding-values', 'ignited-curiosity', 'visualized-vision'],
};

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

interface Props {
  dim: DimensionType;
  data: DimensionData;
}

export default function DimensionBentoCard({ dim, data }: Props) {
  const meta = DIMENSIONS[dim];
  const keySlots = DIM_KEYS[dim];
  const rgb = hexToRgb(meta.color);

  const [activeKeySlug, setActiveKeySlug] = useState<KeyType | null>(null);

  if (!data || !data.keys) {
    return (
      <div
        className="rounded-2xl overflow-hidden border border-white/10 flex flex-row"
        style={{ background: 'rgba(20,20,20,0.95)' }}
      >
        <div
          className="flex-shrink-0 w-4"
          style={{
            background: `rgba(${rgb}, 0.06)`,
            borderRight: `1px solid rgba(${rgb}, 0.12)`,
          }}
        />
        <div className="p-4">
          <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: meta.color }}>
            {meta.name}
          </p>
          <p className="text-xs text-gray-600 mt-2">Profile data for this dimension is unavailable.</p>
        </div>
      </div>
    );
  }

  function handleKeyClick(slug: KeyType) {
    if (!data.keys[slug]) return;
    setActiveKeySlug(slug === activeKeySlug ? null : slug);
  }

  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/10 flex flex-row"
      style={{ background: 'rgba(20,20,20,0.95)' }}
    >
      {/* ── Left Spine — Signal Pulse ──────────────────────────────── */}
      <div
        className="flex-shrink-0 w-4 flex flex-col items-center justify-evenly py-4"
        style={{
          background: `rgba(${rgb}, 0.06)`,
          borderRight: `1px solid rgba(${rgb}, 0.12)`,
        }}
      >
        {keySlots.map((slug) => {
          const isActive = slug === activeKeySlug;
          const hasData = !!data.keys[slug];
          return (
            <div
              key={slug}
              className="rounded-full transition-all duration-300"
              style={{
                width: isActive ? 7 : 4,
                height: isActive ? 7 : 4,
                background: isActive
                  ? meta.color
                  : `rgba(${rgb}, ${hasData ? '0.3' : '0.15'})`,
                boxShadow: isActive
                  ? `0 0 8px 3px rgba(${rgb}, 0.45)`
                  : 'none',
              }}
            />
          );
        })}
      </div>

      {/* ── Main content ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Dimension header row */}
        <div
          className="flex items-center gap-2.5 px-4 py-3 flex-shrink-0"
          style={{ borderBottom: `1px solid rgba(${rgb}, 0.12)` }}
        >
          <div className="w-7 h-7 flex-shrink-0">
            <Image
              src={meta.sectionLogo}
              alt={meta.name}
              width={28}
              height={28}
              className="object-contain opacity-80"
            />
          </div>
          <p
            className="text-sm font-semibold tracking-widest uppercase leading-none"
            style={{ color: meta.color }}
          >
            {meta.name}
          </p>
          {meta.subtitle && (
            <>
              <span className="text-white/15 text-xs mx-0.5">|</span>
              <p className="text-[10px] font-medium tracking-widest uppercase text-gray-500 leading-none">
                {meta.subtitle}
              </p>
            </>
          )}
        </div>

        {/* Key rows */}
        {keySlots.map((slug) => {
          const keyMeta = KEYS[slug];
          const keyData = data.keys[slug];
          const hasData = !!keyData;
          const isActive = slug === activeKeySlug;
          const stem = KEYS[slug]?.layupStem ?? '';
          const stemText = stem.replace(/[.…]+$/, '').trim();
          const completion = hasData && keyData?.personal_key
            ? getKeyCompletion(keyData.personal_key, stem)
            : null;
          const [firstSent, restSent] = completion ? splitFirstSentence(completion) : ['', ''];

          return (
            <div
              key={slug}
              className={`relative transition-all duration-300 ${!hasData ? 'opacity-40' : ''}`}
              style={{ borderTop: `1px solid rgba(${rgb}, 0.08)` }}
            >
              {/* Ink sweep — per row */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={false}
                animate={{
                  clipPath: isActive
                    ? 'circle(150% at 10% 50%)'
                    : 'circle(0% at 10% 50%)',
                  opacity: isActive ? [0, 1, 0] : 0,
                }}
                transition={{
                  clipPath: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 1.1, times: [0, 0.2, 1], ease: 'easeOut' },
                }}
                style={{
                  background: `linear-gradient(135deg, rgba(${rgb}, 0.14), rgba(${rgb}, 0.05))`,
                }}
              />

              <button
                onClick={() => hasData && handleKeyClick(slug)}
                disabled={!hasData}
                className={`flex items-center w-full text-left relative z-10 px-4 h-[56px] gap-3 ${hasData ? 'cursor-pointer' : 'cursor-default'}`}
                style={{
                  background: isActive ? `rgba(${rgb}, 0.06)` : 'transparent',
                }}
              >
                {/* Col 1: key icon circle + name — narrower */}
                <div className="flex items-center gap-2 flex-shrink-0 w-[88px]">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: `${meta.color}22` }}
                  >
                    <Image
                      src={keyMeta.icon}
                      alt={keyMeta.name}
                      width={13}
                      height={13}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-white leading-tight">{keyMeta.name}</span>
                </div>

                {/* Col 2+3: fixed-height container — content swaps in place, no reflow */}
                <div className="relative flex-1 min-w-0 h-full overflow-hidden">
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.div
                        key="expanded"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="absolute inset-0 flex items-center"
                      >
                        {/* Insight only */}
                        <p className="text-[11px] italic text-gray-300 leading-relaxed line-clamp-3">
                          {keyData?.insight}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="collapsed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 flex items-center gap-3"
                      >
                        {completion ? (
                          <>
                            {/* Left: key icon + headline (stem + firstSent) */}
                            <div className="flex items-center gap-1.5 flex-[3] min-w-0">
                              <svg
                                width="12" height="12" viewBox="0 0 24 24" fill="none"
                                className="flex-shrink-0"
                                style={{ color: meta.color }}
                              >
                                <path
                                  d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                />
                              </svg>
                              <p
                                className="text-[13px] font-bold leading-snug line-clamp-2"
                                style={{ color: meta.color }}
                              >
                                {stemText} {firstSent}
                              </p>
                            </div>
                            {/* Right: restSent in ivory */}
                            {restSent && (
                              <p className="text-[11px] text-[#F5F5F5]/75 leading-snug flex-[2] min-w-0 line-clamp-2">
                                {restSent}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-xs text-gray-600">—</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Chevron */}
                {hasData && (
                  <span className="flex-shrink-0 text-gray-500 text-base leading-none">
                    {isActive ? '×' : '›'}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
