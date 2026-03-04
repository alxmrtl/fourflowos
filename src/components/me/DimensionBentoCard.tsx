'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { DimensionType, KeyType } from '@/types/framework';
import type { DimensionData } from '@/types/profile-json';
import { DIMENSIONS, KEYS } from '@/data/framework';

const KEY_ORIGINS = ['15% 75%', '50% 75%', '85% 75%'];

const DIM_FUNCTION: Record<DimensionType, string> = {
  self: 'Reception Layer',
  space: 'Transmission Layer',
  story: 'Temporal Direction',
  spirit: 'Timeless Direction',
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
  const [isOpen, setIsOpen] = useState(false);

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

  const activeKeyIndex = activeKeySlug ? keySlots.indexOf(activeKeySlug) : 0;
  const radialOrigin = KEY_ORIGINS[activeKeyIndex] ?? '50% 75%';
  const activeKeyData = activeKeySlug ? data.keys[activeKeySlug] : null;
  const activeKeyMeta = activeKeySlug ? KEYS[activeKeySlug] : null;
  const otherKeys = keySlots.filter((s) => s !== activeKeySlug);

  function handleKeyClick(slug: KeyType) {
    if (!data.keys[slug]) return;
    setActiveKeySlug(slug);
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleSwitchKey(slug: KeyType) {
    if (!data.keys[slug]) return;
    setActiveKeySlug(slug);
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/10"
      style={{ background: 'rgba(20,20,20,0.95)' }}
    >
      {/* Top edge color bar */}
      <div style={{ height: 3, background: meta.color }} />

      {/* FRONT — normal flow, drives card height */}
      <div className="relative p-4">
        {/* Dimension header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 flex-shrink-0">
            <Image
              src={meta.sectionLogo}
              alt={meta.name}
              width={28}
              height={28}
              className="object-contain opacity-80"
            />
          </div>
          <div>
            <p
              className="text-[10px] font-semibold tracking-widest uppercase leading-none"
              style={{ color: meta.color }}
            >
              {meta.name}
            </p>
            <p className="text-[10px] text-gray-600 mt-0.5">{DIM_FUNCTION[dim]}</p>
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          {data.summary}
        </p>

        {/* Key buttons */}
        <div className="grid grid-cols-3 gap-1.5">
          {keySlots.map((slug) => {
            const keyMeta = KEYS[slug];
            const hasData = !!data.keys[slug];
            const nameParts = keyMeta.name.split(' ');
            const nameLabel = nameParts[0];
            const nameMain = nameParts.slice(1).join(' ') || nameParts[0];
            return (
              <button
                key={slug}
                onClick={() => hasData && handleKeyClick(slug)}
                disabled={!hasData}
                className={`flex items-center gap-2 px-2.5 py-2.5 rounded-xl transition-opacity ${
                  hasData ? 'cursor-pointer hover:opacity-80' : 'cursor-default opacity-30'
                }`}
                style={{ background: hasData ? `${meta.color}50` : 'rgba(255,255,255,0.05)' }}
              >
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: `${meta.color}40` }}
                >
                  <Image
                    src={keyMeta.icon}
                    alt={keyMeta.name}
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[9px] text-white/60 leading-none mb-0.5">{nameLabel}</p>
                  <p className="text-xs font-bold text-white leading-tight">{nameMain}</p>
                </div>
                {hasData && (
                  <span className="text-white/50 text-sm flex-shrink-0">›</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* RADIAL OVERLAY */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={false}
        animate={{
          clipPath: isOpen
            ? `circle(150% at ${radialOrigin})`
            : `circle(0% at ${radialOrigin})`,
        }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ background: `linear-gradient(135deg, ${meta.color}15, ${meta.color}08)` }}
      />

      {/* BACK */}
      <motion.div
        className="absolute inset-0 flex flex-col p-4"
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, delay: isOpen ? 0.3 : 0 }}
        style={{
          pointerEvents: isOpen ? 'auto' : 'none',
          background: 'rgba(14,14,14,0.99)',
        }}
      >
        {/* Header: icon + key name + close */}
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <div
            className="w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0"
            style={{ borderColor: `${meta.color}50`, background: `${meta.color}15` }}
          >
            {activeKeyMeta && (
              <Image
                src={activeKeyMeta.icon}
                alt={activeKeyMeta.name}
                width={20}
                height={20}
                className="object-contain"
              />
            )}
          </div>
          <p className="text-sm font-semibold text-white flex-1 uppercase tracking-wide leading-tight truncate">
            {activeKeyMeta?.name ?? ''}
          </p>
          <button
            onClick={handleClose}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Insight paragraph */}
        <div
          className="flex-1 rounded-xl border p-3 min-h-0 overflow-y-auto"
          style={{
            borderColor: `${meta.color}40`,
            background: `${meta.color}08`,
          }}
        >
          <p className="text-xs text-gray-300 leading-relaxed">
            {activeKeyData?.insight || <span className="text-gray-600 italic">—</span>}
          </p>
        </div>

        {/* Footer: other key pills */}
        <div className="flex-shrink-0 flex items-center gap-2 mt-3">
          {otherKeys.map((slug) => {
            if (!data.keys[slug]) return null;
            const kMeta = KEYS[slug];
            const firstWord = kMeta.name.split(' ')[0];
            return (
              <button
                key={slug}
                onClick={() => handleSwitchKey(slug)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/10 hover:border-white/25 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image
                    src={kMeta.icon}
                    alt={kMeta.name}
                    width={14}
                    height={14}
                    className="object-contain opacity-70"
                  />
                </div>
                <span className="text-[10px]">{firstWord}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
