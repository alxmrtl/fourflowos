'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CuriosityPool from './CuriosityPool';
import { AMETHYST } from '@/styles/brand-colors';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

// --- Types ---

interface CuriosityItem {
  id: string;
  text: string;
  source: string;
}

interface Intersection {
  id: string;
  itemIds: string[];
  description: string;
}

interface CuriosityData {
  items: CuriosityItem[];
  intersections: Intersection[];
}

// --- Constants ---

const STORAGE_KEY = 'fourflow-curiosity-explorer';

const PROMPTS = [
  {
    id: 'freeform',
    title: 'Freeform Curiosities',
    question: 'If you had a free afternoon with zero obligations, what would you read about, explore, or tinker with?',
  },
  {
    id: 'strengths',
    title: 'Natural Strengths',
    question: 'What do people come to you for? What feels easy to you but hard for others?',
  },
  {
    id: 'timeless',
    title: 'Timelessness',
    question: 'What activities make you lose track of time? When do hours feel like minutes?',
  },
  {
    id: 'sparks',
    title: 'Past Sparks',
    question: 'What topics, projects, or roles from your past still light you up when you think about them?',
  },
  {
    id: 'secret',
    title: 'Secret Interests',
    question: 'What would you explore if nobody was watching and failure wasn\'t possible?',
  },
];

// --- Helpers ---

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function loadData(): CuriosityData {
  if (typeof window === 'undefined') return { items: [], intersections: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { items: [], intersections: [] };
}

function saveData(data: CuriosityData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

// --- Component ---

export default function CuriosityExplorer() {
  const { user } = useAuth();
  const [data, setData] = useState<CuriosityData>({ items: [], intersections: [] });
  const [phase, setPhase] = useState<'intro' | 'prompts' | 'pool'>('intro');
  const [promptIndex, setPromptIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Slot mode state for prompt phase
  const [slots, setSlots] = useState<string[]>(['', '', '', '', '']);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [extraSlots, setExtraSlots] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadData();
    setData(saved);
    // If user already has items, skip to pool
    if (saved.items.length > 0) {
      setPhase('pool');
    }
    setMounted(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (mounted) saveData(data);
  }, [data, mounted]);

  // Debounced sync to Supabase — 2s after last change
  useEffect(() => {
    if (!mounted || !user) return;
    const timer = setTimeout(() => {
      getSupabaseBrowser()
        .from('curiosity_snapshots')
        .upsert(
          {
            user_id: user.id,
            items: data.items,
            intersections: data.intersections,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )
        .then(({ error }) => {
          if (error) console.error('[CuriosityExplorer] sync failed:', error.message);
        });
    }, 2000);
    return () => clearTimeout(timer);
  }, [data, mounted, user]);

  const addItem = useCallback((text: string, source: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: generateId(), text: trimmed, source }],
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== id),
      intersections: prev.intersections.filter(ix => !ix.itemIds.includes(id)),
    }));
  }, []);

  const updateItem = useCallback((id: string, text: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === id ? { ...i, text } : i),
    }));
  }, []);

  const addIntersection = useCallback((itemIds: string[], description: string) => {
    setData(prev => ({
      ...prev,
      intersections: [...prev.intersections, { id: generateId(), itemIds, description }],
    }));
  }, []);

  const removeIntersection = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      intersections: prev.intersections.filter(ix => ix.id !== id),
    }));
  }, []);

  // Commit filled slots as items
  const commitSlots = useCallback(() => {
    const source = PROMPTS[promptIndex].id;
    const allSlots = [...slots, ...extraSlots];
    allSlots.forEach(text => {
      const trimmed = text.trim();
      if (trimmed) addItem(trimmed, source);
    });
  }, [slots, extraSlots, promptIndex, addItem]);

  const resetSlots = () => {
    setSlots(['', '', '', '', '']);
    setExtraSlots([]);
    setActiveSlotIndex(null);
  };

  const handleSlotChange = (index: number, value: string, isExtra: boolean) => {
    if (isExtra) {
      setExtraSlots(prev => prev.map((s, i) => i === index ? value : s));
    } else {
      setSlots(prev => prev.map((s, i) => i === index ? value : s));
    }
  };

  const handleSlotKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, isExtra: boolean) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const allSlots = [...slots, ...extraSlots];
      const currentVal = isExtra ? extraSlots[index] : slots[index];
      if (!currentVal.trim()) return;
      // Find next empty slot
      const baseLen = slots.length;
      const startSearch = isExtra ? baseLen + index + 1 : index + 1;
      for (let i = startSearch; i < allSlots.length; i++) {
        if (!allSlots[i].trim()) {
          setActiveSlotIndex(i);
          return;
        }
      }
      // All filled, deactivate
      setActiveSlotIndex(null);
    }
    if (e.key === 'Escape') {
      setActiveSlotIndex(null);
    }
  };

  const clearSlot = (index: number, isExtra: boolean) => {
    if (isExtra) {
      setExtraSlots(prev => prev.filter((_, i) => i !== index));
    } else {
      setSlots(prev => prev.map((s, i) => i === index ? '' : s));
    }
  };

  const addExtraSlot = () => {
    setExtraSlots(prev => [...prev, '']);
    setActiveSlotIndex(slots.length + extraSlots.length);
  };

  const filledCount = [...slots, ...extraSlots].filter(s => s.trim()).length;

  const handleNext = () => {
    commitSlots();
    resetSlots();
    if (promptIndex < PROMPTS.length - 1) {
      setPromptIndex(promptIndex + 1);
    } else {
      setPhase('pool');
    }
  };

  const handleBack = () => {
    commitSlots();
    resetSlots();
    if (promptIndex > 0) {
      setPromptIndex(promptIndex - 1);
    }
  };

  const handleReset = () => {
    setData({ items: [], intersections: [] });
    setPhase('intro');
    setPromptIndex(0);
    resetSlots();
  };

  if (!mounted) return null;

  return (
    <section id="curiosity-explorer" className="relative py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {/* --- Phase 1: Introduction --- */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{ background: `${AMETHYST}20`, color: AMETHYST }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Interactive Tool
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                FlowSpark
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-3 leading-relaxed">
                Your curiosities are clues to your purpose. This quick exercise helps you surface what genuinely
                sparks your interest from multiple angles — then find the unique intersections where your flow lives.
              </p>

              {/* 3-step overview */}
              <div className="max-w-md mx-auto mb-6 text-left">
                <p className="text-gray-400 text-sm font-medium mb-3 text-center">This exercise has 3 steps:</p>
                <div className="space-y-2.5">
                  {[
                    { num: 1, text: '5 quick prompts to surface your curiosities from different angles' },
                    { num: 2, text: 'Your curiosity pool — all your sparks in one place' },
                    { num: 3, text: 'Discover intersections — where your unique flow lives' },
                  ].map(step => (
                    <div key={step.num} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: AMETHYST }}
                      >
                        {step.num}
                      </span>
                      <span className="text-gray-400 text-sm leading-relaxed">{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-gray-500 text-sm max-w-xl mx-auto mb-3">
                Each entry = one word or short phrase. One idea at a time.
              </p>
              <p className="text-gray-500 text-sm max-w-xl mx-auto mb-8">
                What you discover here feeds into your Vision, Values, Mission, Role, and Story.
              </p>

              <button
                onClick={() => setPhase('prompts')}
                className="px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${AMETHYST}, ${AMETHYST}cc)`,
                  boxShadow: `0 4px 20px ${AMETHYST}40`,
                }}
              >
                Let&apos;s Begin
              </button>
            </motion.div>
          )}

          {/* --- Phase 2: Guided Prompts --- */}
          {phase === 'prompts' && (
            <motion.div
              key={`prompt-${promptIndex}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              {/* Progress bar */}
              <div className="flex items-center gap-2 mb-8">
                {PROMPTS.map((_, i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{
                      background: i <= promptIndex ? AMETHYST : 'rgba(255,255,255,0.1)',
                    }}
                  />
                ))}
              </div>

              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: AMETHYST }}
              >
                {PROMPTS[promptIndex].title} ({promptIndex + 1}/{PROMPTS.length})
              </p>

              <h3 className="text-xl md:text-2xl font-semibold text-white mb-6 leading-relaxed">
                {PROMPTS[promptIndex].question}
              </h3>

              {/* Slot-based input */}
              <div className="flex flex-wrap gap-2.5 mb-4">
                {slots.map((value, i) => {
                  const isFilled = value.trim().length > 0;
                  const isActive = activeSlotIndex === i;

                  return (
                    <motion.div
                      key={`slot-${i}`}
                      layout
                      className="relative"
                    >
                      {isActive ? (
                        <input
                          type="text"
                          value={value}
                          onChange={e => handleSlotChange(i, e.target.value, false)}
                          onKeyDown={e => handleSlotKeyDown(e, i, false)}
                          onBlur={() => setActiveSlotIndex(null)}
                          placeholder="one word or short phrase..."
                          className="px-4 py-2 rounded-full text-sm bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:border-white/25 min-w-[200px]"
                          style={{ borderColor: AMETHYST }}
                          autoFocus
                        />
                      ) : isFilled ? (
                        <span
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border cursor-pointer"
                          style={{
                            background: `${AMETHYST}20`,
                            borderColor: `${AMETHYST}50`,
                            color: '#e0d0f0',
                          }}
                          onClick={() => setActiveSlotIndex(i)}
                        >
                          {value}
                          <button
                            onClick={e => { e.stopPropagation(); clearSlot(i, false); }}
                            className="text-gray-500 hover:text-white transition-colors ml-0.5"
                          >
                            &times;
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveSlotIndex(i)}
                          className="px-4 py-2 rounded-full text-sm border border-dashed text-gray-600 hover:text-gray-400 hover:border-white/20 transition-colors"
                          style={{ borderColor: `${AMETHYST}30` }}
                        >
                          spark {i + 1}
                        </button>
                      )}
                    </motion.div>
                  );
                })}

                {/* Extra slots */}
                {extraSlots.map((value, i) => {
                  const isFilled = value.trim().length > 0;
                  const globalIndex = slots.length + i;
                  const isActive = activeSlotIndex === globalIndex;

                  return (
                    <motion.div
                      key={`extra-${i}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {isActive ? (
                        <input
                          type="text"
                          value={value}
                          onChange={e => handleSlotChange(i, e.target.value, true)}
                          onKeyDown={e => handleSlotKeyDown(e, i, true)}
                          onBlur={() => setActiveSlotIndex(null)}
                          placeholder="one word or short phrase..."
                          className="px-4 py-2 rounded-full text-sm bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:border-white/25 min-w-[200px]"
                          style={{ borderColor: AMETHYST }}
                          autoFocus
                        />
                      ) : isFilled ? (
                        <span
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border cursor-pointer"
                          style={{
                            background: `${AMETHYST}20`,
                            borderColor: `${AMETHYST}50`,
                            color: '#e0d0f0',
                          }}
                          onClick={() => setActiveSlotIndex(globalIndex)}
                        >
                          {value}
                          <button
                            onClick={e => { e.stopPropagation(); clearSlot(i, true); }}
                            className="text-gray-500 hover:text-white transition-colors ml-0.5"
                          >
                            &times;
                          </button>
                        </span>
                      ) : (
                        <input
                          type="text"
                          value=""
                          onChange={e => handleSlotChange(i, e.target.value, true)}
                          onFocus={() => setActiveSlotIndex(globalIndex)}
                          placeholder="one word or short phrase..."
                          className="px-4 py-2 rounded-full text-sm bg-white/5 border border-dashed text-white placeholder-gray-500 focus:outline-none focus:border-white/25 min-w-[200px]"
                          style={{ borderColor: `${AMETHYST}30` }}
                          autoFocus
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Add more button - only after all 5 base slots are filled */}
              {filledCount >= 5 && (
                <button
                  onClick={addExtraSlot}
                  className="text-sm mb-6 px-3 py-1.5 rounded-full border border-dashed border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-colors"
                >
                  + Add more
                </button>
              )}

              <div className="mb-8" />

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={promptIndex === 0}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Back
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {promptIndex < PROMPTS.length - 1 ? 'Skip' : 'Skip to Pool'}
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${AMETHYST}, ${AMETHYST}cc)`,
                      boxShadow: `0 2px 12px ${AMETHYST}30`,
                    }}
                  >
                    {promptIndex < PROMPTS.length - 1 ? 'Next' : 'View My Pool'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- Phase 3: Curiosity Pool --- */}
          {phase === 'pool' && (
            <motion.div
              key="pool"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Your Curiosity Pool</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {data.items.length} {data.items.length === 1 ? 'item' : 'items'} &middot;{' '}
                    {data.intersections.length} {data.intersections.length === 1 ? 'intersection' : 'intersections'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setPhase('prompts'); setPromptIndex(0); }}
                    className="px-4 py-2 text-sm rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                  >
                    Guided Prompts
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-sm rounded-full border border-white/10 text-gray-500 hover:text-red-400 hover:border-red-400/30 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {data.items.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 mb-4">No curiosities yet. Start by exploring the prompts.</p>
                  <button
                    onClick={() => setPhase('prompts')}
                    className="px-6 py-2.5 rounded-full text-white text-sm font-semibold"
                    style={{ background: AMETHYST }}
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                <CuriosityPool
                  items={data.items}
                  intersections={data.intersections}
                  onAddItem={(text) => addItem(text, 'freeform')}
                  onRemoveItem={removeItem}
                  onUpdateItem={updateItem}
                  onAddIntersection={addIntersection}
                  onRemoveIntersection={removeIntersection}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
