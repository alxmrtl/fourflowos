'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';
import type { ToolId } from './useLabState';

// ─── Hydration guard ──────────────────────────────────────────────────────────

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

// ─── Animation components ─────────────────────────────────────────────────────

// CORE: gradient condenses to a bright point, then breathes back out
export function CoreAnim() {
  const outer = useAnimation();
  const mid = useAnimation();
  const core = useAnimation();

  useEffect(() => {
    outer.start({ scale: [1, 0.4, 1], opacity: [0.9, 0.1, 0.9], transition: { duration: 5.0, repeat: Infinity, repeatType: 'loop', ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } });
    mid.start({ scale: [0.7, 1.5, 0.7], opacity: [0.35, 0.85, 0.35], transition: { duration: 5.0, repeat: Infinity, repeatType: 'loop', ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } });
    core.start({ scale: [0.2, 1.4, 0.2], opacity: [0.1, 1, 0.1], transition: { duration: 5.0, repeat: Infinity, repeatType: 'loop', ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute rounded-full"
        style={{ width: 110, height: 110, background: `radial-gradient(circle, transparent 25%, ${AMETHYST}28 55%, transparent 75%)` }}
        initial={{ scale: 1, opacity: 0.9 }}
        animate={outer}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: 58, height: 58, background: `radial-gradient(circle, ${AMETHYST}55 0%, ${AMETHYST}20 60%, transparent 80%)` }}
        initial={{ scale: 0.7, opacity: 0.35 }}
        animate={mid}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: 10, height: 10, background: `radial-gradient(circle, white 0%, ${AMETHYST} 60%, transparent 85%)`, boxShadow: `0 0 10px ${AMETHYST}` }}
        initial={{ scale: 0.2, opacity: 0.1 }}
        animate={core}
      />
    </div>
  );
}

// CONSUME: colored dots spiral/drain into a central white light
const CONSUME_DOTS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2;
  const r = 34;
  return {
    x: Math.cos(angle) * r,
    y: Math.sin(angle) * r,
    color: [CORAL, SAGE, STEEL, AMETHYST, CORAL, SAGE, STEEL, AMETHYST][i],
    delay: i * (3.2 / 8),
  };
});

type ConsumeDotCustom = { x: number; y: number; delay: number };

export function ConsumeAnim() {
  const centralCtrl = useAnimation();
  const dotsCtrl = useAnimation();

  useEffect(() => {
    centralCtrl.start({ scale: [0.8, 1.3, 0.8], transition: { duration: 2.0, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' } });
    dotsCtrl.start((custom: ConsumeDotCustom) => ({
      x: [custom.x, custom.x * 0.55, custom.x * 0.1, 0],
      y: [custom.y, custom.y * 0.55, custom.y * 0.1, 0],
      scale: [1, 0.75, 0.35, 0],
      opacity: [0.9, 0.65, 0.35, 0],
      transition: { duration: 3.2, repeat: Infinity, repeatType: 'loop', ease: 'easeIn', delay: custom.delay, times: [0, 0.35, 0.7, 1] },
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute rounded-full z-10"
        style={{ width: 10, height: 10, background: 'white', boxShadow: '0 0 16px 6px rgba(255,255,255,0.45)' }}
        initial={{ scale: 0.8 }}
        animate={centralCtrl}
      />
      {CONSUME_DOTS.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: 5, height: 5, background: dot.color }}
          custom={{ x: dot.x, y: dot.y, delay: dot.delay } satisfies ConsumeDotCustom}
          initial={{ x: dot.x, y: dot.y, scale: 1, opacity: 0.9 }}
          animate={dotsCtrl}
        />
      ))}
    </div>
  );
}

// CATALYZE: 3 breath cycles → quick scatter burst → reset
const CATALYZE_DOTS = [
  { x: 14, y: 22, dx: 13, dy: 9 }, { x: 74, y: 13, dx: -11, dy: 17 },
  { x: 38, y: 58, dx: 9, dy: -13 }, { x: 84, y: 68, dx: -16, dy: -9 },
  { x: 23, y: 74, dx: 19, dy: -11 }, { x: 58, y: 33, dx: -13, dy: 15 },
  { x: 48, y: 82, dx: 6, dy: -19 }, { x: 9, y: 48, dx: 21, dy: 6 },
  { x: 88, y: 38, dx: -19, dy: 13 }, { x: 33, y: 18, dx: 11, dy: 22 },
  { x: 68, y: 83, dx: -9, dy: -17 }, { x: 53, y: 53, dx: 15, dy: -7 },
];

type CatalyzeDotCustom = { dx: number; dy: number; i: number };

export function CatalyzeAnim() {
  const ctrl = useAnimation();

  useEffect(() => {
    ctrl.start((custom: CatalyzeDotCustom) => ({
      opacity: [0.15, 0.85, 0.15, 0.85, 0.15, 0.85, 0.15, 0.95, 0.15, 0.15],
      scale:   [0.8,  1.4,  0.8,  1.4,  0.8,  1.4,  0.8,  1.8,  0.8,  0.8],
      x: [0, 0, 0, 0, 0, 0, 0, custom.dx * 1.3, 0, 0],
      y: [0, 0, 0, 0, 0, 0, 0, custom.dy * 1.3, 0, 0],
      transition: {
        duration: 6.0, repeat: Infinity, repeatType: 'loop',
        ease: 'easeInOut', delay: custom.i * 0.1,
        times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.72, 0.86, 1.0],
      },
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {CATALYZE_DOTS.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: 4, height: 4, background: CORAL, left: `${dot.x}%`, top: `${dot.y}%` }}
          custom={{ dx: dot.dx, dy: dot.dy, i } satisfies CatalyzeDotCustom}
          initial={{ opacity: 0.15, scale: 0.8, x: 0, y: 0 }}
          animate={ctrl}
        />
      ))}
    </div>
  );
}

// CREATE: scattered dots converge into a golden ratio spiral
const PHI_ANGLE = 2.3999;
const CREATE_TARGETS = Array.from({ length: 12 }, (_, i) => ({
  x: Math.cos(i * PHI_ANGLE) * Math.sqrt(i + 1) * 7,
  y: Math.sin(i * PHI_ANGLE) * Math.sqrt(i + 1) * 7,
}));
const CREATE_SCATTER = [
  { x: -38, y: -22 }, { x: 32, y: -30 }, { x: -15, y: 28 }, { x: 40, y: 18 },
  { x: -30, y: 8  }, { x: 22, y: 35  }, { x: -42, y: -5 }, { x: 10, y: -35 },
  { x: 35, y: -12 }, { x: -20, y: -32 }, { x: 28, y: 25 }, { x: -8, y: 38 },
];

type CreateDotCustom = { sx: number; sy: number; tx: number; ty: number; i: number };

export function CreateAnim() {
  const ctrl = useAnimation();

  useEffect(() => {
    ctrl.start((custom: CreateDotCustom) => ({
      x: [custom.sx, custom.sx, custom.tx, custom.tx, custom.sx],
      y: [custom.sy, custom.sy, custom.ty, custom.ty, custom.sy],
      opacity: [0.25, 0.35, 0.95, 0.95, 0.25],
      scale:   [0.7,  0.7,  1.3,  1.0,  0.7],
      transition: {
        duration: 6.0, repeat: Infinity, repeatType: 'loop',
        ease: 'easeInOut', delay: custom.i * 0.06,
        times: [0, 0.3, 0.62, 0.84, 1.0],
      },
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {CREATE_TARGETS.map((target, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: 4, height: 4, background: SAGE, boxShadow: `0 0 4px ${SAGE}80` }}
          custom={{ sx: CREATE_SCATTER[i].x, sy: CREATE_SCATTER[i].y, tx: target.x, ty: target.y, i } satisfies CreateDotCustom}
          initial={{ x: CREATE_SCATTER[i].x, y: CREATE_SCATTER[i].y, opacity: 0.25, scale: 0.7 }}
          animate={ctrl}
        />
      ))}
    </div>
  );
}

// ─── Shared icon component ────────────────────────────────────────────────────

export function AppIcon({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} width={20} height={20} className="object-contain" />;
}

// ─── Section + tool definitions ───────────────────────────────────────────────

export interface ToolDef { id: ToolId; label: string; description: string; icon: React.ReactNode }
export interface SectionDef {
  id: string;
  label: string;
  description: string;
  color: string;
  sectionLogo: string;
  Animation: React.ComponentType;
  tools: ToolDef[];
}

export const SECTIONS: SectionDef[] = [
  {
    id: 'core',
    label: 'CORE',
    description: 'Know yourself',
    color: AMETHYST,
    sectionLogo: '/assets/LOGOS/SPIRIT - Section Logo.png',
    Animation: CoreAnim,
    tools: [
      { id: 'profile', label: 'Flow Profile', description: 'Your consciousness alignment map', icon: <AppIcon src="/assets/LOGOS/FOURFLOW - MAIN LOGO.png" alt="Flow Profile" /> },
    ],
  },
  {
    id: 'consume',
    label: 'CONSUME',
    description: 'Take something in',
    color: STEEL,
    sectionLogo: '/assets/LOGOS/STORY - Section Logo.png',
    Animation: ConsumeAnim,
    tools: [
      { id: 'flowread', label: 'FlowRead', description: 'Focus reading trainer', icon: <AppIcon src="/assets/apps/flowread-icon.png" alt="FlowRead" /> },
      { id: 'compendium', label: 'FlowCompendium', description: 'Browse 191 flow protocols', icon: <AppIcon src="/assets/LOGOS/OPEN MIND.png" alt="FlowCompendium" /> },
    ],
  },
  {
    id: 'catalyze',
    label: 'CATALYZE',
    description: 'Break inertia',
    color: CORAL,
    sectionLogo: '/assets/LOGOS/SELF - Section Logo.png',
    Animation: CatalyzeAnim,
    tools: [
      { id: 'breathwork', label: 'FlowBreath', description: 'Shift state — body first', icon: <AppIcon src="/assets/LOGOS/FOCUSED BODY.png" alt="FlowBreath" /> },
      { id: 'curiosity', label: 'FlowSpark', description: 'Map what pulls you', icon: <AppIcon src="/assets/LOGOS/IGNITED CURIOSITY.png" alt="FlowSpark" /> },
    ],
  },
  {
    id: 'create',
    label: 'CREATE',
    description: 'Enter deep work',
    color: SAGE,
    sectionLogo: '/assets/LOGOS/SPACE - Section Logo.png',
    Animation: CreateAnim,
    tools: [
      { id: 'flowzone', label: 'FlowZone', description: 'Focus timer + reps', icon: <AppIcon src="/assets/apps/flowzone-icon.png" alt="FlowZone" /> },
    ],
  },
];

// ─── Helper: map any ToolId → section index ───────────────────────────────────

export function sectionFromTool(tool: ToolId): number {
  const idx = SECTIONS.findIndex(s => s.tools.some(t => t.id === tool));
  return idx >= 0 ? idx : 0;
}
