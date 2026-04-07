'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SECTIONS, sectionFromTool, useMounted } from './sections-data';
import type { ToolId } from './useLabState';

interface MobileNavProps {
  activeTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
}

// ─── Bottom sheet ─────────────────────────────────────────────────────────────

function MobileSheet({
  sectionIdx,
  activeTool,
  onSelectTool,
  onClose,
}: {
  sectionIdx: number;
  activeTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
  onClose: () => void;
}) {
  const mounted = useMounted();
  const section = SECTIONS[sectionIdx];
  const { Animation } = section;

  return (
    <div
      className="w-full h-full overflow-hidden rounded-t-[20px] border-t border-white/[0.1]"
      style={{ background: 'rgba(10,10,10,0.82)' }}
    >
      {/* Animation — full-bleed background */}
      <div className="absolute inset-0 opacity-55 pointer-events-none">
        {mounted && <Animation />}
      </div>

      {/* Gradient veil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0.60) 30%, rgba(10,10,10,0.88) 55%, rgba(10,10,10,0.97) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Handle */}
        <div className="w-9 h-[3px] rounded-full bg-white/20 mx-auto mt-2.5 flex-shrink-0" />

        {/* Section label */}
        <div className="flex items-center gap-2 px-4 pt-2 pb-2 flex-shrink-0">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: section.color }}
          >
            {section.label}
          </span>
          <span className="text-[10px] text-white/30 font-light">{section.description}</span>
        </div>

        {/* Tool buttons */}
        <div className="flex flex-col gap-2 px-4 pb-4 flex-1 justify-center">
          {section.tools.map((tool) => {
            const isActive = activeTool === tool.id;
            return (
              <motion.button
                key={tool.id}
                onClick={() => {
                  onSelectTool(tool.id);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left"
                style={{
                  background: isActive ? `${section.color}12` : 'rgba(255,255,255,0.04)',
                  borderColor: isActive ? `${section.color}50` : 'rgba(255,255,255,0.08)',
                }}
                whileTap={{ scale: 0.975 }}
                transition={{ duration: 0.1 }}
              >
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: isActive ? `${section.color}20` : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${isActive ? section.color + '40' : 'rgba(255,255,255,0.08)'}`,
                    opacity: isActive ? 1 : 0.55,
                  }}
                >
                  {tool.icon}
                </span>
                <span className="flex flex-col">
                  <span className="text-[13px] font-medium leading-tight" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.75)' }}>
                    {tool.label}
                  </span>
                  <span className="text-[11px] text-white/30 mt-0.5 leading-tight font-light">
                    {tool.description}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Bottom nav bar ───────────────────────────────────────────────────────────

function BottomNavBar({
  activeSection,
  onSelectSection,
}: {
  activeSection: number;
  onSelectSection: (idx: number) => void;
}) {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 h-14 grid grid-cols-4 border-t border-white/[0.08]"
      style={{
        background: 'rgba(8,8,8,0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {SECTIONS.map((section, idx) => {
        const isActive = activeSection === idx;
        return (
          <button
            key={section.id}
            onClick={() => onSelectSection(idx)}
            className="flex flex-col items-center justify-center gap-1"
          >
            <div
              className="flex-shrink-0 transition-opacity duration-200"
              style={{ opacity: isActive ? 1 : 0.35 }}
            >
              <section.Icon color={section.color} size={20} active={isActive} />
            </div>
            <span
              className="text-[8px] font-bold uppercase tracking-[0.16em] transition-colors duration-200"
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                color: isActive ? section.color : 'rgba(255,255,255,0.28)',
              }}
            >
              {section.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main mobile nav ──────────────────────────────────────────────────────────

export default function MobileNav({ activeTool, onSelectTool }: MobileNavProps) {
  const [activeSection, setActiveSection] = useState(() => sectionFromTool(activeTool));
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setActiveSection(sectionFromTool(activeTool));
  }, [activeTool]);

  function handleNavTap(idx: number) {
    if (activeSection === idx && sheetOpen) {
      setSheetOpen(false);
    } else {
      setActiveSection(idx);
      setSheetOpen(true);
    }
  }

  return (
    <>
      {/* Sheet — fixed, floats above bottom nav, never in document flow */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            key="sheet"
            className="fixed inset-x-0 z-40"
            style={{ bottom: '56px', height: '196px' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
          >
            <MobileSheet
              sectionIdx={activeSection}
              activeTool={activeTool}
              onSelectTool={onSelectTool}
              onClose={() => setSheetOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavBar activeSection={activeSection} onSelectSection={handleNavTap} />
    </>
  );
}
