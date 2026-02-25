'use client';

import { useState } from 'react';
import Link from 'next/link';

const CORAL = '#FF6F61';
const AMETHYST = '#7A4DA4';

interface SessionRow {
  id: string;
  focus_reps: number | null;
  started_at: string | null;
  ended_at: string | null;
}

interface CuriosityData {
  items: unknown[];
  intersections: unknown[];
  updated_at: string | null;
}

interface Props {
  sessions: SessionRow[];
  curiosity: CuriosityData | null;
}

function Dot({ active }: { active: boolean }) {
  return (
    <span className="text-[10px]" style={{ color: active ? '#4ade80' : '#555' }}>
      ●
    </span>
  );
}

export default function SignalStrip({ sessions, curiosity }: Props) {
  const [expanded, setExpanded] = useState<'flowzone' | 'curiosity' | 'flowhabits' | null>(null);

  const totalSessions = sessions.length;
  const totalReps = sessions.reduce((sum, s) => sum + (s.focus_reps ?? 0), 0);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const sessionsThisWeek = sessions.filter(
    (s) => s.started_at && new Date(s.started_at).getTime() > weekAgo
  ).length;
  const itemCount = curiosity?.items?.length ?? 0;
  const intersectionCount = curiosity?.intersections?.length ?? 0;

  const flowzoneActive = totalSessions > 0;
  const curiosityActive = !!curiosity;

  function toggle(id: 'flowzone' | 'curiosity' | 'flowhabits') {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <div
      className="mb-10 rounded-xl border border-white/8 overflow-hidden"
      style={{ background: 'rgba(16,16,16,0.8)' }}
    >
      {/* Pill row */}
      <div className="flex items-stretch divide-x divide-white/8">
        {/* FlowZone pill */}
        <button
          onClick={() => toggle('flowzone')}
          className="flex-1 flex items-center gap-2 px-4 py-3 text-left hover:bg-white/4 transition-colors min-w-0"
        >
          <Dot active={flowzoneActive} />
          <span className="text-xs font-medium text-gray-300 truncate">FlowZone</span>
          {flowzoneActive && (
            <span className="text-xs text-gray-500 truncate hidden sm:inline">
              {totalSessions} sessions · {totalReps} reps · {sessionsThisWeek} this week
            </span>
          )}
          {!flowzoneActive && (
            <span className="text-xs text-gray-600 truncate hidden sm:inline">no data</span>
          )}
        </button>

        {/* Curiosity pill */}
        <button
          onClick={() => toggle('curiosity')}
          className="flex-1 flex items-center gap-2 px-4 py-3 text-left hover:bg-white/4 transition-colors min-w-0"
        >
          <Dot active={curiosityActive} />
          <span className="text-xs font-medium text-gray-300 truncate">Curiosity</span>
          {curiosityActive && (
            <span className="text-xs text-gray-500 truncate hidden sm:inline">
              {itemCount} items · {intersectionCount} intersections
            </span>
          )}
          {!curiosityActive && (
            <span className="text-xs text-gray-600 truncate hidden sm:inline">no data</span>
          )}
        </button>

        {/* FlowHabits pill */}
        <button
          onClick={() => toggle('flowhabits')}
          className="flex-1 flex items-center gap-2 px-4 py-3 text-left hover:bg-white/4 transition-colors min-w-0"
        >
          <Dot active={false} />
          <span className="text-xs font-medium text-gray-600 truncate">FlowHabits</span>
          <span className="text-xs text-gray-700 truncate hidden sm:inline">iOS coming soon</span>
        </button>
      </div>

      {/* Expanded panels */}
      {expanded === 'flowzone' && (
        <div className="border-t border-white/8 px-4 py-4">
          {flowzoneActive ? (
            <div className="flex items-center gap-8">
              <div>
                <div className="text-xl font-bold" style={{ color: CORAL }}>{totalSessions}</div>
                <div className="text-[11px] text-gray-500">sessions</div>
              </div>
              <div>
                <div className="text-xl font-bold" style={{ color: CORAL }}>{totalReps}</div>
                <div className="text-[11px] text-gray-500">focus reps</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">{sessionsThisWeek}</div>
                <div className="text-[11px] text-gray-500">this week</div>
              </div>
              <Link
                href="/tools/flowzone"
                className="ml-auto text-xs text-gray-500 hover:text-white transition-colors"
              >
                Open →
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">No sessions yet. Complete your first session to start building your signal.</p>
              <Link href="/tools/flowzone" className="text-xs text-gray-500 hover:text-white transition-colors ml-4">
                Open FlowZone →
              </Link>
            </div>
          )}
        </div>
      )}

      {expanded === 'curiosity' && (
        <div className="border-t border-white/8 px-4 py-4">
          {curiosityActive ? (
            <div className="flex items-center gap-8">
              <div>
                <div className="text-xl font-bold" style={{ color: AMETHYST }}>{itemCount}</div>
                <div className="text-[11px] text-gray-500">curiosities</div>
              </div>
              <div>
                <div className="text-xl font-bold" style={{ color: AMETHYST }}>{intersectionCount}</div>
                <div className="text-[11px] text-gray-500">intersections</div>
              </div>
              <Link
                href="/tools/curiosity-explorer"
                className="ml-auto text-xs text-gray-500 hover:text-white transition-colors"
              >
                Open →
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Map your curiosities to feed your SPIRIT signal.</p>
              <Link href="/tools/curiosity-explorer" className="text-xs text-gray-500 hover:text-white transition-colors ml-4">
                Open Curiosity Map →
              </Link>
            </div>
          )}
        </div>
      )}

      {expanded === 'flowhabits' && (
        <div className="border-t border-white/8 px-4 py-4">
          <p className="text-sm text-gray-600">
            iOS integration coming soon. Your daily habit completions will feed this signal automatically.
          </p>
        </div>
      )}
    </div>
  );
}
