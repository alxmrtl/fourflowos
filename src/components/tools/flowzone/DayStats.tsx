'use client';

import { motion } from 'framer-motion';
import { CORAL, STEEL, SAGE } from './constants';

interface DayStatsProps {
  sessionCount: number;
  totalMinutes: number;
  totalReps: number;
}

export default function DayStats({ sessionCount, totalMinutes, totalReps }: DayStatsProps) {
  const stats = [
    {
      label: 'Sessions',
      value: sessionCount,
      color: CORAL,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: 'Minutes',
      value: totalMinutes,
      color: STEEL,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 4.5V8L10.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Focus Reps',
      value: totalReps,
      color: SAGE,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2L9.5 6H13L10 8.5L11.5 13L8 10.5L4.5 13L6 8.5L3 6H6.5L8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex items-center justify-center gap-6 py-4 px-6 rounded-xl bg-white/[0.03] border border-transparent overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(#0a0a0a, #0a0a0a), linear-gradient(135deg, ${CORAL}30, ${SAGE}30, ${STEEL}30, ${SAGE}30)`,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        borderWidth: '1px',
      }}
    >
      {stats.map(stat => (
        <div key={stat.label} className="text-center flex flex-col items-center gap-1">
          <span style={{ color: `${stat.color}90` }}>{stat.icon}</span>
          <p className="text-xl font-bold" style={{ color: stat.color }}>
            {stat.value}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  );
}
