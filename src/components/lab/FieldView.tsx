'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FrequencyField from './FrequencyField';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';
import type { FieldId, ToolId } from './useLabState';
import { COMPENDIUM_PROTOCOL_COUNT } from '@/data/compendium-meta';

interface ToolConfig {
  id: ToolId;
  label: string;
  description: string;
  color: string;
}

interface FieldConfig {
  id: FieldId;
  label: string;
  tools: ToolConfig[];
}

export const FIELDS: FieldConfig[] = [
  {
    id: 'consume',
    label: 'CONSUME',
    tools: [
      { id: 'flowread', label: 'FlowRead', description: 'Speed reading — paste text or a YouTube URL', color: STEEL },
      { id: 'compendium', label: 'Compendium', description: `Browse ${COMPENDIUM_PROTOCOL_COUNT} flow qualities and techniques`, color: AMETHYST },
    ],
  },
  {
    id: 'create',
    label: 'CREATE',
    tools: [
      { id: 'flowzone', label: 'FlowZone', description: 'Focus timer + focus reps', color: SAGE },
    ],
  },
  {
    id: 'catalyze',
    label: 'CATALYZE',
    tools: [
      { id: 'curiosity', label: 'FlowSpark', description: 'Map what pulls you — find the thread', color: CORAL },
      { id: 'breathwork', label: 'Breathwork', description: 'Body activation — shift state fast', color: SAGE },
    ],
  },
  {
    id: 'core',
    label: 'CORE',
    tools: [
      { id: 'training', label: 'Daily Reps', description: 'Spaced repetition — train the framework', color: AMETHYST },
      { id: 'flow-lens', label: 'Flow Unlock', description: 'Find your block', color: STEEL },
      { id: 'ancestral-signal', label: 'Timeless Map', description: 'What you were born carrying', color: AMETHYST },
    ],
  },
];

interface FieldViewProps {
  lastField: FieldId | null;
  onSelectTool: (field: FieldId, tool: ToolId) => void;
  onToggleMeta: () => void;
}

export default function FieldView({ lastField, onSelectTool, onToggleMeta }: FieldViewProps) {
  const [selectedField, setSelectedField] = useState<FieldId | null>(null);

  const handleFieldClick = (fieldId: FieldId) => {
    const field = FIELDS.find(f => f.id === fieldId)!;
    if (field.tools.length === 1) {
      onSelectTool(fieldId, field.tools[0].id);
    } else {
      setSelectedField(fieldId);
    }
  };

  const selectedFieldConfig = selectedField ? FIELDS.find(f => f.id === selectedField) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-ground flex flex-col p-4 md:p-6"
    >
      {/* Meta toggle */}
      <div className="flex justify-end mb-3">
        <button
          onClick={onToggleMeta}
          className="p-2 text-white/25 hover:text-white/55 transition-colors"
          title="All tools"
          aria-label="All tools"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="0" y="0" width="5.5" height="5.5" rx="1.2" />
            <rect x="8.5" y="0" width="5.5" height="5.5" rx="1.2" />
            <rect x="0" y="8.5" width="5.5" height="5.5" rx="1.2" />
            <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {!selectedField ? (
            <motion.div
              key="fields"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 h-full"
              style={{ minHeight: 'calc(100vh - 80px)' }}
            >
              {FIELDS.map(field => (
                <FrequencyField
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  tools={field.tools.map(t => t.label)}
                  lastUsed={field.id === lastField}
                  onClick={() => handleFieldClick(field.id)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="tool-select"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col"
            >
              <button
                onClick={() => setSelectedField(null)}
                className="text-white/35 hover:text-white/65 transition-colors text-sm mb-8 flex items-center gap-2 self-start"
              >
                <span>←</span>
                <span className="uppercase tracking-wider text-xs">{selectedFieldConfig?.label}</span>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl">
                {selectedFieldConfig?.tools.map(tool => (
                  <motion.button
                    key={tool.id}
                    onClick={() => onSelectTool(selectedField, tool.id)}
                    className="p-5 rounded-2xl border border-white/8 hover:border-white/18 text-left transition-colors"
                    style={{ background: '#0d0d0d' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: tool.color }} />
                      <p className="text-white/80 font-semibold text-sm">{tool.label}</p>
                    </div>
                    <p className="text-white/35 text-xs leading-relaxed">{tool.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
