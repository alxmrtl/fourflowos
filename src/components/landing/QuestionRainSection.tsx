'use client';

import { AnimatePresence, motion, useInView, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GRADIENTS } from '@/styles/brand-colors';
import PrincipleBridge from './PrincipleBridge';

const QUESTIONS = [
  'What makes me come alive?',
  'What am I putting off that actually matters?',
  'When do I feel most like myself?',
  "Why can't I just focus?",
  'What am I doing this for?',
  'What lights me up without wearing me out?',
  'What do I actually want?',
  'What am I waiting for?',
  'When did I stop trusting myself?',
  "What's pulling me forward?",
];

interface RainItem {
  id: number;
  text: string;
  x: number;        // base horizontal offset
  drift: number;    // how strongly this one leans away from the pointer
  duration: number; // fall time — varied so the rain never loops visibly
}

let uid = 0;

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** One falling question — leans away from the pointer as it falls. */
function FallingQuestion({ item, pointerX, onDone }: {
  item: RainItem;
  pointerX: MotionValue<number>;
  onDone: (id: number) => void;
}) {
  const lean = useTransform(pointerX, v => v * item.drift);
  const x = useSpring(lean, { stiffness: 50, damping: 18 });

  return (
    <motion.div
      className="absolute left-0 right-0"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 260, opacity: [0, 1, 1, 0] }}
      transition={{
        duration: item.duration,
        y: { ease: 'easeIn', duration: item.duration },
        opacity: { duration: item.duration, times: [0, 0.08, 0.82, 1], ease: 'linear' },
      }}
      onAnimationComplete={() => onDone(item.id)}
    >
      <motion.p
        className="text-center font-display text-xl md:text-2xl italic bg-clip-text text-transparent"
        style={{ x, marginLeft: item.x, backgroundImage: GRADIENTS.textAccent }}
      >
        {item.text}
      </motion.p>
    </motion.div>
  );
}

function QuestionRain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });
  const [items, setItems] = useState<RainItem[]>([]);
  const orderRef = useRef<string[]>([]);
  const queueRef = useRef(0);

  // Pointer lean: -1 (far left) … 1 (far right), zero on touch devices.
  const pointerX = useMotionValue(0);
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const onMove = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      pointerX.set(Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width - 0.5) * 2)));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [pointerX]);

  const addItem = useCallback(() => {
    // Reshuffle each full pass so the order never repeats predictably.
    if (queueRef.current % QUESTIONS.length === 0) {
      orderRef.current = shuffled(QUESTIONS);
    }
    const text = orderRef.current[queueRef.current % QUESTIONS.length];
    queueRef.current++;
    setItems(prev => [
      ...prev,
      {
        id: uid++,
        text,
        x: Math.round((Math.random() - 0.5) * 72),
        drift: -(8 + Math.random() * 20),
        duration: 4.1 + Math.random() * 1.3,
      },
    ]);
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  useEffect(() => {
    if (!isInView) {
      setItems([]);
      queueRef.current = 0;
      return;
    }
    addItem();
    const interval = setInterval(addItem, 1800);
    return () => clearInterval(interval);
  }, [isInView, addItem]);

  return (
    <div
      ref={containerRef}
      className="relative h-64 md:h-72 overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
      }}
    >
      <AnimatePresence>
        {items.map(item => (
          <FallingQuestion key={item.id} item={item} pointerX={pointerX} onDone={removeItem} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function QuestionRainSection() {
  return (
    <section id="anchor" className="relative min-h-screen flex flex-col justify-center py-20 md:py-24 bg-ground-deep">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />
      <div className="relative max-w-3xl mx-auto px-6">
        <h2 className="text-center font-display text-3xl md:text-5xl font-normal text-white leading-[1.15] mb-10 md:mb-14">
          You already know{' '}
          <span
            className="italic bg-clip-text text-transparent"
            style={{ backgroundImage: GRADIENTS.textWide }}
          >
            there&apos;s more
          </span>
          .
        </h2>
        <QuestionRain />
        <PrincipleBridge>They all point at one thing.</PrincipleBridge>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
