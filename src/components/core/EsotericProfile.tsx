'use client';

import { motion } from 'framer-motion';
import { AMETHYST, STEEL, CORAL, SAGE } from '@/styles/brand-colors';

interface EsotericProfileData {
  id: string;
  profile_text: string;
  profile_json: {
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
];

export default function EsotericProfile({ profile, onRegenerate }: Props) {
  const sections = profile.profile_json?.sections;

  const generatedDate = new Date(profile.generated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const hasSections = sections && Object.keys(sections).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-7"
    >
      {hasSections ? (
        SECTION_DEFS.map(({ key, label, color }) => {
          const text = sections[key];
          if (!text) return null;
          return (
            <div key={key}>
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
            </div>
          );
        })
      ) : (
        // Fallback: render full text
        <div className="text-sm text-white/50 leading-relaxed whitespace-pre-line">
          {profile.profile_text}
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/20">{generatedDate}</span>
          {profile.profile_json?.sun_sign && (
            <span className="text-[10px] text-white/15">· {profile.profile_json.sun_sign}</span>
          )}
        </div>
        <button
          onClick={onRegenerate}
          className="text-[10px] text-white/25 hover:text-white/50 transition-colors"
        >
          Update →
        </button>
      </div>
    </motion.div>
  );
}
