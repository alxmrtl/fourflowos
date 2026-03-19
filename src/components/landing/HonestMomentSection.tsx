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
            You&apos;ve felt it before. Time bending. Effort dissolving. The distance between wanting and doing closing to nothing.
          </p>
        </ScrollParagraph>

        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            Then it&apos;s gone. And the question underneath &mdash; <em>how do I get back</em> &mdash; never quite gets answered.
          </p>
        </ScrollParagraph>

        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            Something larger is shifting underneath that question.
          </p>
        </ScrollParagraph>

        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            For most of history, what stood between you and your best work was execution &mdash; the tools, the time, the capacity to do what needed doing. Every framework, every measure of progress was built to close that gap.
          </p>
        </ScrollParagraph>

        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            That gap is closing on its own now. AI handles execution. More every week. The tools improve whether you keep up or not.
          </p>
        </ScrollParagraph>

        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            What&apos;s left is not a capacity problem. It&apos;s a clarity problem. More options. More power. Less certainty about what any of it is for.
          </p>
        </ScrollParagraph>

        <QuestionRain />

        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            These have never been answered by better systems.
          </p>
          <p className="font-sans text-lg text-gray-400 leading-[1.8] mt-4">
            They are answered in a{' '}
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
            &mdash; one where the signal is clear enough to hear what&apos;s already true.
          </p>
          <p className="font-sans text-lg text-gray-400 leading-[1.8] mt-4">
            One we&apos;ve had access to for far longer than the noise has existed.
          </p>
        </ScrollParagraph>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
