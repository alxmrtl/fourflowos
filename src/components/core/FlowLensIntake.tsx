'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GRADIENTS } from '@/styles/brand-colors';
import ShapePick from './intake/ShapePick';
import WordStorm from './intake/WordStorm';
import ImagePull from './intake/ImagePull';
import TextReflection from './intake/TextReflection';

type Pillar = 'self' | 'space' | 'story' | 'spirit';

/**
 * V5 intake — instinct prior + issue-anchored reflections.
 * Phase 1 (instinct, ~30s): q1 shape, q2 words, q3 images.
 * Phase 2 (the issue): q4 situation, q5 where the energy goes, q6 the voice.
 */
interface UnlockAnswers {
  q1?: Pillar;
  q2?: string[];
  q3?: string[];
  q4?: string;
  q5?: string;
  q6?: string;
}

interface FlowLensIntakeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (answers: any) => void;
  onCancel: () => void;
  submitting: boolean;
}

export default function FlowLensIntake({ onSubmit, onCancel, submitting }: FlowLensIntakeProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [answers, setAnswers] = useState<UnlockAnswers>({});

  const TOTAL = 6;
  const progress = current / TOTAL;

  function advance(next: UnlockAnswers) {
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

  // Q1 — ShapePick (dimension prior)
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

  // Q4 — The situation (anchors the unlock on today's issue)
  function renderQ4() {
    return (
      <TextReflection
        label="The situation"
        question="What are you bringing today? Name the issue, project, or stuck point on your mind."
        placeholder="The specific thing — not the whole life, just today's knot…"
        onSelect={text => advance({ ...answers, q4: text })}
      />
    );
  }

  // Q5 — Where the energy goes (overexposure probe)
  function renderQ5() {
    return (
      <TextReflection
        label="The effort"
        question="What have you already been trying? Where does your effort actually go on this?"
        placeholder="What you keep doing, fixing, researching, rearranging…"
        onSelect={text => advance({ ...answers, q5: text })}
      />
    );
  }

  // Q6 — The voice (internal monologue)
  function renderQ6() {
    return (
      <TextReflection
        label="The voice"
        question="What do you tell yourself when it stalls — when you can't get started or lose the thread?"
        placeholder="The actual internal voice, not the polished version…"
        onSelect={text => onSubmit({ answers: { ...answers, q6: text } })}
      />
    );
  }

  const RENDERERS = [
    renderQ1, renderQ2, renderQ3,
    renderQ4, renderQ5, renderQ6,
  ];

  // Phase label: INSTINCT for q1–q3 (indices 0–2), THE ISSUE for q4–q6 (indices 3–5)
  const phaseLabel   = current < 3 ? 'INSTINCT' : 'THE ISSUE';
  const phaseChanged = current === 3;

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
            style={{ background: GRADIENTS.fourPillar }}
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
          <span className="text-[10px] text-white/20">Reading your pattern…</span>
        )}
      </div>
    </div>
  );
}
