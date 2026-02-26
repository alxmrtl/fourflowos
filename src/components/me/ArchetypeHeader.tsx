'use client';

import type { FlowProfileJSON } from '@/types/profile-json';

interface Props {
  profile: FlowProfileJSON;
}

export default function ArchetypeHeader({ profile }: Props) {
  return (
    <div className="mb-8">
      <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-gray-600 mb-2">
        Flow Archetype
      </p>
      <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-white mb-4 leading-tight">
        {profile.archetype.name}
      </h2>
      {/* 4-color hairline */}
      <div
        className="h-[3px] mb-4 rounded-full"
        style={{
          background: 'linear-gradient(90deg, #FF6F61 0%, #6BA292 33%, #5B84B1 66%, #7A4DA4 100%)',
          opacity: 0.7,
        }}
      />
      <p className="text-sm text-gray-300 italic leading-relaxed">
        {profile.archetype.tagline}
      </p>
    </div>
  );
}
