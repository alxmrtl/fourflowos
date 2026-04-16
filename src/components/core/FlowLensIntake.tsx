'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AMETHYST, CORAL, SAGE, STEEL } from '@/styles/brand-colors';
import BigPair from './intake/BigPair';
import ShapePick from './intake/ShapePick';
import WordCloud from './intake/WordCloud';
import ThreeWayTap from './intake/ThreeWayTap';
import PairOff from './intake/PairOff';
import TwoTapPair, { type TwoTapResult } from './intake/TwoTapPair';
import SliderQuestion from './intake/SliderQuestion';

type Pillar = 'self' | 'space' | 'story' | 'spirit';

interface NewAnswers {
  // Phase 1 — rapid instinct
  q1?: 'inward' | 'forward';              // BigPair orientation
  q2?: Pillar;                             // ShapePick shape vote
  q3?: 'sharp' | 'loose';                 // BigPair state texture
  q4?: 'state' | 'setup' | 'direction';  // ThreeWayTap obstacle
  q5?: Pillar;                             // PairOff tournament winner
  q6?: string[];                           // WordCloud selected words

  // Phase 2 — depth check
  q7?: number;                             // Slider 0–1, SELF depth
  q8?: TwoTapResult;                       // TwoTapPair, STORY depth
  q9?: number;                             // Slider 0–1, SPACE depth
  q10?: 'a' | 'b' | 'c' | 'd';           // PlainChoice, SPIRIT depth
  q11?: string;                            // Domain context
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── SVGs for BigPair Q1 ────────────────────────────────────────────────────────

function InwardSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 24 24
           C 24 19.5 29 16 32.5 19.5
           C 36 23 33.5 31 27.5 33
           C 18 36 10 28.5 10 21
           C 10 11.5 18 5 28 5
           C 39.5 5 45 14 44 24"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none"
      />
      <circle cx="24" cy="24" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function ForwardSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="4" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.35" />
      <line x1="2" y1="24" x2="12" y2="24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
      <line x1="4" y1="30" x2="14" y2="30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.35" />
      <line x1="14" y1="24" x2="36" y2="24" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M 28 16 L 38 24 L 28 32" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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

  const q10Options = useMemo(() => shuffle([
    { value: 'a' as const, label: "Strong inner compass — I know when something is off before I can explain why" },
    { value: 'b' as const, label: "Values matter deeply but rarely surface unless something violates them" },
    { value: 'c' as const, label: "Purpose feels clear in good moments but vague when I'm grinding" },
    { value: 'd' as const, label: "Purpose is something I'm still actively working out" },
  ]), []);

  const q11Options = useMemo(() => shuffle([
    { value: 'creative work',             label: 'Creative work' },
    { value: 'career/professional',        label: 'Career / Professional' },
    { value: 'business/entrepreneurship', label: 'Business / Building something' },
    { value: 'personal growth',           label: 'Personal growth / Inner work' },
  ]), []);

  const TOTAL = 11;
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

  function renderQ1() {
    return (
      <BigPair
        options={[
          {
            value: 'inward' as const,
            word: 'INWARD',
            subtext: 'settle · regulate · restore',
            svg: <InwardSVG />,
          },
          {
            value: 'forward' as const,
            word: 'FORWARD',
            subtext: 'build · push · progress',
            svg: <ForwardSVG />,
          },
        ]}
        onSelect={value => advance({ ...answers, q1: value })}
      />
    );
  }

  function renderQ2() {
    return (
      <ShapePick
        onSelect={(value) => advance({ ...answers, q2: value })}
      />
    );
  }

  function renderQ3() {
    return (
      <BigPair
        options={[
          { value: 'sharp' as const, word: 'SHARP' },
          { value: 'loose' as const, word: 'LOOSE' },
        ]}
        onSelect={value => advance({ ...answers, q3: value })}
      />
    );
  }

  function renderQ4() {
    return (
      <ThreeWayTap
        label="What's most in the way right now"
        prompt=""
        options={[
          { value: 'state' as const,     primary: 'MY STATE',     secondary: 'energy · emotions · how I feel' },
          { value: 'setup' as const,     primary: 'THE SETUP',    secondary: 'environment · tools · friction' },
          { value: 'direction' as const, primary: 'THE DIRECTION', secondary: 'clarity · goals · what I\'m aiming at' },
        ]}
        onSelect={value => advance({ ...answers, q4: value })}
      />
    );
  }

  function renderQ5() {
    return (
      <PairOff
        onComplete={winner => advance({ ...answers, q5: winner })}
      />
    );
  }

  function renderQ6() {
    return (
      <WordCloud
        maxSelect={2}
        onSelect={words => advance({ ...answers, q6: words })}
      />
    );
  }

  function renderQ7() {
    return (
      <SliderQuestion
        text="Your body sends signals. How often do you read them in time?"
        leftLabel="Rarely catch it"
        rightLabel="Same day"
        onSelect={value => advance({ ...answers, q7: value })}
      />
    );
  }

  function renderQ8() {
    return (
      <TwoTapPair
        label="Direction clarity"
        prompt1="Which of these feels clearest for you right now?"
        prompt2="And which is haziest?"
        options={[
          { id: 'purpose', label: 'I know why this matters long-term' },
          { id: 'mission', label: 'I know my 90-day direction' },
          { id: 'goal',    label: "I know what I'm shipping this week" },
          { id: 'task',    label: "I know what I'm doing in the next hour" },
        ]}
        onComplete={result => advance({ ...answers, q8: result })}
      />
    );
  }

  function renderQ9() {
    return (
      <SliderQuestion
        text="How much is your environment fighting you right now?"
        leftLabel="Total friction"
        rightLabel="Completely clear"
        onSelect={value => advance({ ...answers, q9: value })}
      />
    );
  }

  function renderQ10() {
    return (
      <div className="flex flex-col">
        <p className="text-[9px] uppercase tracking-widest text-white/25 mb-5">Values &amp; purpose</p>
        <p className="text-white text-base font-medium leading-snug mb-6">Your relationship with values and purpose:</p>
        <div className="space-y-2">
          {q10Options.map(opt => (
            <motion.button
              key={opt.value}
              whileTap={{ scale: 0.98 }}
              onClick={() => advance({ ...answers, q10: opt.value })}
              className="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.025)',
                borderColor: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.5)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.025)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)';
              }}
            >
              {opt.label}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  function renderQ11() {
    return (
      <div className="flex flex-col">
        <p className="text-[9px] uppercase tracking-widest text-white/25 mb-5">Context</p>
        <p className="text-white text-base font-medium leading-snug mb-6">Your primary domain right now:</p>
        <div className="grid grid-cols-2 gap-2.5">
          {q11Options.map(opt => (
            <motion.button
              key={opt.value}
              whileTap={{ scale: 0.97 }}
              onClick={() => advance({ ...answers, q11: opt.value })}
              className="flex items-center justify-center text-center px-3 py-4 rounded-2xl border text-sm font-medium transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.025)',
                borderColor: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.45)',
                minHeight: 72,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.025)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)';
              }}
            >
              {opt.label}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  const RENDERERS = [
    renderQ1, renderQ2, renderQ3, renderQ4, renderQ5, renderQ6,
    renderQ7, renderQ8, renderQ9, renderQ10, renderQ11,
  ];

  // Phase label shown above progress bar
  const phaseLabel = current < 6 ? 'INSTINCT' : 'DEPTH';
  const phaseChanged = current === 6; // crossing from instinct to depth

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
          <span className="text-[10px] text-white/20">Generating...</span>
        )}
      </div>
    </div>
  );
}
