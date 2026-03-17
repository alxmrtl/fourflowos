'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { KeyType } from '@/types/framework';
import type { KeyData } from '@/types/profile-json';
import { KEYS } from '@/data/framework';

interface Props {
  keySlug: KeyType;
  data: KeyData;
  accentColor: string;
  isLast?: boolean;
}

export default function KeyReveal({ keySlug, data, accentColor, isLast }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const keyMeta = KEYS[keySlug];
  const fallbackInsight = keyMeta?.coreInsight ?? '';
  const stem = keyMeta?.layupStem ?? null;

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
      }}
    >
      <div className="flex items-start gap-3 py-5">
        {/* Key icon — smaller */}
        <div className="w-8 h-8 flex-shrink-0 mt-0.5">
          {keyMeta?.icon ? (
            <Image
              src={keyMeta.icon}
              alt={keyMeta.name}
              width={32}
              height={32}
              className="object-contain opacity-60"
            />
          ) : (
            <div className="w-8 h-8 rounded-full border border-white/15" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Key name label */}
          <p
            className="text-[10px] font-semibold tracking-widest uppercase mb-2.5"
            style={{ color: accentColor }}
          >
            {keyMeta?.name ?? keySlug}
          </p>

          {/* Stem + personal_key as completion */}
          {data.personal_key && stem ? (
            <div
              className="rounded-lg px-3 py-2.5 mb-3"
              style={{
                background: `${accentColor}08`,
                borderLeft: `2px solid ${accentColor}35`,
              }}
            >
              <p className="text-[11px] text-gray-500 italic leading-snug mb-1.5">
                {stem}
              </p>
              <p className="text-[12px] font-medium leading-snug" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {data.personal_key}
              </p>
            </div>
          ) : data.personal_key ? (
            <p className="text-[12px] font-medium leading-snug mb-3 italic" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {data.personal_key}
            </p>
          ) : null}

          {/* Insight */}
          <p className="text-[12px] text-gray-400 leading-relaxed">
            {data.insight || fallbackInsight}
          </p>
        </div>
      </div>

      {!isLast && (
        <div className="h-px ml-11" style={{ background: 'rgba(255,255,255,0.04)' }} />
      )}
    </div>
  );
}
