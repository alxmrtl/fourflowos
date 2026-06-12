'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GRADIENTS } from '@/styles/brand-colors';

const QUESTIONS = [
  'What makes me come alive?',
  'When did this last feel easy?',
  'What was different about that day?',
  'Why do I have to push for what used to be natural?',
  'What am I putting off that actually matters?',
  'What lights me up without burning me out?',
  'Why does my best feel so far from my baseline?',
  'What\'s between me and the work that matters?',
  'When do I feel most like myself?',
  'What am I building, really?',
  'Why isn\'t it always like this?',
  'What does moving well through life look like?',
];

// Subtle horizontal offsets per question index (px from center)
const X_OFFSETS = [0, -24, 18, -32, 28, 8, -18, 32, -8, 22, -28, 12];

interface RainItem {
  id: number;
  text: string;
  x: number;
}

let uid = 0;

function QuestionRain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });
  const [items, setItems] = useState<RainItem[]>([]);
  const queueRef = useRef(0);

  const addItem = useCallback(() => {
    const idx = queueRef.current % QUESTIONS.length;
    queueRef.current++;
    setItems(prev => [
      ...prev,
      { id: uid++, text: QUESTIONS[idx], x: X_OFFSETS[idx] },
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
      className="relative h-52 overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
      }}
    >
      <AnimatePresence>
        {items.map(item => (
          <motion.p
            key={item.id}
            className="absolute left-0 right-0 text-center font-display text-xl md:text-2xl italic bg-clip-text text-transparent"
            style={{ x: item.x, backgroundImage: GRADIENTS.textAccent }}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 210, opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 4.5,
              y: { ease: 'easeIn', duration: 4.5 },
              opacity: { duration: 4.5, times: [0, 0.08, 0.82, 1], ease: 'linear' },
            }}
            onAnimationComplete={() => removeItem(item.id)}
          >
            {item.text}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ScrollParagraph({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 56, filter: 'blur(14px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.0, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function HonestMomentSection() {
  return (
    <section id="honest-moment" className="relative py-32 md:py-44 bg-ground-deep">

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      <div className="relative max-w-2xl mx-auto px-6 space-y-12">
        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            You&apos;ve been there.
          </p>
        </ScrollParagraph>

        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            The drive home you don&apos;t remember taking. The afternoon that ended before you noticed it starting. The run where you forgot you were running. The conversation that flew on its own and left you lighter than when it started. The thirty minutes of work that felt like five. The kid you were playing with when you forgot what time it was.
          </p>
        </ScrollParagraph>

        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            You came back from it different.
          </p>
        </ScrollParagraph>

        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            Then it&apos;s gone. Effort comes back. The clock thickens. You try to push your way back in — by force, by coffee, by changing rooms — and nothing takes.
          </p>
        </ScrollParagraph>

        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            So you start to ask yourself questions.
          </p>
        </ScrollParagraph>

        <QuestionRain />

        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            These don&apos;t get answered by thinking harder. They dissolve inside the state where they don&apos;t need to be asked.
          </p>
          <p className="font-sans text-lg text-gray-400 leading-[1.8] mt-4">
            People have been finding their way to that{' '}
            <motion.span
              className="bg-clip-text text-transparent"
              style={{ display: 'inline-block', backgroundImage: GRADIENTS.textAccent }}
              animate={{
                filter: [
                  'drop-shadow(0 0 5px rgba(232,69,53,0.55)) drop-shadow(0 0 14px rgba(232,69,53,0.22))',
                  'drop-shadow(0 0 5px rgba(62,111,163,0.65)) drop-shadow(0 0 14px rgba(62,111,163,0.28))',
                  'drop-shadow(0 0 5px rgba(232,69,53,0.55)) drop-shadow(0 0 14px rgba(232,69,53,0.22))',
                ],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              state
            </motion.span>
            {' '}for a long time. A thousand names. The same thing underneath.
          </p>
        </ScrollParagraph>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
