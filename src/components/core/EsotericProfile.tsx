'use client';

import { motion } from 'framer-motion';
import { AMETHYST, STEEL, CORAL, SAGE } from '@/styles/brand-colors';

interface EsotericProfileData {
  id: string;
  profile_text: string;
  profile_json: {
    archetype?: string;
    epigraph?: string;
    sections?: Record<string, string>;
    sun_sign?: string;
    has_chart?: boolean;
  } | null;
  generated_at: string;
}

interface Props {
  profile: EsotericProfileData;
  onRegenerate: () => void;
}

const SECTION_DEFS = [
  { key: 'name_signal',       label: 'NAME SIGNAL',       color: CORAL },
  { key: 'birth_code',        label: 'BIRTH CODE',        color: SAGE },
  { key: 'natal_pattern',     label: 'NATAL PATTERN',     color: STEEL },
  { key: 'flow_architecture', label: 'FLOW ARCHITECTURE', color: AMETHYST },
  { key: 'true_north',        label: 'TRUE NORTH',        color: AMETHYST },
];

export default function EsotericProfile({ profile, onRegenerate }: Props) {
  const pj = profile.profile_json;
  const sections = pj?.sections;
  const archetype = pj?.archetype;
  const epigraph = pj?.epigraph;

  const generatedDate = new Date(profile.generated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const hasSections = sections && Object.keys(sections).length > 0;

  // Staged reveal: the crown materializes first, then the layers cascade in.
  const crownDelay = 0.15;
  const firstSectionDelay = archetype ? 1.3 : 0.1;
  const sectionStagger = 0.55;

  return (
    <div className="space-y-7">
      {/* ── Archetype crown ── */}
      {archetype && (
        <div className="text-center pt-2 pb-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: crownDelay }}
            className="flex items-center justify-center gap-3 mb-3"
            aria-hidden="true"
          >
            <span className="h-px w-8" style={{ background: `${AMETHYST}50` }} />
            <span className="text-[10px]" style={{ color: `${AMETHYST}90` }}>✦</span>
            <span className="h-px w-8" style={{ background: `${AMETHYST}50` }} />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, letterSpacing: '0.35em' }}
            animate={{ opacity: 1, letterSpacing: '0.12em' }}
            transition={{ duration: 1.4, delay: crownDelay, ease: [0.22, 1, 0.36, 1] }}
            className="text-base font-semibold uppercase text-white/90"
          >
            {archetype}
          </motion.h3>
          {epigraph && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: crownDelay + 0.7 }}
              className="text-[13px] text-white/40 italic mt-2 max-w-sm mx-auto leading-relaxed"
            >
              “{epigraph}”
            </motion.p>
          )}
        </div>
      )}

      {/* ── The layers ── */}
      {hasSections ? (
        SECTION_DEFS.map(({ key, label, color }, i) => {
          const text = sections[key];
          if (!text) return null;
          const isTrueNorth = key === 'true_north';
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: firstSectionDelay + i * sectionStagger + (isTrueNorth ? 0.3 : 0),
                ease: 'easeOut',
              }}
              className={isTrueNorth ? 'rounded-xl border p-4' : undefined}
              style={isTrueNorth ? { borderColor: `${AMETHYST}30`, background: `${AMETHYST}0a` } : undefined}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-0.5 h-4 rounded-full" style={{ background: color }} />
                <p
                  className="text-[10px] font-bold tracking-widest uppercase"
                  style={{ color: `${color}90` }}
                >
                  {label}
                </p>
              </div>
              <p className="text-sm text-white/55 leading-relaxed pl-2.5">{text}</p>
            </motion.div>
          );
        })
      ) : (
        // Fallback: render full text
        <div className="text-sm text-white/50 leading-relaxed whitespace-pre-line">
          {profile.profile_text}
        </div>
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: firstSectionDelay + SECTION_DEFS.length * sectionStagger }}
        className="pt-4 border-t border-white/[0.05] flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/20">{generatedDate}</span>
          {pj?.sun_sign && (
            <span className="text-[10px] text-white/15">· {pj.sun_sign}</span>
          )}
        </div>
        <button
          onClick={onRegenerate}
          className="text-[10px] text-white/25 hover:text-white/50 transition-colors"
        >
          Details wrong? Redraw →
        </button>
      </motion.div>
    </div>
  );
}
