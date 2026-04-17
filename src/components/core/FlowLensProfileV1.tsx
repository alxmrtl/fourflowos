'use client';

/**
 * Flow Unlock Profile — V4
 *
 * Layout: Bottleneck area badge → potential unlock bullets → The Tell → Your Unlock → Moves
 * No radial arcs. No gravity section. Focus is entirely on what's blocking + what to do.
 */

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';
import {
  type FlowLensDisplayProfile,
  ELEMENT_SRC,
  TOOL_ICON,
} from './flow-lens-demo-profile';

type Pillar = 'self' | 'space' | 'story' | 'spirit';

const PC: Record<Pillar, string> = { self: CORAL, space: SAGE, story: STEEL, spirit: AMETHYST };
const PL: Record<Pillar, string> = { self: 'SELF', space: 'SPACE', story: 'STORY', spirit: 'SPIRIT' };
const PS: Record<Pillar, string> = {
  self:   'Body · Emotions · Mind',
  space:  'Environment · Tools · Systems',
  story:  'Direction · Mission · Narrative',
  spirit: 'Values · Curiosity · Vision',
};

// ── Bottleneck area badge ─────────────────────────────────────────────────────

function BottleneckBadge({ pillar }: { pillar: Pillar }) {
  const color = PC[pillar];
  return (
    <div className="flex items-center gap-3">
      <div
        className="relative flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
        style={{
          width: 44, height: 44,
          background: `${color}14`,
          border: `1px solid ${color}30`,
        }}
      >
        <div className="relative w-6 h-6">
          <Image src={ELEMENT_SRC[pillar]} alt={PL[pillar]} fill className="object-contain" />
        </div>
      </div>
      <div>
        <p className="text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{ color: `${color}80` }}>
          LIKELY UNLOCK AREA
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-semibold" style={{ color }}>{PL[pillar]}</span>
          <span className="text-[10px] text-white/30">{PS[pillar]}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  profile: FlowLensDisplayProfile;
  onRegenerate: () => void;
}

export default function FlowLensProfileV1({ profile, onRegenerate }: Props) {
  const blindSide = profile.blind_side_pillar as Pillar;

  const pj = profile.profile_json;
  const blindBullets     = pj?.blind_side_bullets ?? (pj?.sections?.blind_side ? [pj.sections.blind_side] : []);
  const theTell          = pj?.the_tell ?? '';
  const theMove          = pj?.the_move ?? pj?.sections?.compounding_move ?? '';
  const toolRec          = profile.recommendations?.find(r => r.type === 'tool');
  const techRecs         = profile.recommendations?.filter(r => r.type === 'technique') ?? [];
  const toolPrescription = pj?.tool_prescription ?? '';
  const techPrescriptions = pj?.technique_prescriptions ?? [];
  const conceptRec       = pj?.concept_prescription ?? null;

  const generatedDate = new Date(profile.generated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const color = PC[blindSide];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 text-white"
    >
      {/* ── Bottleneck area badge ── */}
      <BottleneckBadge pillar={blindSide} />

      {/* ── Potential unlock bullets ── */}
      {blindBullets.length > 0 && (
        <div className="relative pl-3">
          <div
            className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
            style={{ background: `${color}45` }}
          />
          <p className="text-[9px] text-white/25 mb-3 leading-relaxed">
            Based on your signals — a direction to test, not a verdict
          </p>
          <ul className="space-y-1.5">
            {blindBullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className="flex-shrink-0 mt-[7px] w-1 h-1 rounded-full"
                  style={{ background: `${color}65` }}
                />
                <span className="text-sm text-white/62 leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── The Tell ── */}
      {theTell && (
        <div className="relative pl-3">
          <div
            className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
            style={{ background: `${color}35` }}
          />
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-2">
            THE TELL
          </p>
          <p className="text-sm text-white/60 leading-relaxed italic">{theTell}</p>
        </div>
      )}

      {/* ── Your Unlock ── */}
      {theMove && (
        <div className="relative pl-3">
          <div
            className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
            style={{ background: color }}
          />
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/35 mb-2">
            YOUR UNLOCK
          </p>
          <p className="text-sm text-white/70 leading-relaxed">{theMove}</p>
        </div>
      )}

      {/* ── Moves ── */}
      {(toolRec || techRecs.length > 0 || conceptRec) && (
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/35">MOVES</p>
            <span className="text-[10px] text-white/28">Worth trying given your wiring</span>
          </div>

          <div className="space-y-2">
            {/* Tool */}
            {toolRec && (
              <Link
                href={toolRec.route ?? '/me'}
                prefetch={false}
                className="flex items-start gap-3 p-3 rounded-xl border group transition-opacity hover:opacity-80"
                style={{
                  background: `${PC[blindSide]}0d`,
                  borderColor: `${PC[blindSide]}28`,
                }}
              >
                <div className="relative flex-shrink-0 mt-0.5" style={{ width: 28, height: 28 }}>
                  <Image
                    src={TOOL_ICON[toolRec.title] ?? '/assets/apps/flowzone-icon.png'}
                    alt={toolRec.title}
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-white">{toolRec.title}</span>
                    <span
                      className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium"
                      style={{
                        background: `${PC[blindSide]}20`,
                        color: PC[blindSide],
                      }}
                    >
                      Tool
                    </span>
                  </div>
                  {toolPrescription && (
                    <p className="text-xs text-white/45 leading-snug">{toolPrescription}</p>
                  )}
                </div>
                <span className="flex-shrink-0 self-center text-white/25 group-hover:text-white/55 transition-colors text-xs">→</span>
              </Link>
            )}

            {/* Techniques */}
            {techRecs.map((rec, i) => {
              const tp = techPrescriptions[i];
              return (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full"
                    style={{ background: `${PC[blindSide]}65` }}
                  />
                  <div>
                    <span className="text-sm text-white/75 font-medium">{rec.title}</span>
                    {tp?.prescription && (
                      <p className="text-xs text-white/40 leading-snug mt-0.5">{tp.prescription}</p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Concept */}
            {conceptRec && (
              <div
                className="flex items-start gap-3 mt-1 pt-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                <span
                  className="flex-shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full opacity-40"
                  style={{ background: `${PC[blindSide]}` }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/75 font-medium">{conceptRec.name}</span>
                    <span
                      className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.35)',
                      }}
                    >
                      Concept
                    </span>
                  </div>
                  <p className="text-xs text-white/40 leading-snug mt-0.5">{conceptRec.why}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
        <span className="text-[10px] text-white/25">{generatedDate}</span>
        <button
          onClick={onRegenerate}
          className="text-[10px] text-white/30 hover:text-white/55 transition-colors"
        >
          Stuck again? Retake →
        </button>
      </div>
    </motion.div>
  );
}
