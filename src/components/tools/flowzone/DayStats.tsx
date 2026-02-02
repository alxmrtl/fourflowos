'use client';

import { motion } from 'framer-motion';
import { SAGE } from './constants';

interface DayStatsProps {
  sessionCount: number;
  totalMinutes: number;
  totalReps: number;
}

export default function DayStats({ sessionCount, totalMinutes, totalReps }: DayStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-6 py-4 px-6 rounded-xl bg-white/[0.03] border border-white/[0.06]"
    >
      {[
        { label: 'Sessions', value: sessionCount },
        { label: 'Minutes', value: totalMinutes },
        { label: 'Focus Reps', value: totalReps },
      ].map(stat => (
        <div key={stat.label} className="text-center">
          <p className="text-xl font-bold" style={{ color: SAGE }}>
            {stat.value}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  );
}
