'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

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
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

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
            Something shifted in the last few years.
          </p>
        </ScrollParagraph>

        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            AI didn&apos;t make things clearer. It made them bigger. More to read, more options,
            more generated content than anyone can actually use. And somewhere in all of it,
            the quieter questions got crowded out.
          </p>
          <div className="mt-8 space-y-3">
            <p className="font-display text-2xl md:text-3xl italic bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] bg-clip-text text-transparent">
              What do you actually want to build?
            </p>
            <p className="font-display text-2xl md:text-3xl italic bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] bg-clip-text text-transparent">
              What are you here for?
            </p>
          </div>
        </ScrollParagraph>

        <ScrollParagraph>
          <p className="font-sans text-lg text-gray-400 leading-[1.8]">
            The state where those become clear — you&apos;ve already been in it.
          </p>
        </ScrollParagraph>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
