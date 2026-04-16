'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AMETHYST, STEEL } from '@/styles/brand-colors';
import InstinctTap from './intake/InstinctTap';
import ImagePick from './intake/ImagePick';
import SliderQuestion from './intake/SliderQuestion';
import DragRank from './intake/DragRank';

type Pillar = 'self' | 'space' | 'story' | 'spirit';
type DepthAnswer = 'a' | 'b' | 'c' | 'd';

interface NewAnswers {
  q1?: Pillar;          // instinct tap — pillar vote
  q2?: Pillar;          // instinct tap — pillar vote
  q3?: Pillar;          // image pick — pillar vote
  q4?: number;          // slider 0–1 — SELF depth
  q5?: string[];        // drag rank — SPACE depth
  q6?: Pillar;          // instinct tap — pillar vote
  q7?: string[];        // drag rank — STORY depth
  q8?: DepthAnswer;     // plain choice — SPIRIT depth
  q9?: string;          // domain context (distractor)
}

interface AnswerMetadata {
  instinct_timings: Partial<Record<'q1' | 'q2' | 'q6', number>>;
  q4_value?: number;
  q5_order?: string[];
  q7_order?: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
  const [answers, setAnswers] = useState<NewAnswers>({});
  const [metadata, setMetadata] = useState<AnswerMetadata>({ instinct_timings: {} });

  // Shuffle options for PlainChoice questions once on mount
  const q8Options = useMemo(() => shuffle([
    { value: 'a', label: "Strong inner compass — I know when something is off before I can explain why" },
    { value: 'b', label: "Values matter deeply but rarely surface unless something violates them" },
    { value: 'c', label: "Purpose feels clear in good moments but vague when I'm grinding" },
    { value: 'd', label: "Purpose is something I'm still actively working out" },
  ]), []);

  const q9Options = useMemo(() => shuffle([
    { value: 'creative work',             label: 'Creative work' },
    { value: 'career/professional',        label: 'Career / Professional' },
    { value: 'business/entrepreneurship', label: 'Business / Building something' },
    { value: 'personal growth',           label: 'Personal growth / Inner work' },
  ]), []);

  const TOTAL = 9;
  const progress = current / TOTAL;

  function advance(newAnswers: NewAnswers) {
    if (current < TOTAL - 1) {
      setDirection('forward');
      setAnswers(newAnswers);
      setCurrent(c => c + 1);
    } else {
      onSubmit({ answers: newAnswers, answer_metadata: metadata });
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

  // ── Question renderers ───────────────────────────────────────────────────────

  function renderQ1() {
    return (
      <InstinctTap
        text="When something important isn't working, where do you look first?"
        options={[
          { value: 'self',   label: 'My body, energy, or emotional state' },
          { value: 'space',  label: 'My environment, tools, or setup' },
          { value: 'story',  label: 'My goals, direction, or the plan' },
          { value: 'spirit', label: 'My deeper purpose — whether this still matters' },
        ]}
        onSelect={(value, elapsedMs) => {
          const next = { ...answers, q1: value };
          setMetadata(m => ({ ...m, instinct_timings: { ...m.instinct_timings, q1: elapsedMs } }));
          advance(next);
        }}
      />
    );
  }

  function renderQ2() {
    return (
      <InstinctTap
        text="When you're at your best, what made the difference?"
        options={[
          { value: 'self',   label: 'I was well-rested, moving, emotionally regulated' },
          { value: 'space',  label: 'My environment was clean and my tools were dialed in' },
          { value: 'story',  label: 'I had total clarity on what I was aiming at' },
          { value: 'spirit', label: 'I felt deeply connected to why this mattered' },
        ]}
        onSelect={(value, elapsedMs) => {
          const next = { ...answers, q2: value };
          setMetadata(m => ({ ...m, instinct_timings: { ...m.instinct_timings, q2: elapsedMs } }));
          advance(next);
        }}
      />
    );
  }

  function renderQ3() {
    return (
      <ImagePick
        text="Which of these pulls you?"
        onSelect={value => {
          advance({ ...answers, q3: value });
        }}
      />
    );
  }

  function renderQ4() {
    return (
      <SliderQuestion
        text="How quickly do you notice when your physical state is affecting your work?"
        leftLabel="Rarely make the connection"
        rightLabel="Within hours, same day"
        onSelect={value => {
          setMetadata(m => ({ ...m, q4_value: value }));
          advance({ ...answers, q4: value });
        }}
      />
    );
  }

  function renderQ5() {
    return (
      <DragRank
        text="Rank these by how much they'd improve your next work session"
        items={[
          { id: 'env',      label: 'My workspace is clear and set up right' },
          { id: 'tools',    label: 'I have the exact tool I need, no friction' },
          { id: 'feedback', label: "I know what signal I'll track as I go" },
          { id: 'social',   label: "Others know I'm working and won't interrupt" },
        ]}
        onSubmit={orderedIds => {
          setMetadata(m => ({ ...m, q5_order: orderedIds }));
          advance({ ...answers, q5: orderedIds });
        }}
      />
    );
  }

  function renderQ6() {
    return (
      <InstinctTap
        text="When you lose momentum mid-session, your first move is usually..."
        options={[
          { value: 'self',   label: 'Step away physically — move, breathe, reset the body' },
          { value: 'space',  label: 'Adjust the environment — change the setup or location' },
          { value: 'story',  label: "Reorient — reconnect to what I'm actually trying to accomplish" },
          { value: 'spirit', label: 'Pause and ask whether this is still worth the energy' },
        ]}
        onSelect={(value, elapsedMs) => {
          const next = { ...answers, q6: value };
          setMetadata(m => ({ ...m, instinct_timings: { ...m.instinct_timings, q6: elapsedMs } }));
          advance(next);
        }}
      />
    );
  }

  function renderQ7() {
    return (
      <DragRank
        text="Rank these by how clear each feels for you right now"
        items={[
          { id: 'purpose', label: 'I know why this matters long-term' },
          { id: 'mission', label: 'I know my 90-day target' },
          { id: 'goal',    label: "I know exactly what I'm shipping this week" },
          { id: 'task',    label: "I know what I'm doing in the next hour" },
        ]}
        onSubmit={orderedIds => {
          setMetadata(m => ({ ...m, q7_order: orderedIds }));
          advance({ ...answers, q7: orderedIds });
        }}
      />
    );
  }

  function renderQ8() {
    return (
      <div className="flex flex-col">
        <p className="text-[9px] uppercase tracking-widest text-white/25 mb-5">Depth check</p>
        <p className="text-white text-base font-medium leading-snug mb-6">Your relationship with values and purpose:</p>
        <div className="space-y-2">
          {q8Options.map(opt => (
            <button
              key={opt.value}
              onClick={() => advance({ ...answers, q8: opt.value as DepthAnswer })}
              className="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 hover:border-white/15 hover:bg-white/[0.05]"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function renderQ9() {
    return (
      <div className="flex flex-col">
        <p className="text-[9px] uppercase tracking-widest text-white/25 mb-5">Context</p>
        <p className="text-white text-base font-medium leading-snug mb-6">Your primary domain right now:</p>
        <div className="space-y-2">
          {q9Options.map(opt => (
            <button
              key={opt.value}
              onClick={() => advance({ ...answers, q9: opt.value })}
              className="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 hover:border-white/15 hover:bg-white/[0.05]"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const RENDERERS = [
    renderQ1, renderQ2, renderQ3, renderQ4, renderQ5,
    renderQ6, renderQ7, renderQ8, renderQ9,
  ];

  return (
    <div className="flex flex-col">
      {/* Progress bar */}
      <div className="h-0.5 bg-white/[0.06] rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${STEEL}, ${AMETHYST})` }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: direction === 'forward' ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction === 'forward' ? -20 : 20 }}
          transition={{ duration: 0.18 }}
          className="flex-1 flex flex-col"
        >
          <p className="text-[10px] tracking-widest uppercase text-white/20 mb-3">
            {current + 1} / {TOTAL}
          </p>
          {RENDERERS[current]()}
        </motion.div>
      </AnimatePresence>

      {/* Back / cancel */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={goBack}
          className="text-xs text-white/25 hover:text-white/50 transition-colors"
        >
          {current === 0 ? 'Cancel' : '← Back'}
        </button>
        {submitting && (
          <span className="text-[10px] text-white/20">Generating...</span>
        )}
      </div>
    </div>
  );
}
