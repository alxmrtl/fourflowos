'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SectionTransitionProps {
  variant?: 'wave' | 'gradient' | 'dots';
  fromColor?: string;
  toColor?: string;
}

export default function SectionTransition({
  variant = 'gradient',
  fromColor = '#E84535',
  toColor = '#6330A0',
}: SectionTransitionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });

  if (variant === 'wave') {
    return (
      <div ref={ref} className="relative h-24 overflow-hidden bg-transparent">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,50 C360,100 720,0 1080,50 C1260,75 1440,50 1440,50 L1440,100 L0,100 Z"
            fill="url(#waveGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 0.1 : 0 }}
            transition={{ duration: 0.6 }}
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
    const colors = [fromColor, '#4E8C73', '#3E6FA3', toColor];
    return (
      <div ref={ref} className="relative py-8 flex justify-center items-center gap-3">
        {colors.map((color, index) => (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full"
            style={{ background: color }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isInView ? 0.6 : 0,
              scale: isInView ? 1 : 0,
            }}
            transition={{ delay: isInView ? index * 0.08 : 0, duration: 0.4 }}
          />
        ))}
      </div>
    );
  }

  // Default: gradient line
  return (
    <motion.div
      ref={ref}
      className="h-px w-full"
      style={{
        background: `linear-gradient(90deg, transparent, ${fromColor}40, ${toColor}40, transparent)`,
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{
        scaleX: isInView ? 1 : 0,
        opacity: isInView ? 1 : 0,
      }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
  );
}
