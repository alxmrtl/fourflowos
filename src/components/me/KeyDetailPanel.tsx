'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import type { DimensionType, KeyType } from '@/types/framework';
import type { FlowProfileJSON } from '@/types/profile-json';
import { KEYS, DIMENSIONS } from '@/data/framework';

interface Props {
  active: { slug: KeyType; dim: DimensionType } | null;
  profile: FlowProfileJSON;
  onClose: () => void;
}

function parseBullet(bullet: string): { label: string; body: string } {
  const colonIdx = bullet.indexOf(': ');
  if (colonIdx > 0) {
    return { label: bullet.slice(0, colonIdx), body: bullet.slice(colonIdx + 2) };
  }
  return { label: '', body: bullet };
}

export default function KeyDetailPanel({ active, profile, onClose }: Props) {
  const isOpen = !!active;

  // Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const keyMeta = active ? KEYS[active.slug] : null;
  const dimMeta = active ? DIMENSIONS[active.dim] : null;
  const keyData = active ? profile.dimensions[active.dim].keys[active.slug] : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />

      {/* Desktop: right panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-[#111] border-l border-white/10 overflow-y-auto
          hidden lg:block transition-transform duration-300 ease-out`}
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <PanelContent
          keyMeta={keyMeta}
          dimMeta={dimMeta}
          keyData={keyData}
          onClose={onClose}
        />
      </div>

      {/* Mobile: bottom sheet */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-50 bg-[#111] border-t border-white/10 overflow-y-auto rounded-t-2xl
          lg:hidden transition-transform duration-300 ease-out`}
        style={{
          height: '70vh',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <PanelContent
          keyMeta={keyMeta}
          dimMeta={dimMeta}
          keyData={keyData}
          onClose={onClose}
        />
      </div>
    </>
  );
}

interface PanelContentProps {
  keyMeta: ReturnType<typeof Object.values<(typeof KEYS)[KeyType]>> extends (infer T)[] ? T : never;
  dimMeta: ReturnType<typeof Object.values<(typeof DIMENSIONS)[DimensionType]>> extends (infer T)[] ? T : never;
  keyData: import('@/types/profile-json').KeyData | null | undefined;
  onClose: () => void;
}

// Simpler typed version
function PanelContent({
  keyMeta,
  dimMeta,
  keyData,
  onClose,
}: {
  keyMeta: (typeof KEYS)[KeyType] | null;
  dimMeta: (typeof DIMENSIONS)[DimensionType] | null;
  keyData: import('@/types/profile-json').KeyData | null | undefined;
  onClose: () => void;
}) {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {keyMeta?.icon && (
            <div className="w-10 h-10 flex-shrink-0">
              <Image
                src={keyMeta.icon}
                alt={keyMeta.name}
                width={40}
                height={40}
                className="object-contain opacity-80"
              />
            </div>
          )}
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-1"
              style={{ color: dimMeta?.color ?? '#888' }}
            >
              {keyMeta?.name}
            </p>
            {dimMeta && (
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: `${dimMeta.color}20`, color: dimMeta.color }}
              >
                {dimMeta.name}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      {keyData ? (
        keyData.bullets && keyData.bullets.length > 0 ? (
          <ul className="space-y-4">
            {keyData.bullets.map((bullet, i) => {
              const { label, body } = parseBullet(bullet);
              return (
                <li key={i} className="text-sm text-gray-300 leading-relaxed">
                  {label && (
                    <span
                      className="block text-[10px] font-semibold tracking-widest uppercase mb-1"
                      style={{ color: dimMeta?.color ?? '#888' }}
                    >
                      {label}
                    </span>
                  )}
                  {body}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="space-y-4">
            {keyData.insight && (
              <p className="text-sm text-gray-300 leading-relaxed">{keyData.insight}</p>
            )}
            {keyData.invitation && (
              <p className="text-xs text-gray-500 italic leading-relaxed">
                ↳ {keyData.invitation}
              </p>
            )}
          </div>
        )
      ) : (
        <p className="text-sm text-gray-600">No data for this key.</p>
      )}

      {/* Legend */}
      {keyData?.bullets && keyData.bullets.length > 0 && (
        <div className="mt-8 pt-4 border-t border-white/5">
          <p className="text-[10px] text-gray-700 uppercase tracking-widest mb-2">Legend</p>
          <div className="grid grid-cols-2 gap-1">
            {['Essence', 'Pattern', 'Block', 'Activation'].map((label) => (
              <span key={label} className="text-[10px] text-gray-700">
                <span className="font-semibold" style={{ color: dimMeta?.color ? `${dimMeta.color}99` : '#666' }}>
                  {label}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
