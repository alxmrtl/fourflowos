'use client';

import { motion } from 'framer-motion';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';
import ToolButton from './ToolButton';
import type { ToolId } from './useLabState';

interface SectionDef {
  id: string;
  label: string;
  description: string;
  color: string;
  tools: { id: ToolId; label: string; description: string }[];
}

const SECTIONS: SectionDef[] = [
  {
    id: 'core',
    label: 'CORE',
    description: 'Know yourself',
    color: AMETHYST,
    tools: [
      { id: 'profile', label: 'Flow Profile', description: 'Your consciousness alignment map' },
    ],
  },
  {
    id: 'consume',
    label: 'CONSUME',
    description: 'Take something in',
    color: STEEL,
    tools: [
      { id: 'flowread', label: 'FlowRead', description: 'Focus reading trainer' },
      { id: 'compendium', label: 'FlowCompendium', description: 'Browse 191 flow protocols' },
    ],
  },
  {
    id: 'catalyze',
    label: 'CATALYZE',
    description: 'Break inertia',
    color: CORAL,
    tools: [
      { id: 'breathwork', label: 'FlowBreath', description: 'Shift state — body first' },
      { id: 'curiosity', label: 'FlowSpark', description: 'Map what pulls you' },
    ],
  },
  {
    id: 'create',
    label: 'CREATE',
    description: 'Enter deep work',
    color: SAGE,
    tools: [
      { id: 'flowzone', label: 'FlowZone', description: 'Focus timer + reps' },
    ],
  },
];

interface SectionBarProps {
  activeTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
}

export default function SectionBar({ activeTool, onSelectTool }: SectionBarProps) {
  return (
    <div className="border-b border-white/[0.06] grid grid-cols-4 divide-x divide-white/[0.06]">
      {SECTIONS.map((section) => (
        <div key={section.id} className="px-3 py-4 flex flex-col gap-2">
          {/* Section header */}
          <div className="pb-2.5 mb-0.5">
            <motion.p
              className="text-[9px] font-bold uppercase tracking-[0.28em] leading-none"
              style={{ color: section.color }}
            >
              {section.label}
            </motion.p>
            <p className="text-[10px] text-white/25 mt-1 leading-tight hidden sm:block">
              {section.description}
            </p>
          </div>

          {/* Tool buttons */}
          <div className="flex flex-col gap-1.5">
            {section.tools.map((tool) => (
              <ToolButton
                key={tool.id}
                label={tool.label}
                description={tool.description}
                color={section.color}
                isActive={activeTool === tool.id}
                onClick={() => onSelectTool(tool.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
