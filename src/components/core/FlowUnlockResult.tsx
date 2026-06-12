'use client';

/**
 * Flow Unlock result — V5 (Key-level)
 *
 * Layout: bottleneck Key badge → 12-Key pattern strip → pattern read →
 * The Tell → per-Key moves (bottleneck row carries technique + tool).
 * Profiles generated before V5 render through the legacy branch.
 */

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';
import { KEY_CARDS, KEY_BY_ID, type KeyId, type Pillar } from '@/data/flow-unlock-config';
import {
  type FlowLensDisplayProfile,
  ELEMENT_SRC,
  TOOL_ICON,
} from './flow-lens-demo-profile';

const PC: Record<Pillar, string> = { self: CORAL, space: SAGE, story: STEEL, spirit: AMETHYST };
const PL: Record<Pillar, string> = { self: 'SELF', space: 'SPACE', story: 'STORY', spirit: 'SPIRIT' };
const PS: Record<Pillar, string> = {
  self:   'Body · Emotions · Mind',
  space:  'Environment · Tools · Systems',
  story:  'Direction · Mission · Narrative',
  spirit: 'Values · Curiosity · Vision',
};

function isKeyId(v: unknown): v is KeyId {
  return typeof v === 'string' && v in KEY_BY_ID;
}

// ── Bottleneck Key badge ──────────────────────────────────────────────────────

function KeyBadge({ keyId }: { keyId: KeyId }) {
  const card = KEY_BY_ID[keyId];
  const color = PC[card.dimension];
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
          <Image src={ELEMENT_SRC[card.dimension]} alt={PL[card.dimension]} fill className="object-contain" />
        </div>
      </div>
      <div>
        <p className="text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{ color: `${color}80` }}>
          TODAY&apos;S UNLOCK
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-semibold" style={{ color }}>{card.name}</span>
          <span className="text-[10px] text-white/30">{PL[card.dimension]} · {PS[card.dimension]}</span>
        </div>
      </div>
    </div>
  );
}

// ── 12-Key pattern strip ──────────────────────────────────────────────────────
// Overexposed Keys burn hot; the bottleneck pulses as an open ring; the rest rest.

function PatternStrip({ bottleneck, overexposed }: { bottleneck: KeyId; overexposed: KeyId[] }) {
  const dimensions: Pillar[] = ['self', 'space', 'story', 'spirit'];
  return (
    <div>
      <div className="flex items-end gap-4">
        {dimensions.map(dim => (
          <div key={dim} className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              {KEY_CARDS.filter(k => k.dimension === dim).map(k => {
                const color = PC[dim];
                const isHot = overexposed.includes(k.id);
                const isBottleneck = k.id === bottleneck;
                if (isBottleneck) {
                  return (
                    <motion.span
                      key={k.id}
                      title={`${k.name} — the unlock`}
                      className="block w-2.5 h-2.5 rounded-full"
                      style={{ border: `1.5px solid ${color}`, background: 'transparent' }}
                      animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.15, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  );
                }
                return (
                  <span
                    key={k.id}
                    title={isHot ? `${k.name} — where the effort goes` : k.name}
                    className="block rounded-full"
                    style={{
                      width: isHot ? 10 : 7,
                      height: isHot ? 10 : 7,
                      background: isHot ? color : 'rgba(255,255,255,0.10)',
                      boxShadow: isHot ? `0 0 8px ${color}80` : 'none',
                    }}
                  />
                );
              })}
            </div>
            <span className="text-[8px] tracking-widest uppercase text-white/20">{PL[dim]}</span>
          </div>
        ))}
      </div>
      <p className="text-[9px] text-white/25 mt-2.5 leading-relaxed">
        Solid = where your effort keeps going · ring = the gate worth opening
      </p>
    </div>
  );
}

// ── Per-Key move row ──────────────────────────────────────────────────────────

function KeyMoveRow({
  keyId,
  move,
  isBottleneck,
}: {
  keyId: KeyId;
  move: string;
  isBottleneck: boolean;
}) {
  const card = KEY_BY_ID[keyId];
  const color = PC[card.dimension];
  return (
    <div className="flex items-start gap-3">
      <span
        className="flex-shrink-0 mt-[6px] rounded-full"
        style={
          isBottleneck
            ? { width: 9, height: 9, border: `1.5px solid ${color}`, background: 'transparent' }
            : { width: 8, height: 8, background: `${color}90` }
        }
      />
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold" style={{ color: `${color}E0` }}>{card.name}</span>
          {isBottleneck && (
            <span className="text-[9px] uppercase tracking-wider text-white/30">the unlock</span>
          )}
        </div>
        <p className="text-sm text-white/65 leading-snug mt-0.5">{move}</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  profile: FlowLensDisplayProfile;
}

export default function FlowUnlockResult({ profile }: Props) {
  const pj = profile.profile_json;
  const bottleneck = isKeyId(pj?.bottleneck_key) ? pj!.bottleneck_key! : null;

  const generatedDate = new Date(profile.generated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  // ── Legacy (pre-V5) profiles: dimension-level fallback ──
  if (!bottleneck) {
    const blindSide = (profile.blind_side_pillar in PC ? profile.blind_side_pillar : 'self') as Pillar;
    const color = PC[blindSide];
    const bullets = pj?.blind_side_bullets ?? [];
    return (
      <div className="space-y-6 text-white">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-semibold" style={{ color }}>{PL[blindSide]}</span>
          <span className="text-[10px] text-white/30">{PS[blindSide]}</span>
        </div>
        {bullets.length > 0 && (
          <ul className="space-y-1.5">
            {bullets.map((b, i) => (
              <li key={i} className="text-sm text-white/62 leading-snug">{b}</li>
            ))}
          </ul>
        )}
        {pj?.the_tell && <p className="text-sm text-white/60 leading-relaxed italic">{pj.the_tell}</p>}
        {pj?.the_move && <p className="text-sm text-white/70 leading-relaxed">{pj.the_move}</p>}
        <p className="text-[10px] text-white/25">{generatedDate} · earlier format — your next unlock uses the Key-level read</p>
      </div>
    );
  }

  const overexposed = (pj?.overexposed_keys ?? []).filter(isKeyId);
  const patternRead = pj?.pattern_read ?? [];
  const theTell = pj?.the_tell ?? '';
  const keyMoves = (pj?.key_moves ?? []).filter(m => isKeyId(m.key));
  const technique = pj?.technique ?? null;
  const toolRec = profile.recommendations?.find(r => r.type === 'tool');
  const techRec = profile.recommendations?.find(r => r.type === 'technique');
  const toolPrescription = pj?.tool_prescription ?? '';
  const color = PC[KEY_BY_ID[bottleneck].dimension];

  return (
    <motion.div
      // Aperture reveal — the unlock opens like a widening iris
      initial={{ opacity: 0, clipPath: 'circle(10% at 50% 8%)' }}
      animate={{ opacity: 1, clipPath: 'circle(150% at 50% 8%)' }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6 text-white"
    >
      {/* ── Bottleneck Key badge ── */}
      <KeyBadge keyId={bottleneck} />

      {/* ── Pattern strip ── */}
      <PatternStrip bottleneck={bottleneck} overexposed={overexposed} />

      {/* ── Pattern read ── */}
      {patternRead.length > 0 && (
        <div className="relative pl-3">
          <div
            className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
            style={{ background: `${color}45` }}
          />
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-2">
            THE PATTERN
          </p>
          <ul className="space-y-1.5">
            {patternRead.map((b, i) => (
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

      {/* ── Moves ── */}
      {keyMoves.length > 0 && (
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/35">MOVES</p>
            <span className="text-[10px] text-white/28">One per gate — each doable today</span>
          </div>
          <div className="space-y-3">
            {keyMoves.map(m => (
              <KeyMoveRow
                key={m.key}
                keyId={m.key}
                move={m.move}
                isBottleneck={m.key === bottleneck}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Technique + tool for the bottleneck ── */}
      {(technique || toolRec) && (
        <div className="space-y-2">
          {technique && (
            <div
              className="flex items-start gap-3 p-3 rounded-xl border"
              style={{ background: `${color}0d`, borderColor: `${color}28` }}
            >
              <span
                className="flex-shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full"
                style={{ background: `${color}` }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-white">{technique.name}</span>
                  <span
                    className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium"
                    style={{ background: `${color}20`, color }}
                  >
                    Technique
                  </span>
                </div>
                <p className="text-xs text-white/45 leading-snug">{technique.prescription}</p>
              </div>
            </div>
          )}

          {toolRec && (
            <Link
              href={toolRec.route ?? '/me'}
              prefetch={false}
              className="flex items-start gap-3 p-3 rounded-xl border group transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}
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
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
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
          {techRec?.path && (
            <p className="text-[9px] text-white/20 pl-1">{techRec.path}</p>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
        <span className="text-[10px] text-white/25">{generatedDate}</span>
        {pj?.situation && (
          <span className="text-[10px] text-white/20 truncate max-w-[60%]" title={pj.situation}>
            on: “{pj.situation.length > 48 ? `${pj.situation.slice(0, 48)}…` : pj.situation}”
          </span>
        )}
      </div>
    </motion.div>
  );
}
