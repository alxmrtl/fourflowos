'use client';

import { motion } from 'framer-motion';

interface SectionTransitionProps {
  variant?: 'wave' | 'gradient' | 'dots';
  fromColor?: string;
  toColor?: string;
}

export default function SectionTransition({
  variant = 'gradient',
  fromColor = '#FF6F61',
  toColor = '#7A4DA4',
}: SectionTransitionProps) {
  if (variant === 'wave') {
    return (
      <div className="relative h-24 overflow-hidden bg-transparent">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,50 C360,100 720,0 1080,50 C1260,75 1440,50 1440,50 L1440,100 L0,100 Z"
            fill="url(#waveGradient)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={fromColor} />
              <stop offset="100%" stopColor={toColor} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="relative py-8 flex justify-center items-center gap-3">
        {[fromColor, '#6BA292', '#5B84B1', toColor].map((color, index) => (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full"
            style={{ background: color }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.6, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          />
        ))}
      </div>
    );
  }

  // Default: gradient line
  return (
    <motion.div
      className="h-px w-full"
      style={{
        background: `linear-gradient(90deg, transparent, ${fromColor}40, ${toColor}40, transparent)`,
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeOut' }}
    />
  );
}
