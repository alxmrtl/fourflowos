'use client';

import { motion } from 'framer-motion';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';

type Pillar = 'self' | 'space' | 'story' | 'spirit';

interface Recommendation {
  type: 'technique' | 'tool';
  title: string;
  pillar: string;
  path?: string;
}

interface FlowLensProfileData {
  id: string;
  gravity_pillar: string;
  blind_side_pillar: string;
  profile_text: string;
  profile_json: {
    gravity?: string;
    blind_side?: string;
    pillar_scores?: Record<string, number>;
    sections?: Record<string, string>;
  } | null;
  recommendations: Recommendation[] | null;
  generated_at: string;
}

const PILLAR_COLORS: Record<string, string> = {
  self: CORAL, space: SAGE, story: STEEL, spirit: AMETHYST,
};

const PILLAR_LABELS: Record<string, string> = {
  self: 'SELF', space: 'SPACE', story: 'STORY', spirit: 'SPIRIT',
};

const PILLAR_SUBTITLES: Record<string, string> = {
  self:   'Body · Emotions · Mind',
  space:  'Environment · Tools · Systems',
  story:  'Direction · Mission · Narrative',
  spirit: 'Values · Curiosity · Vision',
};

interface Props {
  profile: FlowLensProfileData;
  onRegenerate: () => void;
}

export default function FlowLensProfile({ profile, onRegenerate }: Props) {
  const sections = profile.profile_json?.sections;
  const gravity = profile.gravity_pillar as Pillar;
  const blindSide = profile.blind_side_pillar as Pillar;
  const gravityColor = PILLAR_COLORS[gravity] ?? AMETHYST;
  const blindColor = PILLAR_COLORS[blindSide] ?? STEEL;

  const generatedDate = new Date(profile.generated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-7"
    >
      {/* Pillar summary bar */}
      <div className="flex gap-2">
        {(['self', 'space', 'story', 'spirit'] as Pillar[]).map(p => {
          const isGravity = p === gravity;
          const isBlind = p === blindSide;
          const color = PILLAR_COLORS[p];
          const score = profile.profile_json?.pillar_scores?.[p] ?? 0;

          return (
            <div key={p} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full h-1 rounded-full transition-all"
                style={{
                  background: color,
                  opacity: isGravity ? 1 : isBlind ? 0.2 : 0.4,
                }}
              />
              <span
                className="text-[9px] font-bold tracking-widest uppercase"
                style={{ color: isGravity ? color : isBlind ? `${color}50` : `${color}70` }}
              >
                {PILLAR_LABELS[p]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Gravity */}
      {sections?.gravity ? (
        <ProfileSection
          label="YOUR GRAVITY"
          pillar={PILLAR_LABELS[gravity]}
          subtitle={PILLAR_SUBTITLES[gravity]}
          color={gravityColor}
          text={sections.gravity}
        />
      ) : null}

      {/* Blind Side */}
      {sections?.blind_side ? (
        <ProfileSection
          label="YOUR BLIND SIDE"
          pillar={PILLAR_LABELS[blindSide]}
          subtitle={PILLAR_SUBTITLES[blindSide]}
          color={blindColor}
          text={sections.blind_side}
        />
      ) : null}

      {/* Compounding Move */}
      {sections?.compounding_move ? (
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/25 mb-2">
            THE COMPOUNDING MOVE
          </p>
          <p className="text-sm text-white/55 leading-relaxed">{sections.compounding_move}</p>
        </div>
      ) : null}

      {/* Practices */}
      {(profile.recommendations && profile.recommendations.length > 0) || sections?.practices ? (
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/25 mb-3">
            PRACTICES
          </p>
          {profile.recommendations && profile.recommendations.length > 0 ? (
            <div className="space-y-2">
              {profile.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                    style={{ background: PILLAR_COLORS[rec.pillar] ?? AMETHYST }}
                  />
                  <div>
                    <span className="text-sm text-white/70 font-medium">{rec.title}</span>
                    {rec.type === 'tool' && (
                      <span className="text-[10px] text-white/25 ml-2 uppercase tracking-wider">Tool</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : sections?.practices ? (
            <p className="text-sm text-white/55 leading-relaxed whitespace-pre-line">{sections.practices}</p>
          ) : null}
        </div>
      ) : null}

      {/* Fallback: full text if no structured sections */}
      {!sections?.gravity && profile.profile_text && (
        <div className="text-sm text-white/50 leading-relaxed whitespace-pre-line">
          {profile.profile_text}
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
        <span className="text-[10px] text-white/20">{generatedDate}</span>
        <button
          onClick={onRegenerate}
          className="text-[10px] text-white/25 hover:text-white/50 transition-colors"
        >
          Retake →
        </button>
      </div>
    </motion.div>
  );
}

function ProfileSection({
  label, pillar, subtitle, color, text,
}: {
  label: string; pillar: string; subtitle: string; color: string; text: string;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: `${color}80` }}>
          {label}
        </p>
        <span className="text-xs font-semibold" style={{ color }}>
          {pillar}
        </span>
        <span className="text-[10px] text-white/20">{subtitle}</span>
      </div>
      <p className="text-sm text-white/55 leading-relaxed">{text}</p>
    </div>
  );
}
