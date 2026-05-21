'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GRADIENTS } from '@/styles/brand-colors';

const QUESTIONS = [
  'What makes you come alive?',
  'What am I here for?',
  'What makes my life meaningful?',
  'What direction is right for me?',
  'When do I feel most like myself?',
  'What would I do if I knew I couldn\'t fail?',
  'What lights me up without burning me out?',
  'What am I building, really?',
  'What do I already know that I\'m not acting on?',
  'What does the right kind of hard feel like?',
  'What am I putting off that actually matters?',
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
    <section id="honest-moment" className="relative py-32 md:py-44 bg-[#050505]">

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
            Most of your life happens outside of it.
          </p>
        </ScrollParagraph>

        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            You feel it most clearly when it briefly comes back. The afternoon that disappears into something good. The conversation you forget you&apos;re having. The thirty minutes of work that feel like five and leave you wondering why everything else doesn&apos;t go like that.
          </p>
        </ScrollParagraph>

        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            Then it&apos;s gone. And the rest of the day feels like reaching for something you can&apos;t quite locate.
          </p>
        </ScrollParagraph>

        <QuestionRain />

        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            These don&apos;t get answered by thinking harder about them. They get dissolved by living from a place where they don&apos;t need to be asked.
          </p>
          <p className="font-sans text-lg text-gray-400 leading-[1.8] mt-4">
            That place is the{' '}
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
            {' '}your ancestors found at the end of a long run. The one a sword master settled into before the blade moved. The one you&apos;ve fallen into without meaning to, and never quite figured out how to find on purpose.
          </p>
          <p className="font-sans text-lg text-gray-400 leading-[1.8] mt-4">
            It has conditions. You can learn them. Yours look different from anyone else&apos;s.
          </p>
        </ScrollParagraph>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
