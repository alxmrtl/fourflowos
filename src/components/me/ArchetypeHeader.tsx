'use client';

import type { FlowProfileJSON } from '@/types/profile-json';

interface Props {
  profile: FlowProfileJSON;
}

export default function ArchetypeHeader({ profile }: Props) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[rgba(20,20,20,0.8)] px-6 py-5 mb-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
        Your Flow Archetype
      </p>
      <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-4 leading-tight">
        {profile.archetype.name}
      </h2>
      {/* 4-color hairline */}
      <div
        className="h-[3px] mb-4 rounded-full"
        style={{
          background: 'linear-gradient(90deg, #E84535 0%, #4E8C73 33%, #3E6FA3 66%, #6330A0 100%)',
          opacity: 0.7,
        }}
      />
      <p className="text-sm text-gray-300 italic leading-relaxed mb-3">
        {profile.archetype.tagline}
      </p>
      {profile.archetype.framing && (
        <p className="text-sm text-gray-400 leading-relaxed">
          {profile.archetype.framing}
        </p>
      )}
    </div>
  );
}
