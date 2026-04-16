'use client';

/**
 * Flow Lens Profile — V1 Final
 *
 * Visual:   Radial arcs — all elements full brightness, gravity has large glow. No numbers.
 * Framing:  Strong Signal / Weak Signal (fits FourFlow signal language)
 * Practice: MOVES — "worth trying given your wiring"
 */

import Image from 'next/image';
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

// ── Radial arc visual ─────────────────────────────────────────────────────────

const ARC_SIZE  = 68;
const STROKE    = 3;
const R         = (ARC_SIZE / 2) - STROKE - 2;
const CIRC      = 2 * Math.PI * R;

function PillarArc({
  pillar, ratio, isGravity,
}: { pillar: Pillar; ratio: number; isGravity: boolean }) {
  const color = PC[pillar];
  const dash  = Math.max(0.05, ratio) * CIRC;
  const gap   = CIRC - dash;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: ARC_SIZE, height: ARC_SIZE }}>
        {/* Gravity ambient glow */}
        {isGravity && (
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: -10,
              background: `radial-gradient(circle, ${color}40 0%, ${color}18 45%, transparent 70%)`,
              zIndex: 0,
            }}
            animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Arc ring */}
        <svg
          width={ARC_SIZE}
          height={ARC_SIZE}
          className="absolute inset-0"
          style={{ transform: 'rotate(-90deg)', zIndex: 1 }}
        >
          {/* Track */}
          <circle
            cx={ARC_SIZE / 2} cy={ARC_SIZE / 2} r={R}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={STROKE}
          />
          {/* Score arc */}
          <circle
            cx={ARC_SIZE / 2} cy={ARC_SIZE / 2} r={R}
            fill="none"
            stroke={color}
            strokeWidth={isGravity ? STROKE + 1 : STROKE}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            style={{
              filter: isGravity ? `drop-shadow(0 0 5px ${color})` : 'none',
              opacity: isGravity ? 1 : 0.65,
            }}
          />
        </svg>

        {/* Element image — always full opacity */}
        <div
          className="absolute flex items-center justify-center"
          style={{ inset: STROKE + 6, zIndex: 2 }}
        >
          <div className="relative w-full h-full">
            <Image
              src={ELEMENT_SRC[pillar]}
              alt={PL[pillar]}
              fill
              className="object-contain"
              style={{
                filter: isGravity
                  ? `drop-shadow(0 0 14px ${color}) drop-shadow(0 0 6px ${color}cc) drop-shadow(0 0 28px ${color}55)`
                  : 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Label — always legible */}
      <p
        className="text-[9px] font-bold tracking-[0.16em] uppercase leading-none"
        style={{ color: isGravity ? color : `${color}cc` }}
      >
        {PL[pillar]}
      </p>
    </div>
  );
}

// ── Section block (Strong/Weak Signal framing) ────────────────────────────────

function SignalSection({
  strength, pillar, sub, color, bullets,
}: {
  strength: 'STRONG SIGNAL' | 'WEAK SIGNAL';
  pillar: string;
  sub: string;
  color: string;
  bullets: string[];
}) {
  return (
    <div className="relative pl-3">
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
        style={{ background: `${color}50` }}
      />
      <div className="flex items-baseline gap-2 mb-2.5 flex-wrap">
        <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: `${color}80` }}>
          {strength}
        </p>
        <span className="text-xs font-semibold" style={{ color }}>{pillar}</span>
        <span className="text-[10px] text-white/30 hidden sm:inline">{sub}</span>
      </div>
      <ul className="space-y-1.5">
        {bullets.map((b, i) => (
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
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  profile: FlowLensDisplayProfile;
  onRegenerate: () => void;
}

export default function FlowLensProfileV1({ profile, onRegenerate }: Props) {
  const gravity  = profile.gravity_pillar as Pillar;
  const blindSide = profile.blind_side_pillar as Pillar;
  const scores   = profile.profile_json?.pillar_scores ?? { self: 0, space: 0, story: 0, spirit: 0 };
  const maxScore = Math.max(...Object.values(scores), 1);

  const pj = profile.profile_json;
  const gravityBullets  = pj?.gravity_bullets   ?? (pj?.sections?.gravity     ? [pj.sections.gravity]    : []);
  const blindBullets    = pj?.blind_side_bullets ?? (pj?.sections?.blind_side  ? [pj.sections.blind_side] : []);
  const theMove         = pj?.the_move           ?? pj?.sections?.compounding_move ?? '';
  const toolRec         = profile.recommendations?.find(r => r.type === 'tool');
  const techRecs        = profile.recommendations?.filter(r => r.type === 'technique') ?? [];
  const toolPrescription = pj?.tool_prescription ?? '';
  const techPrescriptions = pj?.technique_prescriptions ?? [];

  const generatedDate = new Date(profile.generated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  // Order: gravity first, then others sorted by score desc, blind side last
  const others = (['self', 'space', 'story', 'spirit'] as Pillar[])
    .filter(p => p !== gravity && p !== blindSide)
    .sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const orderedPillars: Pillar[] = [gravity, ...others, blindSide];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-7"
    >
      {/* ── Radial arc signature ── */}
      <div className="grid grid-cols-4 gap-3 py-2">
        {orderedPillars.map(p => (
          <PillarArc
            key={p}
            pillar={p}
            ratio={(scores[p] ?? 0) / maxScore}
            isGravity={p === gravity}
          />
        ))}
      </div>

      {/* ── Strong Signal ── */}
      {gravityBullets.length > 0 && (
        <SignalSection
          strength="STRONG SIGNAL"
          pillar={PL[gravity]}
          sub={PS[gravity]}
          color={PC[gravity]}
          bullets={gravityBullets}
        />
      )}

      {/* ── Weak Signal ── */}
      {blindBullets.length > 0 && (
        <SignalSection
          strength="WEAK SIGNAL"
          pillar={PL[blindSide]}
          sub={PS[blindSide]}
          color={PC[blindSide]}
          bullets={blindBullets}
        />
      )}

      {/* ── The Move ── */}
      {theMove && (
        <div className="relative pl-3">
          <div
            className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
            style={{
              background: `linear-gradient(180deg, ${PC[gravity]}, ${PC[blindSide]})`,
            }}
          />
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/35 mb-2">
            THE MOVE
          </p>
          <p className="text-sm text-white/62 leading-relaxed">{theMove}</p>
        </div>
      )}

      {/* ── Moves ── */}
      {(toolRec || techRecs.length > 0) && (
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/35">MOVES</p>
            <span className="text-[10px] text-white/28">Worth trying given your wiring</span>
          </div>

          <div className="space-y-2">
            {/* Tool */}
            {toolRec && (
              <div
                className="flex items-start gap-3 p-3 rounded-xl border"
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
                <div className="min-w-0">
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
              </div>
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
          Retake →
        </button>
      </div>
    </motion.div>
  );
}
