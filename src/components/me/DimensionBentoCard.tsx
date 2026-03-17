'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { DimensionType, KeyType } from '@/types/framework';
import type { DimensionData } from '@/types/profile-json';
import { DIMENSIONS, KEYS } from '@/data/framework';

// Strip the layup stem prefix from a personal_key so only the completion is shown.
// e.g. stem "Your body enters flow when it..." + key "Your body enters flow when it moves fast"
// → "moves fast"
function getKeyCompletion(personalKey: string, stem: string | null | undefined): string {
  if (!stem) return personalKey;
  const prefix = stem.replace(/[.…]+$/, '').trim();
  if (personalKey.toLowerCase().startsWith(prefix.toLowerCase())) {
    return personalKey.slice(prefix.length).replace(/^\s+/, '');
  }
  return personalKey;
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

function KeyIcon({ color, size = 15 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5.5" cy="5.5" r="3.75" stroke={color} strokeWidth="1.5" />
      <line x1="8.5" y1="8.5" x2="13.5" y2="13.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11.5" y1="12.5" x2="11.5" y2="14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13" y1="11" x2="15" y2="11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
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

  const activeKeyData = activeKeySlug ? data.keys[activeKeySlug] : null;

  function handleKeyClick(slug: KeyType) {
    if (!data.keys[slug]) return;
    setActiveKeySlug(slug === activeKeySlug ? null : slug);
  }

  function handleClose() {
    setActiveKeySlug(null);
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
      <div className="flex flex-col sm:flex-row flex-1 p-4 gap-4 sm:gap-0">

        {/* LEFT COLUMN — dimension header + stacked key buttons */}
        <div className="w-full sm:w-48 md:w-52 flex-shrink-0 flex flex-col gap-2 sm:pr-5 sm:border-r sm:border-white/[0.06]">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 flex-shrink-0">
              <Image
                src={meta.sectionLogo}
                alt={meta.name}
                width={32}
                height={32}
                className="object-contain opacity-80"
              />
            </div>
            <p
              className="text-sm font-semibold tracking-widest uppercase leading-none"
              style={{ color: meta.color }}
            >
              {meta.name}
            </p>
          </div>

          {keySlots.map((slug) => {
            const keyMeta = KEYS[slug];
            const hasData = !!data.keys[slug];
            const isActive = slug === activeKeySlug;
            return (
              <button
                key={slug}
                onClick={() => hasData && handleKeyClick(slug)}
                disabled={!hasData}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all text-left w-full ${
                  !hasData
                    ? 'opacity-40 cursor-default border-white/5'
                    : 'cursor-pointer'
                }`}
                style={{
                  background: isActive ? `${meta.color}30` : hasData ? 'rgba(255,255,255,0.04)' : 'transparent',
                  borderColor: isActive ? `${meta.color}60` : 'rgba(255,255,255,0.10)',
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: `${meta.color}25` }}
                >
                  <Image
                    src={keyMeta.icon}
                    alt={keyMeta.name}
                    width={14}
                    height={14}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-white flex-1 min-w-0 truncate">{keyMeta.name}</span>
                {hasData && (
                  <span className="text-white/40 text-sm flex-shrink-0">›</span>
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHT COLUMN — summary or key insight */}
        <div className="flex-1 min-w-0 sm:pl-5 flex flex-col justify-center relative overflow-hidden">
          {/* Radial ink sweep — fires when a key is active */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={false}
            animate={{
              clipPath: activeKeySlug
                ? 'circle(150% at 10% 10%)'
                : 'circle(0% at 10% 10%)',
            }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background: `linear-gradient(135deg, rgba(${rgb}, 0.14), rgba(${rgb}, 0.05))`,
            }}
          />

          <AnimatePresence mode="wait">
            {activeKeySlug && activeKeyData ? (
              <motion.div
                key={activeKeySlug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.15 }}
                className="flex flex-col gap-3 relative z-10"
              >
                {/* Stem header + close */}
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[12px] font-medium leading-snug flex-1" style={{ color: `rgba(${rgb}, 0.65)` }}>
                    {KEYS[activeKeySlug]?.layupStem ?? ''}
                  </p>
                  <button
                    onClick={handleClose}
                    className="flex-shrink-0 text-gray-600 hover:text-gray-300 transition-colors text-base leading-none mt-0.5"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {/* Personal key container — completion only */}
                {activeKeyData.personal_key && (
                  <div
                    className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
                    style={{
                      background: `rgba(${rgb}, 0.10)`,
                      border: `1px solid rgba(${rgb}, 0.28)`,
                    }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <KeyIcon color={meta.color} size={15} />
                    </div>
                    <p className="text-sm font-bold italic leading-snug" style={{ color: meta.color }}>
                      {getKeyCompletion(activeKeyData.personal_key, KEYS[activeKeySlug]?.layupStem)}
                    </p>
                  </div>
                )}

                {/* Insight paragraph */}
                <p className="text-xs text-gray-400 leading-relaxed">
                  {activeKeyData.insight}
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="summary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm text-gray-300 leading-relaxed relative z-10"
              >
                {data.summary}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
