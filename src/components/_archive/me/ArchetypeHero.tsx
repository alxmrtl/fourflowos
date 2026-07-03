'use client';

import Image from 'next/image';
import type { FlowProfileJSON } from '@/types/profile-json';
import type { DimensionType } from '@/types/framework';
import { DIMENSIONS } from '@/data/framework';
import { GRADIENTS } from '@/styles/brand-colors';

const DIMENSION_ORDER: DimensionType[] = ['self', 'space', 'story', 'spirit'];

interface Props {
  profile: FlowProfileJSON;
}

function DimensionSummaryCard({ dim, profile }: { dim: DimensionType; profile: FlowProfileJSON }) {
  const meta = DIMENSIONS[dim];
  const data = profile.dimensions[dim];

  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl border border-white/8"
      style={{ background: `${meta.color}08` }}
    >
      <div className="w-9 h-9 flex-shrink-0 mt-0.5">
        <Image
          src={meta.sectionLogo}
          alt={meta.name}
          width={36}
          height={36}
          className="object-contain opacity-80"
        />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold tracking-widest uppercase mb-1" style={{ color: meta.color }}>
          {meta.name}
        </p>
        <p className="text-xs text-gray-400 leading-relaxed">{data.summary}</p>
      </div>
    </div>
  );
}

export default function ArchetypeHero({ profile }: Props) {
  return (
    <div className="mb-10">
      {/* Archetype name */}
      <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-gray-600 mb-3">
        Flow Archetype
      </p>
      <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-white mb-5 leading-tight">
        {profile.archetype.name}
      </h2>

      {/* 4-color hairline */}
      <div
        className="h-px mb-6 rounded-full"
        style={{
          background: GRADIENTS.fourPillar,
          opacity: 0.6,
        }}
      />

      {/* Tagline */}
      <p className="text-base text-gray-300 italic mb-5 leading-relaxed">
        {profile.archetype.tagline}
      </p>

      {/* Framing */}
      <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-2xl">
        {profile.archetype.framing}
      </p>

      {/* 2×2 dimension summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DIMENSION_ORDER.map((dim) => (
          <DimensionSummaryCard key={dim} dim={dim} profile={profile} />
        ))}
      </div>
    </div>
  );
}
