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

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
      }}
    >
      <div className="flex items-start gap-4 py-6">
        <div className="w-12 h-12 flex-shrink-0">
          {keyMeta?.icon ? (
            <Image
              src={keyMeta.icon}
              alt={keyMeta.name}
              width={48}
              height={48}
              className="object-contain opacity-75"
            />
          ) : (
            <div className="w-12 h-12 rounded-full border border-white/15" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-[11px] font-semibold tracking-widest uppercase mb-3"
            style={{ color: accentColor }}
          >
            {keyMeta?.name ?? keySlug}
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            {data.insight || fallbackInsight}
          </p>
        </div>
      </div>

      {!isLast && (
        <div className="h-px ml-16" style={{ background: 'rgba(255,255,255,0.05)' }} />
      )}
    </div>
  );
}
