'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AMETHYST, STEEL } from '@/styles/brand-colors';
import ShapePick from './intake/ShapePick';
import WordStorm from './intake/WordStorm';
import ImagePull from './intake/ImagePull';
import TextReflection from './intake/TextReflection';

type Pillar = 'self' | 'space' | 'story' | 'spirit';

interface NewAnswers {
  // Phase 1 — rapid instinct
  q1?: Pillar;       // ShapePick shape vote
  q2?: string[];     // WordStorm: 3 selected words
  q3?: string[];     // ImagePull: 2 selected image IDs
  q4?: string;       // Domain context

  // Phase 2 — open signal (4 text questions)
  q5?: string;       // "What's getting in the way?"
  q6?: string;       // "Describe last flow state"
  q7?: string;       // "What do you tell yourself?"
  q8?: string;       // "What are you actually chasing?"
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Domain icons ───────────────────────────────────────────────────────────────

function CreativeSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6,26 L10,18 L24,4 C25.1,2.9 26.9,2.9 28,4 C29.1,5.1 29.1,6.9 28,8 L14,22 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <line x1="6" y1="26" x2="12" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CareerSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="12" width="26" height="17" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M11,12 L11,9 C11,7.9 11.9,7 13,7 L19,7 C20.1,7 21,7.9 21,9 L21,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="20" x2="29" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function BusinessSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4"  y="18" width="7"  height="10" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="12" width="7"  height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="22" y="6"  width="7"  height="22" rx="1.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function GrowthSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16,28 L16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16,14 C16,8 10,6 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16,18 C16,12 22,10 24,13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

interface FlowLensIntakeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (answers: any) => void;
  onCancel: () => void;
  submitting: boolean;
}

export default function FlowLensIntake({ onSubmit, onCancel, submitting }: FlowLensIntakeProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [answers, setAnswers] = useState<NewAnswers>({});

  const q4Options = useMemo(() => shuffle([
    { value: 'creative work',             label: 'Creative',    icon: <CreativeSVG /> },
    { value: 'career/professional',        label: 'Career',      icon: <CareerSVG /> },
    { value: 'business/entrepreneurship', label: 'Building',    icon: <BusinessSVG /> },
    { value: 'personal growth',           label: 'Growth',      icon: <GrowthSVG /> },
  ]), []);

  // 8 questions: 4 instinct + 4 signal
  const TOTAL = 8;
  const progress = current / TOTAL;

  function advance(next: NewAnswers) {
    if (current < TOTAL - 1) {
      setDirection('forward');
      setAnswers(next);
      setCurrent(c => c + 1);
    } else {
      onSubmit({ answers: next });
    }
  }

  function goBack() {
    if (current > 0) {
      setDirection('back');
      setCurrent(c => c - 1);
    } else {
      onCancel();
    }
  }

  // ── Question renderers ─────────────────────────────────────────────────────

  // Q1 — ShapePick (pillar vote)
  function renderQ1() {
    return (
      <ShapePick
        onSelect={(value) => advance({ ...answers, q1: value })}
      />
    );
  }

  // Q2 — WordStorm
  function renderQ2() {
    return (
      <WordStorm
        onSelect={words => advance({ ...answers, q2: words })}
      />
    );
  }

  // Q3 — ImagePull
  function renderQ3() {
    return (
      <ImagePull
        onSelect={images => advance({ ...answers, q3: images })}
      />
    );
  }

  // Q4 — Domain context
  function renderQ4() {
    return (
      <div className="flex flex-col">
        <p className="text-[9px] uppercase tracking-widest text-white/25 mb-1.5">Context</p>
        <p className="text-white text-base font-medium leading-snug mb-5">Where is the block showing up?</p>
        <div className="grid grid-cols-2 gap-2.5">
          {q4Options.map(opt => (
            <motion.button
              key={opt.value}
              whileTap={{ scale: 0.97 }}
              onClick={() => advance({ ...answers, q4: opt.value })}
              className="flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-2xl border transition-all duration-200"
              style={{
                background:  'rgba(255,255,255,0.025)',
                borderColor: 'rgba(255,255,255,0.07)',
                color:       'rgba(255,255,255,0.4)',
                minHeight:   80,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLButtonElement).style.background  = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLButtonElement).style.color       = 'rgba(255,255,255,0.75)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLButtonElement).style.background  = 'rgba(255,255,255,0.025)';
                (e.currentTarget as HTMLButtonElement).style.color       = 'rgba(255,255,255,0.4)';
              }}
            >
              {opt.icon}
              <span className="text-xs font-medium tracking-wide">{opt.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Q5 — What's blocking
  function renderQ5() {
    return (
      <TextReflection
        label="Signal"
        question="What's getting in the way of your best work right now?"
        placeholder="Be specific — could be internal, external, or just unclear…"
        onSelect={text => advance({ ...answers, q5: text })}
      />
    );
  }

  // Q6 — Last flow state
  function renderQ6() {
    return (
      <TextReflection
        label="Signal"
        question="Describe the last time you were fully in it. Walk me through what made it possible."
        placeholder="The last time things clicked — what were the conditions…"
        onSelect={text => advance({ ...answers, q6: text })}
      />
    );
  }

  // Q7 — Internal monologue
  function renderQ7() {
    return (
      <TextReflection
        label="Signal"
        question="What do you tell yourself when you can't get started — or when you lose the thread mid-work?"
        placeholder="The actual internal voice, not the polished version…"
        onSelect={text => advance({ ...answers, q7: text })}
      />
    );
  }

  // Q8 — What they're really chasing
  function renderQ8() {
    return (
      <TextReflection
        label="Signal"
        question="What are you actually chasing right now? Not what you should be chasing — what is it really?"
        placeholder="Honest answer — the thing underneath the thing…"
        onSelect={text => onSubmit({ answers: { ...answers, q8: text } })}
      />
    );
  }

  const RENDERERS = [
    renderQ1, renderQ2, renderQ3, renderQ4,
    renderQ5, renderQ6, renderQ7, renderQ8,
  ];

  // Phase label: INSTINCT for q1–q4 (indices 0–3), SIGNAL for q5–q8 (indices 4–7)
  const phaseLabel   = current < 4 ? 'INSTINCT' : 'SIGNAL';
  const phaseChanged = current === 4;

  return (
    <div className="flex flex-col">
      {/* Phase + progress */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-2.5">
          <AnimatePresence mode="wait">
            <motion.p
              key={phaseLabel}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-[9px] uppercase tracking-widest"
              style={{ color: phaseChanged ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.2)' }}
            >
              {phaseLabel}
            </motion.p>
          </AnimatePresence>
          <p className="text-[9px] text-white/20">{current + 1} / {TOTAL}</p>
        </div>
        <div className="h-px bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${STEEL}, ${AMETHYST})` }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: direction === 'forward' ? 18 : -18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction === 'forward' ? -18 : 18 }}
          transition={{ duration: 0.17 }}
          className="flex-1 flex flex-col"
        >
          {RENDERERS[current]()}
        </motion.div>
      </AnimatePresence>

      {/* Back / cancel */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={goBack}
          className="text-xs transition-colors"
          style={{ color: 'rgba(255,255,255,0.2)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.2)'; }}
        >
          {current === 0 ? 'Cancel' : '← Back'}
        </button>
        {submitting && (
          <span className="text-[10px] text-white/20">Reading your signal…</span>
        )}
      </div>
    </div>
  );
}
