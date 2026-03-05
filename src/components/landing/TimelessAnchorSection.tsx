'use client';

import { motion, useAnimationFrame, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

function WaterWavesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 11c2-3.5 4-3.5 6 0s4 3.5 6 0 4-3.5 6 0" />
      <path d="M2 16c2-3.5 4-3.5 6 0s4 3.5 6 0 4-3.5 6 0" />
    </svg>
  );
}

function ColumnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="4" x2="20" y2="4" />
      <rect x="9" y="4" width="6" height="15" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 13.5H11V22L20 10.5H13V2Z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" />
    </svg>
  );
}

function MusicNoteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

const cards = [
  {
    tradition: 'Taoism',
    analog: 'Wu wei',
    body: 'Effortless action. Not forcing the river — becoming it.',
    Icon: WaterWavesIcon,
  },
  {
    tradition: 'Ancient Greece',
    analog: 'Aristeia',
    body: 'Operating at the peak of human capacity — beyond effort, beyond doubt.',
    Icon: ColumnIcon,
  },
  {
    tradition: 'Sport Science',
    analog: 'The zone',
    body: 'Body and mind as one system. No gap between intention and action.',
    Icon: LightningIcon,
  },
  {
    tradition: 'Positive Psychology',
    analog: 'Flow',
    body: 'Named by Csikszentmihalyi in the 1970s. Measured, replicated, confirmed.',
    Icon: SparkleIcon,
  },
  {
    tradition: 'Jazz & Music',
    analog: 'The pocket',
    body: 'Playing beyond technique. The groove that arrives when you stop trying to find it.',
    Icon: MusicNoteIcon,
  },
];

const TRACK_CARDS = [...cards, ...cards, ...cards];

function CarouselCard({ card }: { card: (typeof cards)[0] }) {
  return (
    <div
      data-card=""
      className="relative w-72 flex-shrink-0 rounded-xl p-6 flex flex-col gap-3 bg-white/[0.03] border border-white/[0.07]"
    >
      <div className="text-[#9B7CB5]">
        <card.Icon />
      </div>
      <p className="font-sans text-[9px] font-semibold tracking-[0.18em] uppercase text-gray-600">
        {card.tradition}
      </p>
      <p className="font-display text-2xl font-normal bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] bg-clip-text text-transparent leading-tight">
        {card.analog}
      </p>
      <p className="font-sans text-sm text-gray-400 leading-relaxed">
        {card.body}
      </p>
    </div>
  );
}

function ScrollingCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const loopWidthRef = useRef(0);
  const isInViewRef = useRef(false);
  const isInView = useInView(sectionRef, { amount: 0.1 });

  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      loopWidthRef.current = trackRef.current.scrollWidth / 3;
      xRef.current = -loopWidthRef.current;
      trackRef.current.style.transform = `translateX(${xRef.current}px)`;
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useAnimationFrame((_, delta) => {
    if (!isInViewRef.current) return;
    if (!trackRef.current || !containerRef.current || loopWidthRef.current === 0) return;

    const dt = Math.min(delta, 100);
    xRef.current -= (45 * dt) / 1000;

    if (xRef.current <= -(loopWidthRef.current * 2)) {
      xRef.current += loopWidthRef.current;
    }

    trackRef.current.style.transform = `translateX(${xRef.current}px)`;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    // Radius > card spacing (312px) so there's always a card in the focal zone.
    // Exponent 2 = flat plateau near center, steeper falloff at edges.
    const activationRadius = 400;

    const cardEls = trackRef.current.querySelectorAll<HTMLElement>('[data-card]');
    cardEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = Math.abs(cardCenter - containerCenter);
      const proximity = Math.max(0, 1 - Math.pow(dist / activationRadius, 2));

      el.style.filter = `blur(${((1 - proximity) * 7).toFixed(2)}px)`;
      el.style.opacity = (0.2 + proximity * 0.8).toFixed(3);
    });
  });

  return (
    <div ref={sectionRef}>
      <div
        ref={containerRef}
        className="overflow-hidden py-8"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
        }}
      >
        <div ref={trackRef} className="flex gap-6 w-max">
          {TRACK_CARDS.map((card, i) => (
            <CarouselCard key={i} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BridgeParagraph({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.p
      ref={ref}
      className="font-sans text-lg text-gray-400 leading-[1.8]"
      initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.9, ease: 'easeOut', delay }}
    >
      {children}
    </motion.p>
  );
}

export default function TimelessAnchorSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 });

  return (
    <section className="relative py-24 md:py-32 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-14">
          <motion.h2
            className="font-display text-3xl md:text-4xl font-normal text-white mb-4"
            initial={{ opacity: 0, y: 56, filter: 'blur(14px)' }}
            animate={headerInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.0, ease: 'easeOut' }}
          >
            It has a thousand names.
          </motion.h2>
          <motion.p
            className="font-sans text-lg text-gray-500 max-w-md mx-auto"
            initial={{ opacity: 0, y: 32 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.12 }}
          >
            They used different words. They arrived at the same place.
          </motion.p>
        </div>
      </div>

      {/* Full-width carousel — outside max-w container */}
      <ScrollingCarousel />

      {/* Bridge copy */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto mt-20 space-y-8">
          <BridgeParagraph>
            What holds steady when the ground keeps shifting?
          </BridgeParagraph>
          <BridgeParagraph>
            There is a state that humans have always found when they needed to function beyond their ordinary capacity.
          </BridgeParagraph>
          <BridgeParagraph>
            Taoists found it through effortless surrender.
          </BridgeParagraph>
          <BridgeParagraph>
            Athletes found it through pressure and skill meeting a worthy challenge.
          </BridgeParagraph>
          <BridgeParagraph>
            Different paths, same place, because that place is wired into us.
          </BridgeParagraph>
          <BridgeParagraph>
            Reaching it was optional when the pace of life allowed more room. AI removed that room.
          </BridgeParagraph>
          <BridgeParagraph>
            Now, decisions carry more weight and what gave us meaning before is less certain.
          </BridgeParagraph>
          <BridgeParagraph>
            The people who can reliably return to this state will do the work that shapes what comes next.
          </BridgeParagraph>
          <motion.p
            className="font-sans text-lg text-gray-300 leading-[1.8]"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            FourFlowOS is our attempt at a practical playbook for getting there.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
