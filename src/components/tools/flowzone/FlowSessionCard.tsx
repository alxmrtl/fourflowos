'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Priority, FlowSettings } from './types';
import { SAGE, AMETHYST, CORAL, FOUR_PILLAR_GRADIENT, BREATHWORK_PATTERNS, AUDIO_OPTIONS } from './constants';
import { BreathworkIcons, AudioIcons } from './icons';

interface FlowSessionCardProps {
  priority: Priority;
  settings: FlowSettings;
  onStart: () => void;
}

function getAudioLabel(s: FlowSettings): string {
  if (s.audioSource === 'none') return 'Silence';
  if (s.audioSource === 'yt-custom') return 'Custom';
  return AUDIO_OPTIONS.find(o => o.id === s.audioSource)?.title ?? 'Audio';
}

function getBreathworkLabel(s: FlowSettings): string {
  const pattern = BREATHWORK_PATTERNS.find(p => p.id === s.breathworkPatternId);
  return pattern?.benefit ?? 'Breathwork';
}

function getAudioIcon(s: FlowSettings): ReactNode {
  if (s.audioSource === 'none') return AudioIcons.none;
  if (s.audioSource === 'yt-custom') return AudioIcons.custom;
  const key = s.audioSource.startsWith('yt:') ? s.audioSource.replace('yt:', '') : s.audioSource;
  return AudioIcons[key] ?? AudioIcons.none;
}

function SettingsBadge({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-gray-400 bg-white/[0.05] border border-white/[0.07]">
      <span className="w-3.5 h-3.5 flex-shrink-0 opacity-60" style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>
      {label}
    </span>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6v4l3 2" />
    </svg>
  );
}

export default function FlowSessionCard({ priority, settings, onStart }: FlowSessionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="relative rounded-2xl overflow-hidden mb-6"
      style={{
        background: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: `0 0 40px ${SAGE}10, 0 0 80px ${AMETHYST}08`,
      }}
    >
      {/* Four-pillar gradient top accent */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: FOUR_PILLAR_GRADIENT }} />

      <div className="p-6 pt-7">
        {/* Label */}
        <p
          className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3"
          style={{ color: `${SAGE}99` }}
        >
          Ready to Focus
        </p>

        {/* Task name */}
        <p className="text-xl font-semibold text-white leading-snug mb-4">
          {priority.text}
        </p>

        {/* Settings badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          <SettingsBadge icon={<ClockIcon />} label={`${settings.timerMinutes} min`} />
          <SettingsBadge icon={BreathworkIcons[settings.breathworkPatternId]} label={getBreathworkLabel(settings)} />
          <SettingsBadge icon={getAudioIcon(settings)} label={getAudioLabel(settings)} />
        </div>

        {/* Start button */}
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="relative w-full py-4 rounded-2xl text-white text-base font-semibold overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${SAGE}, ${AMETHYST})`,
            boxShadow: `0 4px 24px ${SAGE}40, 0 0 50px ${AMETHYST}10`,
          }}
        >
          {/* Shimmer */}
          <span
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
              animation: 'flowcard-shimmer 3s infinite',
            }}
          />
          <span className="relative flex items-center justify-center gap-2.5">
            {/* Play triangle */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <polygon points="4,2 14,8 4,14" />
            </svg>
            Start Session
          </span>
        </motion.button>
      </div>

      <style jsx>{`
        @keyframes flowcard-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  );
}
