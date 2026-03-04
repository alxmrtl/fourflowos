'use client';

import type { OverviewData } from '@/types/profile-json';

interface Props {
  overview: OverviewData;
}

export default function OverviewCard({ overview }: Props) {
  const keys = Array.isArray(overview.keys) ? overview.keys : [];
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[rgba(20,20,20,0.8)] px-5 py-4 mb-4">
      <p className="text-base font-medium text-white leading-snug mb-3">{overview.headline}</p>
      {keys.length > 0 && (
        <div className="space-y-1.5">
          {keys.map((key, i) => (
            <p key={i} className="text-sm text-gray-400 leading-relaxed">{key}</p>
          ))}
        </div>
      )}
    </div>
  );
}
