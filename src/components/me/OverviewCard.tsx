'use client';

import type { OverviewData } from '@/types/profile-json';

interface Props {
  overview: OverviewData;
}

function SignalList({ label, color, items }: { label: string; color: string; items: string[] }) {
  return (
    <div>
      <p className={`text-[10px] font-bold tracking-widest mb-1.5 ${color}`}>{label}</p>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <p key={i} className="text-sm text-gray-400 leading-relaxed">{item}</p>
        ))}
      </div>
    </div>
  );
}

export default function OverviewCard({ overview }: Props) {
  const flow = overview.flow ?? [];
  const friction = overview.friction ?? [];
  const legacyKeys = overview.keys ?? [];

  const hasNew = flow.length > 0 || friction.length > 0;

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[rgba(20,20,20,0.8)] px-5 py-4 mb-4">
      <p className="text-sm font-semibold text-white leading-snug mb-4">{overview.headline}</p>

      {hasNew ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {flow.length > 0 && (
            <SignalList label="FLOW" color="text-[#4E8C73]" items={flow} />
          )}
          {friction.length > 0 && (
            <SignalList label="FRICTION" color="text-[#E84535]" items={friction} />
          )}
        </div>
      ) : legacyKeys.length > 0 ? (
        <div className="space-y-1.5">
          {legacyKeys.map((key, i) => (
            <p key={i} className="text-sm text-gray-400 leading-relaxed">{key}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
