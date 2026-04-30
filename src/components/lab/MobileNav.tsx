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
      style={{ background: '#0a0a0a' }}
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
          {/* Header row: label + close button */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{ color: section.color }}
            >
              {section.label}
            </span>
            <span className="text-[10px] text-white/30 font-light">{section.description}</span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1L1 9" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
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
                  background: isActive ? `${section.color}18` : 'rgba(255,255,255,0.07)',
                  borderColor: isActive ? `${section.color}70` : 'rgba(255,255,255,0.12)',
                  boxShadow: isActive ? `0 0 12px 1px ${section.color}25` : 'none',
                }}
                whileTap={{ scale: 0.975 }}
                transition={{ duration: 0.1 }}
              >
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: isActive ? `${section.color}28` : 'rgba(255,255,255,0.1)',
                    border: `1px solid ${isActive ? section.color + '55' : 'rgba(255,255,255,0.12)'}`,
                  }}
                >
                  {tool.icon}
                </span>
                <span className="flex flex-col">
                  <span className="text-[13px] font-medium leading-tight" style={{ color: '#fff' }}>
                    {tool.label}
                  </span>
                  <span className="text-[11px] text-white/50 mt-0.5 leading-tight font-light">
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
      style={{ background: '#080808' }}
    >
      {SECTIONS.map((section, idx) => {
        const isActive = activeSection === idx;
        return (
          <button
            key={section.id}
            onClick={() => onSelectSection(idx)}
            className="flex flex-col items-center justify-center gap-1 relative"
          >
            {/* Active glow */}
            {isActive && (
              <div
                className="absolute inset-x-2 inset-y-1 rounded-xl pointer-events-none transition-all duration-200"
                style={{
                  background: `${section.color}12`,
                  boxShadow: `0 0 14px 3px ${section.color}30`,
                }}
              />
            )}
            <div className="relative flex-shrink-0">
              <section.Icon color={section.color} size={20} active={isActive} />
            </div>
            <span
              className="relative text-[8px] font-bold uppercase tracking-[0.16em] transition-colors duration-200"
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                color: isActive ? section.color : 'rgba(255,255,255,0.85)',
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
