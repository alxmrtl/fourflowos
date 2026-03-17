'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { DimensionType, KeyType } from '@/types/framework';
import type { DimensionData } from '@/types/profile-json';
import { DIMENSIONS, KEYS } from '@/data/framework';

const KEY_QUESTIONS: Record<KeyType, string> = {
  'tuned-emotions': 'How do your emotions either open or close the door to flow?',
  'focused-body': 'How does your physical state support or block flow?',
  'open-mind': 'How does the quality of your thinking shape your access to flow?',
  'intentional-space': 'How does the space around you invite or block flow?',
  'optimized-tools': 'How does friction in your toolkit translate into friction in your flow?',
  'feedback-systems': 'How does knowing whether you\'re making impact keep flow alive?',
  'generative-story': 'How does the narrative you\'re living support or stall flow?',
  'clear-mission': 'How does clarity of direction affect your access to flow?',
  'empowered-role': 'How does claiming your role — or not — shape your flow?',
  'grounding-values': 'How does alignment between your values and your actions affect flow?',
  'ignited-curiosity': 'How does genuine interest fuel or deplete flow?',
  'visualized-vision': 'How does having a clear picture of where you\'re headed affect flow?',
};

const DIM_KEYS: Record<DimensionType, KeyType[]> = {
  self: ['tuned-emotions', 'focused-body', 'open-mind'],
  space: ['intentional-space', 'optimized-tools', 'feedback-systems'],
  story: ['generative-story', 'clear-mission', 'empowered-role'],
  spirit: ['grounding-values', 'ignited-curiosity', 'visualized-vision'],
};

interface Props {
  dim: DimensionType;
  data: DimensionData;
}

export default function DimensionBentoCard({ dim, data }: Props) {
  const meta = DIMENSIONS[dim];
  const keySlots = DIM_KEYS[dim];

  const [activeKeySlug, setActiveKeySlug] = useState<KeyType | null>(null);

  if (!data || !data.keys) {
    return (
      <div
        className="rounded-2xl overflow-hidden border border-white/10"
        style={{ background: 'rgba(20,20,20,0.95)' }}
      >
        <div style={{ height: 3, background: meta.color }} />
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
      className="rounded-2xl overflow-hidden border border-white/10"
      style={{ background: 'rgba(20,20,20,0.95)' }}
    >
      {/* Top edge color bar */}
      <div style={{ height: 3, background: meta.color }} />

      {/* Row layout: stacked on mobile, horizontal on sm+ */}
      <div className="flex flex-col sm:flex-row p-4 gap-4 sm:gap-0">

        {/* LEFT COLUMN — dimension header + stacked key buttons */}
        <div className="w-full sm:w-48 md:w-52 flex-shrink-0 flex flex-col gap-2 sm:pr-5 sm:border-r sm:border-white/[0.06]">
          {/* Dimension header */}
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

          {/* Stacked key buttons */}
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
        <div className="flex-1 min-w-0 sm:pl-5 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {activeKeySlug && activeKeyData ? (
              <motion.div
                key={activeKeySlug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                {/* Question + X close */}
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-gray-500 leading-snug italic flex-1">
                    {activeKeySlug && KEY_QUESTIONS[activeKeySlug]}
                  </p>
                  <button
                    onClick={handleClose}
                    className="flex-shrink-0 text-gray-600 hover:text-gray-300 transition-colors text-base leading-none mt-0.5"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {/* Personal key */}
                {activeKeyData.personal_key && (
                  <p className="text-sm font-bold italic leading-snug" style={{ color: meta.color }}>
                    {activeKeyData.personal_key}
                  </p>
                )}

                {/* Insight paragraph */}
                <p className="text-sm text-gray-300 leading-relaxed">
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
                className="text-sm text-gray-300 leading-relaxed"
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
