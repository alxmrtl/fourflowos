'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';
import ToolButton from './ToolButton';
import type { ToolId } from './useLabState';

// ─── Mini animations ──────────────────────────────────────────────────────────

// CORE: gradient condenses to a bright point, then breathes back out
function CoreAnim() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Outer field — large and faint, collapses inward */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 110, height: 110, background: `radial-gradient(circle, transparent 25%, ${AMETHYST}28 55%, transparent 75%)` }}
        animate={{ scale: [1, 0.4, 1], opacity: [0.9, 0.1, 0.9] }}
        transition={{ duration: 5.0, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
      />
      {/* Mid layer — brightens as it condenses */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 58, height: 58, background: `radial-gradient(circle, ${AMETHYST}55 0%, ${AMETHYST}20 60%, transparent 80%)` }}
        animate={{ scale: [0.7, 1.5, 0.7], opacity: [0.35, 0.85, 0.35] }}
        transition={{ duration: 5.0, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
      />
      {/* Core point — ignites at peak compression */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 10, height: 10, background: `radial-gradient(circle, white 0%, ${AMETHYST} 60%, transparent 85%)`, boxShadow: `0 0 10px ${AMETHYST}` }}
        animate={{ scale: [0.2, 1.4, 0.2], opacity: [0.1, 1, 0.1] }}
        transition={{ duration: 5.0, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
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

function ConsumeAnim() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Central drain — white glow that pulses */}
      <motion.div
        className="absolute rounded-full z-10"
        style={{ width: 10, height: 10, background: 'white', boxShadow: '0 0 16px 6px rgba(255,255,255,0.45)' }}
        animate={{ scale: [0.8, 1.3, 0.8] }}
        transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
      />
      {CONSUME_DOTS.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: 5, height: 5, background: dot.color }}
          animate={{
            x: [dot.x, dot.x * 0.55, dot.x * 0.1, 0],
            y: [dot.y, dot.y * 0.55, dot.y * 0.1, 0],
            scale: [1, 0.75, 0.35, 0],
            opacity: [0.9, 0.65, 0.35, 0],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeIn', delay: dot.delay, times: [0, 0.35, 0.7, 1] }}
        />
      ))}
    </div>
  );
}

// CATALYZE: 3 breath cycles (bright/dim) → quick scatter burst → reset
const CATALYZE_DOTS = [
  { x: 14, y: 22, dx: 13, dy: 9 }, { x: 74, y: 13, dx: -11, dy: 17 },
  { x: 38, y: 58, dx: 9, dy: -13 }, { x: 84, y: 68, dx: -16, dy: -9 },
  { x: 23, y: 74, dx: 19, dy: -11 }, { x: 58, y: 33, dx: -13, dy: 15 },
  { x: 48, y: 82, dx: 6, dy: -19 }, { x: 9, y: 48, dx: 21, dy: 6 },
  { x: 88, y: 38, dx: -19, dy: 13 }, { x: 33, y: 18, dx: 11, dy: 22 },
  { x: 68, y: 83, dx: -9, dy: -17 }, { x: 53, y: 53, dx: 15, dy: -7 },
];

function CatalyzeAnim() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {CATALYZE_DOTS.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: 4, height: 4, background: CORAL, left: `${dot.x}%`, top: `${dot.y}%` }}
          animate={{
            opacity:  [0.15, 0.85, 0.15, 0.85, 0.15, 0.85, 0.15, 0.95, 0.15, 0.15],
            scale:    [0.8,  1.4,  0.8,  1.4,  0.8,  1.4,  0.8,  1.8,  0.8,  0.8],
            x:        [0,    0,    0,    0,    0,    0,    0,    dot.dx * 1.3, 0,  0],
            y:        [0,    0,    0,    0,    0,    0,    0,    dot.dy * 1.3, 0,  0],
          }}
          transition={{
            duration: 6.0,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1,
            times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.72, 0.86, 1.0],
          }}
        />
      ))}
    </div>
  );
}

// CREATE: scattered dots converge methodically into a golden ratio spiral
const PHI_ANGLE = 2.3999; // golden angle in radians
const CREATE_TARGETS = Array.from({ length: 12 }, (_, i) => ({
  x: Math.cos(i * PHI_ANGLE) * Math.sqrt(i + 1) * 7,
  y: Math.sin(i * PHI_ANGLE) * Math.sqrt(i + 1) * 7,
}));
const CREATE_SCATTER = [
  { x: -38, y: -22 }, { x: 32, y: -30 }, { x: -15, y: 28 }, { x: 40, y: 18 },
  { x: -30, y: 8  }, { x: 22, y: 35  }, { x: -42, y: -5 }, { x: 10, y: -35 },
  { x: 35, y: -12 }, { x: -20, y: -32 }, { x: 28, y: 25 }, { x: -8, y: 38 },
];

function CreateAnim() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {CREATE_TARGETS.map((target, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: 4, height: 4, background: SAGE, boxShadow: `0 0 4px ${SAGE}80` }}
          animate={{
            x: [CREATE_SCATTER[i].x, CREATE_SCATTER[i].x, target.x, target.x, CREATE_SCATTER[i].x],
            y: [CREATE_SCATTER[i].y, CREATE_SCATTER[i].y, target.y, target.y, CREATE_SCATTER[i].y],
            opacity: [0.25, 0.35, 0.95, 0.95, 0.25],
            scale:   [0.7,  0.7,  1.3,  1.0,  0.7],
          }}
          transition={{
            duration: 6.0,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.06,
            times: [0, 0.3, 0.62, 0.84, 1.0],
          }}
        />
      ))}
    </div>
  );
}

// ─── App icons (match Practice page) ─────────────────────────────────────────

function AppIcon({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} width={20} height={20} className="object-contain" />;
}

// ─── Section definitions ──────────────────────────────────────────────────────

interface ToolDef { id: ToolId; label: string; description: string; icon: React.ReactNode }
interface SectionDef {
  id: string;
  label: string;
  description: string;
  color: string;
  sectionLogo: string;
  Animation: React.ComponentType;
  tools: ToolDef[];
}

const SECTIONS: SectionDef[] = [
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

// ─── Component ────────────────────────────────────────────────────────────────

interface SectionBarProps {
  activeTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
}

function SectionColumn({ section, activeTool, onSelectTool }: {
  section: SectionDef;
  activeTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const { Animation } = section;

  return (
    <div
      className="flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animation area */}
      <div className="relative h-[76px] overflow-hidden" style={{ opacity: hovered ? 0.85 : 0.55, transition: 'opacity 0.3s ease' }}>
        <Animation />
      </div>

      {/* Section header */}
      <div className="px-4 pt-1 pb-3 flex items-center gap-2.5 border-b border-white/[0.05]">
        <div className="relative w-5 h-5 flex-shrink-0 opacity-60">
          <Image src={section.sectionLogo} alt={section.label} fill className="object-contain" />
        </div>
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.22em] leading-none" style={{ color: section.color }}>
            {section.label}
          </p>
          <p className="text-[11px] text-white/28 mt-0.5 leading-tight hidden sm:block">
            {section.description}
          </p>
        </div>
      </div>

      {/* Tool buttons */}
      <div className="flex flex-col gap-2 px-3 py-3">
        {section.tools.map((tool) => (
          <ToolButton
            key={tool.id}
            label={tool.label}
            description={tool.description}
            color={section.color}
            isActive={activeTool === tool.id}
            icon={tool.icon}
            onClick={() => onSelectTool(tool.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default function SectionBar({ activeTool, onSelectTool }: SectionBarProps) {
  return (
    <div className="border-b border-white/[0.07]">
      <div className="mx-auto grid grid-cols-4 divide-x divide-white/[0.06]" style={{ width: '70%' }}>
        {SECTIONS.map((section) => (
          <SectionColumn
            key={section.id}
            section={section}
            activeTool={activeTool}
            onSelectTool={onSelectTool}
          />
        ))}
      </div>
    </div>
  );
}
