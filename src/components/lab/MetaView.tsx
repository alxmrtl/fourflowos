'use client';

import { motion } from 'framer-motion';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';
import type { FieldId, ToolId } from './useLabState';
import { FIELDS } from './FieldView';

const FIELD_COLORS: Record<FieldId, string> = {
  consume: STEEL,
  create: SAGE,
  catalyze: CORAL,
  core: AMETHYST,
};

interface MetaViewProps {
  onSelectTool: (field: FieldId, tool: ToolId) => void;
  onClose: () => void;
  onRecentre: () => void;
}

export default function MetaView({ onSelectTool, onClose, onRecentre }: MetaViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-[#060606]/96 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="max-w-xl mx-auto px-5 py-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.3em]">All tools</p>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/65 transition-colors text-xl leading-none w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Fields + tools */}
        <div className="space-y-7">
          {FIELDS.map(field => {
            const color = FIELD_COLORS[field.id];
            return (
              <div key={field.id}>
                {/* Field header */}
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color }}>
                    {field.label}
                  </p>
                </div>

                {/* Tools */}
                <div className="grid grid-cols-2 gap-2 pl-4">
                  {field.tools.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        onSelectTool(field.id, tool.id);
                        onClose();
                      }}
                      className="p-3 rounded-xl border border-white/6 hover:border-white/18 text-left transition-colors group"
                      style={{ background: 'rgba(255,255,255,0.025)' }}
                    >
                      <p className="text-white/70 group-hover:text-white/90 text-sm font-medium transition-colors">
                        {tool.label}
                      </p>
                      <p className="text-white/25 text-[11px] mt-0.5 leading-snug">
                        {tool.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Re-centre */}
        <div className="mt-12 pt-6 border-t border-white/5 text-center">
          <button
            onClick={() => {
              onRecentre();
              onClose();
            }}
            className="text-[11px] text-white/20 hover:text-white/45 transition-colors tracking-wide"
          >
            ↺ re-centre — begin the breath ritual again
          </button>
        </div>
      </div>
    </motion.div>
  );
}
