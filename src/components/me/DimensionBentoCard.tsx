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

const CATEGORIES = ['Essence', 'Pattern', 'Tension', 'Direction'] as const;
type Category = (typeof CATEGORIES)[number];

function parseBullet(bullet: string): { label: string; body: string } {
  const colonIdx = bullet.indexOf(': ');
  if (colonIdx > 0) {
    return { label: bullet.slice(0, colonIdx), body: bullet.slice(colonIdx + 2) };
  }
  return { label: '', body: bullet };
}

function CategoryIcon({ category, color, size = 12 }: { category: string; color: string; size?: number }) {
  switch (category) {
    case 'Essence':
      return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill={color}>
          <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8Z" />
        </svg>
      );
    case 'Pattern':
      return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="1.5">
          <path d="M10 6a4 4 0 1 1-1-2.7" strokeLinecap="round" />
          <path d="M10 1.5V4H7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Tension':
      return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill={color}>
          <path d="M7 0L2.5 7h3.5l-1 5 5-7H6.5L7 0z" />
        </svg>
      );
    case 'Direction':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="1.5">
          <path d="M1 6h10M7.5 2.5L11 6l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

interface Props {
  dim: DimensionType;
  data: DimensionData;
}

export default function DimensionBentoCard({ dim, data }: Props) {
  const meta = DIMENSIONS[dim];
  const keySlots = DIM_KEYS[dim];

  const [activeKeySlug, setActiveKeySlug] = useState<KeyType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('Essence');

  const activeKeyIndex = activeKeySlug ? keySlots.indexOf(activeKeySlug) : 0;
  const radialOrigin = KEY_ORIGINS[activeKeyIndex] ?? '50% 75%';
  const activeKeyData = activeKeySlug ? data.keys[activeKeySlug] : null;
  const activeKeyMeta = activeKeySlug ? KEYS[activeKeySlug] : null;

  const activeBulletBody = (() => {
    if (!activeKeyData?.bullets) return '';
    const bullet = activeKeyData.bullets.find((b) => parseBullet(b).label === activeCategory);
    return bullet ? parseBullet(bullet).body : '';
  })();

  const otherKeys = keySlots.filter((s) => s !== activeKeySlug);

  function handleKeyClick(slug: KeyType) {
    if (!data.keys[slug]) return;
    setActiveKeySlug(slug);
    setActiveCategory('Essence');
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleSwitchKey(slug: KeyType) {
    if (!data.keys[slug]) return;
    setActiveKeySlug(slug);
    setActiveCategory('Essence');
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
        <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
          {data.summary}
        </p>

        {/* Key rows */}
        <div className="space-y-1.5">
          {keySlots.map((slug) => {
            const keyMeta = KEYS[slug];
            const keyData = data.keys[slug];
            const hasData = !!keyData;
            let essenceText: string | null = null;
            if (keyData?.bullets?.[0]) {
              const { label, body } = parseBullet(keyData.bullets[0]);
              if (label === 'Essence') essenceText = body;
            }
            return (
              <button
                key={slug}
                onClick={() => hasData && handleKeyClick(slug)}
                disabled={!hasData}
                className={`w-full text-left px-3 py-2 rounded-lg border-l-2 transition-colors ${
                  hasData ? 'hover:bg-white/5 cursor-pointer' : 'cursor-default'
                }`}
                style={{ borderLeftColor: hasData ? meta.color : 'rgba(255,255,255,0.1)' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex-shrink-0 opacity-60">
                    <Image
                      src={keyMeta.icon}
                      alt={keyMeta.name}
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-tight ${hasData ? 'text-gray-300' : 'text-gray-600'}`}>
                      {keyMeta.name}
                    </p>
                    {essenceText && (
                      <p className="text-[10px] text-gray-500 italic mt-0.5 line-clamp-1">
                        {essenceText}
                      </p>
                    )}
                  </div>
                  {hasData && (
                    <span className="text-gray-600 text-xs flex-shrink-0">→</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RADIAL OVERLAY — clipPath sweep, no pointer events */}
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

      {/* BACK — solid background, covers front entirely */}
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
        {/* Header: circle icon + key name + close */}
        <div className="flex items-center gap-3 mb-3 flex-shrink-0">
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

        {/* Category tab buttons */}
        <div className="grid grid-cols-4 gap-1 mb-3 flex-shrink-0">
          {CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-[9px] uppercase tracking-wide font-medium transition-all ${
                  isActive
                    ? 'text-white'
                    : 'border-white/10 text-gray-600 hover:text-gray-400 hover:border-white/20'
                }`}
                style={
                  isActive
                    ? { background: `${meta.color}25`, borderColor: `${meta.color}60` }
                    : {}
                }
              >
                <CategoryIcon category={cat} color={isActive ? meta.color : '#555'} size={11} />
                {cat}
              </button>
            );
          })}
        </div>

        {/* Content output box — one category at a time, no scrollbar */}
        <motion.div
          key={`${activeKeySlug}-${activeCategory}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="flex-1 rounded-xl border p-3 min-h-0"
          style={{
            borderColor: `${meta.color}40`,
            background: `${meta.color}08`,
          }}
        >
          <p className="text-xs text-gray-300 leading-relaxed">
            {activeBulletBody || <span className="text-gray-600 italic">—</span>}
          </p>
        </motion.div>

        {/* Footer: other keys as icon pills */}
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
