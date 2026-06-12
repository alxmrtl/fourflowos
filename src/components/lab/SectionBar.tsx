'use client';

import { useState } from 'react';
import { useMounted, SECTIONS, AppIcon } from './sections-data';
import ToolButton from './ToolButton';
import type { ToolId } from './useLabState';
import type { SectionDef } from './sections-data';

function SectionColumn({ section, activeTool, onSelectTool }: {
  section: SectionDef;
  activeTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const mounted = useMounted();
  const { Animation, Icon } = section;
  const isActive = section.tools.some(t => t.id === activeTool);

  return (
    <div
      className="flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animation area */}
      <div className="relative h-[76px] overflow-hidden" style={{ opacity: hovered ? 0.85 : 0.55, transition: 'opacity 0.3s ease' }}>
        {mounted && <Animation />}
      </div>

      {/* Section header */}
      <div className="px-4 pt-1 pb-3 flex items-center gap-2.5 border-b border-white/[0.05]">
        <div className="flex-shrink-0" style={{ opacity: isActive || hovered ? 1 : 0.5, transition: 'opacity 0.25s' }}>
          <Icon color={section.color} size={20} active={isActive} />
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
            icon={<AppIcon src={tool.iconSrc} alt={tool.label} />}
            onClick={() => onSelectTool(tool.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface SectionBarProps {
  activeTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
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
