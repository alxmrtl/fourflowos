'use client';

import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';

/**
 * The Team Conditions Map — the Diagnostic's signature one-page artifact,
 * rendered for the web. Data below is the fictional "Relay" engagement
 * (OFFERS/team-conditions-diagnostic/sample-report.md); every rendering
 * must keep the FICTIONAL labeling — the honest-proof posture is the pitch.
 *
 * Buyer register: layers are People / Tools & Systems / Direction / Values;
 * conditions carry canonical Key names + "i.e." glosses (lexicon amendment,
 * Jul 9 2026).
 */

export type CellStatus = 'working' | 'strained' | 'blocked' | 'notread';

export interface ConditionCell {
  name: string;
  gloss: string;
  status: CellStatus;
  note: string;
  bottleneck?: boolean;
}

export interface ConditionLayer {
  label: string;
  sub: string;
  color: string;
  cells: ConditionCell[];
}

export const RELAY_LAYERS: ConditionLayer[] = [
  {
    label: 'People',
    sub: 'how the humans are doing',
    color: CORAL,
    cells: [
      { name: 'Tuned Emotions', gloss: 'emotional bandwidth', status: 'working', note: 'Working · Confirmed' },
      { name: 'Focused Body', gloss: 'energy, recovery, sustained focus', status: 'notread', note: 'Not read' },
      { name: 'Open Mind', gloss: 'cognitive load, mental flexibility', status: 'notread', note: 'Not read' },
    ],
  },
  {
    label: 'Tools & Systems',
    sub: 'what the work runs on',
    color: SAGE,
    cells: [
      { name: 'Intentional Space', gloss: 'focus protection', status: 'notread', note: 'Not read' },
      { name: 'Optimized Tools', gloss: 'tool fit & friction', status: 'working', note: 'Working · Confirmed' },
      {
        name: 'Feedback Systems',
        gloss: 'signal loops',
        status: 'blocked',
        note: 'Blocked · Confirmed — the bottleneck',
        bottleneck: true,
      },
    ],
  },
  {
    label: 'Direction',
    sub: 'where the work is pointed',
    color: STEEL,
    cells: [
      { name: 'Generative Story', gloss: 'the team narrative', status: 'strained', note: 'Strained · downstream' },
      { name: 'Clear Mission', gloss: 'mission clarity', status: 'strained', note: 'Strained · downstream' },
      { name: 'Empowered Role', gloss: 'role ownership', status: 'notread', note: 'Not read' },
    ],
  },
  {
    label: 'Values',
    sub: "what's underneath",
    color: AMETHYST,
    cells: [
      { name: 'Grounding Values', gloss: 'values congruence', status: 'notread', note: 'Not read' },
      { name: 'Ignited Curiosity', gloss: 'real engagement', status: 'working', note: 'Working · Confirmed' },
      { name: 'Visualized Vision', gloss: 'shared vision', status: 'notread', note: 'Not read' },
    ],
  },
];

/** ● / ◐ / ○ / — as CSS, themable for dark ground or ivory paper. */
export function StatusGlyph({ status, ink }: { status: CellStatus; ink: string }) {
  const base: React.CSSProperties = {
    width: 13,
    height: 13,
    borderRadius: '50%',
    flexShrink: 0,
    display: 'inline-block',
  };
  if (status === 'working') return <span style={{ ...base, background: ink }} />;
  if (status === 'strained')
    return (
      <span
        style={{
          ...base,
          border: `1.5px solid ${ink}`,
          background: `linear-gradient(90deg, ${ink} 50%, transparent 50%)`,
        }}
      />
    );
  if (status === 'blocked') return <span style={{ ...base, border: `1.5px solid ${ink}` }} />;
  return (
    <span style={{ ...base, position: 'relative' }} aria-hidden>
      <span
        style={{
          position: 'absolute',
          left: '18%',
          top: 'calc(50% - 0.5px)',
          width: '64%',
          height: 1,
          background: ink,
          opacity: 0.5,
        }}
      />
    </span>
  );
}

export function MapLegend({ ink, dim }: { ink: string; dim: string }) {
  const items: { status: CellStatus; label: string }[] = [
    { status: 'working', label: 'Working' },
    { status: 'strained', label: 'Strained' },
    { status: 'blocked', label: 'Blocked' },
    { status: 'notread', label: 'Not read — marked honestly, not guessed at' },
  ];
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {items.map((it) => (
        <span key={it.status} className="flex items-center gap-2 text-[11px] uppercase tracking-wider" style={{ color: dim }}>
          <StatusGlyph status={it.status} ink={ink} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

/**
 * The full 12-condition grid under the four layer labels.
 * theme "dark" renders on the site's ground; theme "paper" renders on ivory
 * (used inside the sample-report sheets).
 */
export default function ConditionsMap({ theme = 'dark' }: { theme?: 'dark' | 'paper' }) {
  const paper = theme === 'paper';
  const ink = paper ? '#333333' : 'rgba(255,255,255,0.92)';
  const dim = paper ? 'rgba(51,51,51,0.65)' : 'rgba(255,255,255,0.5)';
  const faint = paper ? 'rgba(51,51,51,0.12)' : 'rgba(255,255,255,0.08)';

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {RELAY_LAYERS.map((layer) => (
          <div key={layer.label} className="pt-3" style={{ borderTop: `3px solid ${layer.color}` }}>
            <p
              className="text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: paper ? layer.color : layer.color }}
            >
              {layer.label}
            </p>
            <p className="font-display italic text-sm mb-3" style={{ color: dim }}>
              {layer.sub}
            </p>
            <div className="space-y-1.5">
              {layer.cells.map((cell) => (
                <div
                  key={cell.name}
                  className="flex items-start gap-2.5 rounded-lg px-2.5 py-2"
                  style={
                    cell.bottleneck
                      ? {
                          border: `1px solid ${layer.color}`,
                          background: paper ? 'rgba(78,140,115,0.10)' : `${layer.color}14`,
                        }
                      : { border: `1px solid ${faint}` }
                  }
                >
                  <span className="mt-[3px]">
                    <StatusGlyph status={cell.status} ink={ink} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold leading-snug" style={{ color: ink }}>
                      {cell.name}
                    </span>
                    <span className="block font-display italic text-[13px] leading-snug" style={{ color: dim }}>
                      i.e., {cell.gloss}
                    </span>
                    <span
                      className="block text-[9.5px] font-bold uppercase tracking-[0.12em] mt-0.5"
                      style={{ color: cell.bottleneck ? layer.color : dim }}
                    >
                      {cell.note}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <MapLegend ink={ink} dim={dim} />
      </div>
    </div>
  );
}
