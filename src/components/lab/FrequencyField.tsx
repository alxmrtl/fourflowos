'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';
import type { FieldId } from './useLabState';

// Stable dot positions for CATALYZE — deterministic, no Math.random on render
const CATALYZE_DOTS = [
  { x: 14, y: 22, dx: 13, dy: 9 },
  { x: 74, y: 13, dx: -11, dy: 17 },
  { x: 38, y: 58, dx: 9, dy: -13 },
  { x: 84, y: 68, dx: -16, dy: -9 },
  { x: 23, y: 74, dx: 19, dy: -11 },
  { x: 58, y: 33, dx: -13, dy: 15 },
  { x: 48, y: 82, dx: 6, dy: -19 },
  { x: 9, y: 48, dx: 21, dy: 6 },
  { x: 88, y: 38, dx: -19, dy: 13 },
  { x: 33, y: 18, dx: 11, dy: 22 },
  { x: 68, y: 83, dx: -9, dy: -17 },
  { x: 53, y: 53, dx: 15, dy: -7 },
];

function ConsumeAnimation({ hovered }: { hovered: boolean }) {
  const colors = [CORAL, SAGE, STEEL, AMETHYST];
  return (
    <div className="flex items-center justify-center gap-2.5 w-full h-full px-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full flex-shrink-0"
          style={{
            width: 6,
            height: 6,
            background: colors[i % 4],
            opacity: hovered ? 0.75 : 0.35,
          }}
          animate={{ y: [0, -14, 0, 14, 0] }}
          transition={{
            duration: hovered ? 2.2 : 3.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.24,
          }}
        />
      ))}
    </div>
  );
}

function CreateAnimation({ hovered }: { hovered: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 110,
          height: 110,
          background: `radial-gradient(circle, ${SAGE}${hovered ? '65' : '38'} 0%, transparent 70%)`,
        }}
        animate={{ x: [-22, 22, -22], y: [10, -10, 10] }}
        transition={{ duration: hovered ? 3.8 : 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 88,
          height: 88,
          background: `radial-gradient(circle, ${STEEL}${hovered ? '65' : '38'} 0%, transparent 70%)`,
        }}
        animate={{ x: [22, -22, 22], y: [-10, 10, -10] }}
        transition={{ duration: hovered ? 3.8 : 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2.75 }}
      />
    </div>
  );
}

function CatalyzeAnimation({ hovered }: { hovered: boolean }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {CATALYZE_DOTS.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: hovered ? 5 : 4,
            height: hovered ? 5 : 4,
            background: CORAL,
            left: `${dot.x}%`,
            top: `${dot.y}%`,
          }}
          animate={{
            x: [0, dot.dx, 0],
            y: [0, dot.dy, 0],
            opacity: [0.2, hovered ? 0.85 : 0.5, 0.2],
          }}
          transition={{
            duration: hovered ? 1.9 : 3.0,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.19,
          }}
        />
      ))}
    </div>
  );
}

function CoreAnimation({ hovered }: { hovered: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 148,
          height: 148,
          background: `radial-gradient(circle, ${AMETHYST}${hovered ? '38' : '22'} 0%, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.22, 1] }}
        transition={{ duration: hovered ? 4.2 : 6.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 76,
          height: 76,
          background: `radial-gradient(circle, ${AMETHYST}${hovered ? '55' : '38'} 0%, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: hovered ? 4.2 : 6.5, repeat: Infinity, ease: 'easeInOut', delay: 3.25 }}
      />
    </div>
  );
}

const ANIMATIONS: Record<FieldId, React.ComponentType<{ hovered: boolean }>> = {
  consume: ConsumeAnimation,
  create: CreateAnimation,
  catalyze: CatalyzeAnimation,
  core: CoreAnimation,
};

const FIELD_COLORS: Record<FieldId, string> = {
  consume: STEEL,
  create: SAGE,
  catalyze: CORAL,
  core: AMETHYST,
};

interface FrequencyFieldProps {
  id: FieldId;
  label: string;
  tools: string[];
  lastUsed?: boolean;
  onClick: () => void;
}

export default function FrequencyField({ id, label, tools, lastUsed, onClick }: FrequencyFieldProps) {
  const [hovered, setHovered] = useState(false);
  const Animation = ANIMATIONS[id];
  const color = FIELD_COLORS[id];

  return (
    <motion.div
      className="relative overflow-hidden cursor-pointer rounded-2xl border flex flex-col"
      style={{
        background: '#0d0d0d',
        borderColor: hovered ? `${color}45` : 'rgba(255,255,255,0.07)',
        minHeight: 180,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      transition={{ borderColor: { duration: 0.2 } }}
    >
      {/* Last-used dot */}
      {lastUsed && (
        <div
          className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full z-10"
          style={{ background: color, opacity: 0.7 }}
        />
      )}

      {/* Animation */}
      <div className="flex-1 relative" style={{ minHeight: 130 }}>
        <Animation hovered={hovered} />
      </div>

      {/* Label */}
      <div className="px-4 pb-4 pt-1">
        <motion.p
          className="text-xs font-bold uppercase tracking-[0.2em]"
          animate={{ color: hovered ? '#ffffff' : 'rgba(255,255,255,0.45)' }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.p>
        <motion.p
          className="text-[10px] mt-0.5 text-white leading-tight"
          animate={{ opacity: hovered ? 0.4 : 0.18 }}
          transition={{ duration: 0.2 }}
        >
          {tools.join(' · ')}
        </motion.p>
      </div>
    </motion.div>
  );
}
