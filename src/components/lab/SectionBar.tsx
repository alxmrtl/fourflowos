'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';
import ToolButton from './ToolButton';
import type { ToolId } from './useLabState';

// ─── Mini animations (adapted from FrequencyField) ────────────────────────────

const CATALYZE_DOTS = [
  { x: 14, y: 22, dx: 13, dy: 9 }, { x: 74, y: 13, dx: -11, dy: 17 },
  { x: 38, y: 58, dx: 9, dy: -13 }, { x: 84, y: 68, dx: -16, dy: -9 },
  { x: 23, y: 74, dx: 19, dy: -11 }, { x: 58, y: 33, dx: -13, dy: 15 },
  { x: 48, y: 82, dx: 6, dy: -19 }, { x: 9, y: 48, dx: 21, dy: 6 },
  { x: 88, y: 38, dx: -19, dy: 13 }, { x: 33, y: 18, dx: 11, dy: 22 },
  { x: 68, y: 83, dx: -9, dy: -17 }, { x: 53, y: 53, dx: 15, dy: -7 },
];

function ConsumeAnim() {
  const colors = [CORAL, SAGE, STEEL, AMETHYST];
  return (
    <div className="flex items-center justify-center gap-2 w-full h-full px-2">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full flex-shrink-0"
          style={{ width: 5, height: 5, background: colors[i % 4], opacity: 0.5 }}
          animate={{ y: [0, -10, 0, 10, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.22 }}
        />
      ))}
    </div>
  );
}

function CreateAnim() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute rounded-full"
        style={{ width: 70, height: 70, background: `radial-gradient(circle, ${SAGE}50 0%, transparent 70%)` }}
        animate={{ x: [-16, 16, -16], y: [8, -8, 8] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: 55, height: 55, background: `radial-gradient(circle, ${STEEL}50 0%, transparent 70%)` }}
        animate={{ x: [16, -16, 16], y: [-8, 8, -8] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 2.6 }}
      />
    </div>
  );
}

function CatalyzeAnim() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {CATALYZE_DOTS.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: 4, height: 4, background: CORAL, left: `${dot.x}%`, top: `${dot.y}%` }}
          animate={{ x: [0, dot.dx * 0.6, 0], y: [0, dot.dy * 0.6, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

function CoreAnim() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute rounded-full"
        style={{ width: 90, height: 90, background: `radial-gradient(circle, ${AMETHYST}30 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6.0, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: 48, height: 48, background: `radial-gradient(circle, ${AMETHYST}45 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 6.0, repeat: Infinity, ease: 'easeInOut', delay: 3.0 }}
      />
    </div>
  );
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

const ProfileIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const BreathIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 8.5C7 8.5 9 5.5 12 8.5s5 0 5 0M7 12c0 0 2-3 5 0s5 0 5 0M7 15.5c0 0 2-3 5 0s5 0 5 0" />
  </svg>
);

const SparkIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const TimerIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

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
      { id: 'profile', label: 'Flow Profile', description: 'Your consciousness alignment map', icon: <ProfileIcon /> },
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
      { id: 'flowread', label: 'FlowRead', description: 'Focus reading trainer', icon: <BookIcon /> },
      { id: 'compendium', label: 'FlowCompendium', description: 'Browse 191 flow protocols', icon: <GridIcon /> },
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
      { id: 'breathwork', label: 'FlowBreath', description: 'Shift state — body first', icon: <BreathIcon /> },
      { id: 'curiosity', label: 'FlowSpark', description: 'Map what pulls you', icon: <SparkIcon /> },
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
      { id: 'flowzone', label: 'FlowZone', description: 'Focus timer + reps', icon: <TimerIcon /> },
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
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] leading-none" style={{ color: section.color }}>
            {section.label}
          </p>
          <p className="text-[10px] text-white/28 mt-0.5 leading-tight hidden sm:block">
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
    <div className="border-b border-white/[0.07] grid grid-cols-4 divide-x divide-white/[0.06]">
      {SECTIONS.map((section) => (
        <SectionColumn
          key={section.id}
          section={section}
          activeTool={activeTool}
          onSelectTool={onSelectTool}
        />
      ))}
    </div>
  );
}
