'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AMETHYST, STEEL, CORAL, SAGE, GRADIENTS } from '@/styles/brand-colors';

type Pillar = 'self' | 'space' | 'story' | 'spirit';
type DepthAnswer = 'a' | 'b' | 'c' | 'd';

interface Answers {
  q1?: Pillar; q2?: Pillar; q3?: Pillar; q4?: Pillar; q5?: Pillar;
  q6?: DepthAnswer; q7?: DepthAnswer; q8?: DepthAnswer; q9?: DepthAnswer;
  q10?: Pillar; q11?: Pillar; q12?: string;
}

interface Question {
  id: keyof Answers;
  text: string;
  options: { value: string; label: string }[];
}

const PILLAR_COLORS: Record<Pillar, string> = {
  self: CORAL,
  space: SAGE,
  story: STEEL,
  spirit: AMETHYST,
};

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'When something important isn\'t working, where do you instinctively look first?',
    options: [
      { value: 'self',   label: 'My body, energy, or emotional state' },
      { value: 'space',  label: 'My environment, tools, or setup' },
      { value: 'story',  label: 'My goals, direction, or the plan' },
      { value: 'spirit', label: 'My deeper purpose — whether this still matters' },
    ],
  },
  {
    id: 'q2',
    text: 'When you\'re at your best, what made the difference?',
    options: [
      { value: 'self',   label: 'I was well-rested, moving, emotionally regulated' },
      { value: 'space',  label: 'My environment was clean and my tools were dialed in' },
      { value: 'story',  label: 'I had total clarity on what I was aiming at' },
      { value: 'spirit', label: 'I felt deeply connected to why this mattered' },
    ],
  },
  {
    id: 'q3',
    text: 'The first thing you skip when life gets busy:',
    options: [
      { value: 'self',   label: 'Sleep, movement, emotional processing' },
      { value: 'space',  label: 'Keeping my workspace and systems clean' },
      { value: 'story',  label: 'Checking whether the direction still makes sense' },
      { value: 'spirit', label: 'Reconnecting to what actually matters to me' },
    ],
  },
  {
    id: 'q4',
    text: 'Watching someone else struggle, you most often think they\'re missing:',
    options: [
      { value: 'self',   label: 'Self-awareness — they\'re depleted or emotionally reactive' },
      { value: 'space',  label: 'Better tools or a cleaner environment' },
      { value: 'story',  label: 'A clear goal — they\'re working without real direction' },
      { value: 'spirit', label: 'They\'ve lost the thread back to what it\'s actually for' },
    ],
  },
  {
    id: 'q5',
    text: 'When you explain your stuck periods to yourself, it\'s usually:',
    options: [
      { value: 'self',   label: '"I was depleted — not in a good state"' },
      { value: 'space',  label: '"The setup wasn\'t right — too much friction"' },
      { value: 'story',  label: '"I lost the thread — wasn\'t sure what I was aiming for"' },
      { value: 'spirit', label: '"I\'d lost the signal — nothing felt worth doing because I couldn\'t locate what I actually cared about"' },
    ],
  },
  {
    id: 'q6',
    text: 'When you\'ve been off lately — under-performing, irritable, foggy — how long before you connect it to something physical?',
    options: [
      { value: 'a', label: 'Within a day — I notice it and act on it' },
      { value: 'b', label: 'A few days — I figure it out eventually and adjust' },
      { value: 'c', label: 'I usually realize it in hindsight, after the slump has passed' },
      { value: 'd', label: 'Honestly, I rarely make that connection' },
    ],
  },
  {
    id: 'q7',
    text: 'Your relationship with your environment and tools:',
    options: [
      { value: 'a', label: 'Constantly optimizing — I enjoy designing the setup' },
      { value: 'b', label: 'Functional minimalist — I use what works and don\'t overthink it' },
      { value: 'c', label: 'I know my environment affects me but rarely address it' },
      { value: 'd', label: 'Overwhelmed by setup friction, don\'t prioritize fixing it' },
    ],
  },
  {
    id: 'q8',
    text: 'Your relationship with goals and direction:',
    options: [
      { value: 'a', label: 'Strong clarity — I always know what I\'m pointed at' },
      { value: 'b', label: 'Sense of movement — direction matters more than a fixed target' },
      { value: 'c', label: 'The vision is clear but near-term missions feel fuzzy' },
      { value: 'd', label: 'Direction tends to drift when I\'m deep in execution' },
    ],
  },
  {
    id: 'q9',
    text: 'Your relationship with values and purpose:',
    options: [
      { value: 'a', label: 'Strong inner compass — I know when something is off before I can explain why' },
      { value: 'b', label: 'Values matter deeply but rarely surface unless something violates them' },
      { value: 'c', label: 'Purpose feels clear in good moments but vague when I\'m grinding' },
      { value: 'd', label: 'Purpose is something I\'m still actively working out' },
    ],
  },
  {
    id: 'q10',
    text: 'When you lose momentum mid-session, your first move is usually:',
    options: [
      { value: 'self',   label: 'Step away physically — move, breathe, reset the body' },
      { value: 'space',  label: 'Adjust the environment — change the setup or location' },
      { value: 'story',  label: 'Reorient — reconnect to what I\'m actually trying to accomplish' },
      { value: 'spirit', label: 'Pause and ask whether this is still worth the energy' },
    ],
  },
  {
    id: 'q11',
    text: 'The type of advice you most naturally give others:',
    options: [
      { value: 'self',   label: '"Take care of yourself — rest, move, regulate"' },
      { value: 'space',  label: '"Here\'s a tool or workflow that would help"' },
      { value: 'story',  label: '"Let\'s get clear on what you actually want"' },
      { value: 'spirit', label: '"Why does this matter to you? Is this still yours?"' },
    ],
  },
  {
    id: 'q12',
    text: 'What\'s your primary domain right now?',
    options: [
      { value: 'creative work',   label: 'Creative work' },
      { value: 'career/professional', label: 'Career / Professional' },
      { value: 'business/entrepreneurship', label: 'Business / Building something' },
      { value: 'personal growth', label: 'Personal growth / Inner work' },
    ],
  },
];

interface FlowLensIntakeProps {
  onSubmit: (answers: Answers) => void;
  onCancel: () => void;
  submitting: boolean;
}

export default function FlowLensIntake({ onSubmit, onCancel, submitting }: FlowLensIntakeProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const q = QUESTIONS[current];
  const totalQuestions = QUESTIONS.length;
  const progress = current / totalQuestions;

  function selectAnswer(value: string) {
    const newAnswers = { ...answers, [q.id]: value as Pillar & DepthAnswer };
    setAnswers(newAnswers);

    if (current < totalQuestions - 1) {
      setDirection('forward');
      setTimeout(() => setCurrent(c => c + 1), 160);
    } else {
      onSubmit(newAnswers as Required<Answers>);
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

  const isPillarQuestion = ['q1','q2','q3','q4','q5','q10','q11'].includes(q.id);

  return (
    <div className="flex flex-col h-full">
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
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col"
        >
          <p className="text-[10px] tracking-widest uppercase text-white/25 mb-3">
            {current + 1} / {totalQuestions}
          </p>
          <p className="text-white text-base font-medium leading-snug mb-6">{q.text}</p>

          <div className="space-y-2">
            {q.options.map(opt => {
              const isSelected = answers[q.id] === opt.value;
              const isPillarOpt = ['self', 'space', 'story', 'spirit'].includes(opt.value);
              const accentColor = isPillarOpt ? PILLAR_COLORS[opt.value as Pillar] : AMETHYST;

              return (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer(opt.value)}
                  disabled={submitting}
                  className="w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 text-sm"
                  style={{
                    background: isSelected ? `${accentColor}18` : 'rgba(255,255,255,0.03)',
                    borderColor: isSelected ? `${accentColor}60` : 'rgba(255,255,255,0.07)',
                    color: isSelected ? '#fff' : 'rgba(255,255,255,0.55)',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
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
        <span className="text-[10px] text-white/15">
          {submitting ? 'Generating...' : 'Select to advance'}
        </span>
      </div>
    </div>
  );
}
