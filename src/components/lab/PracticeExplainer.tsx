'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SECTIONS } from './sections-data';
import { APPS } from '@/data/apps';

// Content adapted from the retired public /apps Practice page — the
// tools-as-prescriptions framing lives here now (and on /framework).

const IOS_APPS = [
  { id: 'flowrep', note: 'Live on iOS' },
  { id: 'flowhabits', note: 'Coming soon' },
];

interface PracticeExplainerProps {
  open: boolean;
  onClose: () => void;
}

export default function PracticeExplainer({ open, onClose }: PracticeExplainerProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-ground-lift p-6 md:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:border-white/30 transition-colors"
              aria-label="Close"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-2">
              Your Practice
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-normal text-white mb-3">
              The tools that train flow.
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-8">
              These tools work best as prescriptions: your Flow Profile shows which key is
              blocked, and the matching tool opens it. Start there, or begin anywhere —
              every session counts toward the same practice.
            </p>

            {/* The four sections */}
            <div className="space-y-4 mb-8">
              {SECTIONS.map((section) => (
                <div
                  key={section.id}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
                >
                  <div className="flex items-baseline gap-2.5 mb-1.5">
                    <span
                      className="text-xs font-bold uppercase tracking-[0.22em]"
                      style={{ color: section.color }}
                    >
                      {section.label}
                    </span>
                    <span className="text-xs text-gray-500">{section.description}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {section.tools.map((tool) => (
                      <span key={tool.id} className="text-xs text-gray-400">
                        <span className="text-gray-200">{tool.label}</span>
                        {' — '}
                        {tool.description.toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Beyond the browser */}
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-3">
                Beyond the browser
              </p>
              <div className="space-y-2.5">
                {IOS_APPS.map(({ id, note }) => {
                  const app = APPS[id];
                  if (!app) return null;
                  return (
                    <div key={id} className="flex items-center gap-3">
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image src={app.icon} alt={app.name} fill className="object-contain rounded-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200">
                          {app.name}
                          <span className="ml-2 px-1.5 py-0.5 bg-white/8 rounded text-[9px] text-gray-500 uppercase font-semibold tracking-wider align-middle">
                            {note}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 truncate">{app.tagline}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors"
            >
              Begin
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
