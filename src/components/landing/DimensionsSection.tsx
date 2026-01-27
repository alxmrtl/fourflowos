'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { KEYS } from '@/data/framework';

const dimensionData = [
  {
    id: 'self',
    name: 'SELF',
    shape: 'Frequencies',
    shapeImage: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SELF - Frequencies.png',
    symbolism: 'Energy that pulses through you',
    meta: 'Your inner state — body, mind, emotions',
    question: 'How am I right now?',
    color: '#FF6F61',
    keys: ['tuned-emotions', 'open-mind', 'focused-body'],
  },
  {
    id: 'space',
    name: 'SPACE',
    shape: 'Square',
    shapeImage: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPACE - Sqaure.png',
    symbolism: 'Structure that grounds you',
    meta: 'Your environment — setting, systems, tools',
    question: 'What supports my flow?',
    color: '#6BA292',
    keys: ['intentional-space', 'optimized-tools', 'feedback-systems'],
  },
  {
    id: 'story',
    name: 'STORY',
    shape: 'Cross',
    shapeImage: '/assets/LOGOS/MAIN LOGO - ELEMENTS/STORY - Cross.png',
    symbolism: 'Where past meets future',
    meta: 'Your direction — narrative, mission, role',
    question: 'What am I building?',
    color: '#5B84B1',
    keys: ['generative-story', 'clear-mission', 'empowered-role'],
  },
  {
    id: 'spirit',
    name: 'SPIRIT',
    shape: 'Circle',
    shapeImage: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPIRIT - Circle.png',
    symbolism: 'Infinite potential',
    meta: 'Your core — values, vision, curiosity',
    question: 'What drives me?',
    color: '#7A4DA4',
    keys: ['grounding-values', 'visualized-vision', 'ignited-curiosity'],
  },
];

export default function DimensionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.15 });
  const [revealedDimension, setRevealedDimension] = useState<string | null>(null);

  const toggleDimension = (id: string) => {
    setRevealedDimension(revealedDimension === id ? null : id);
  };

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 bg-[#050505] overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, #FF6F61 0%, transparent 30%),
              radial-gradient(circle at 80% 30%, #6BA292 0%, transparent 30%),
              radial-gradient(circle at 30% 80%, #5B84B1 0%, transparent 30%),
              radial-gradient(circle at 70% 70%, #7A4DA4 0%, transparent 30%)
            `,
          }}
        />
      </div>

      <motion.div
        className="relative max-w-6xl mx-auto px-6"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: 0.5, staggerChildren: 0.1, delayChildren: 0.1 },
          },
        }}
      >
        {/* Section header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          variants={{
            hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.7, ease: 'easeOut' },
            },
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The Four Dimensions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Four interconnected areas of life. When aligned, they create the conditions for flow.
          </p>
        </motion.div>

        {/* Four dimension cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {dimensionData.map((dimension, index) => (
            <motion.div
              key={dimension.id}
              className="relative"
              variants={{
                hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.7, ease: 'easeOut' },
                },
              }}
            >
              <motion.div
                className="relative rounded-2xl overflow-hidden cursor-pointer group h-[280px] md:h-[260px]"
                style={{
                  background: `linear-gradient(135deg, ${dimension.color}08, ${dimension.color}03)`,
                  border: `1px solid ${dimension.color}20`,
                }}
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={() => toggleDimension(dimension.id)}
              >
                {/* Front content - Dimension info */}
                <motion.div
                  className="absolute inset-0 p-6 md:p-8"
                  animate={{
                    opacity: revealedDimension === dimension.id ? 0 : 1,
                  }}
                  transition={{ duration: 0.3, delay: revealedDimension === dimension.id ? 0 : 0.3 }}
                >
                  <div className="flex items-start gap-5">
                    {/* Shape */}
                    <motion.div
                      className="relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24"
                      animate={{
                        scale: [1, 1.03, 1],
                      }}
                      transition={{
                        duration: 4 + index,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      {/* Glow */}
                      <div
                        className="absolute inset-0 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                        style={{ background: dimension.color }}
                      />
                      <Image
                        src={dimension.shapeImage}
                        alt={dimension.shape}
                        fill
                        className="object-contain relative z-10"
                      />
                    </motion.div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      {/* Name */}
                      <h3
                        className="text-2xl md:text-3xl font-bold tracking-tight mb-2"
                        style={{ color: dimension.color }}
                      >
                        {dimension.name}
                      </h3>

                      {/* Question */}
                      <p className="text-lg text-white font-medium mb-1">
                        "{dimension.question}"
                      </p>

                      {/* Meta explainer */}
                      <p className="text-gray-500 text-sm mb-3">
                        {dimension.meta}
                      </p>

                      {/* Shape + Symbolism */}
                      <p
                        className="text-sm font-medium italic"
                        style={{ color: `${dimension.color}99` }}
                      >
                        {dimension.shape} — {dimension.symbolism}
                      </p>
                    </div>
                  </div>

                  {/* Keys teaser bar */}
                  <div className="absolute bottom-6 left-6 right-6 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 uppercase tracking-wider">
                          3 Flow Keys
                        </span>
                        <div className="flex gap-1">
                          {dimension.keys.map((keyId) => (
                            <div
                              key={keyId}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: dimension.color }}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-600">Tap to reveal</span>
                    </div>
                  </div>
                </motion.div>

                {/* Radial ink spread overlay */}
                <motion.div
                  className="absolute inset-0 origin-[15%_18%] md:origin-[12%_20%]"
                  initial={false}
                  animate={{
                    clipPath: revealedDimension === dimension.id
                      ? 'circle(150% at 15% 18%)'
                      : 'circle(0% at 15% 18%)',
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${dimension.color}25, ${dimension.color}15)`,
                  }}
                />

                {/* Back content - Flow Keys */}
                <motion.div
                  className="absolute inset-0 p-6 md:p-8 flex"
                  initial={false}
                  animate={{
                    opacity: revealedDimension === dimension.id ? 1 : 0,
                    pointerEvents: revealedDimension === dimension.id ? 'auto' : 'none',
                  }}
                  transition={{ duration: 0.3, delay: revealedDimension === dimension.id ? 0.3 : 0 }}
                >
                  {/* Vertical title on left */}
                  <div className="flex flex-col items-center justify-center mr-6 md:mr-8 pl-1">
                    <h3
                      className="text-sm font-bold tracking-widest uppercase whitespace-nowrap"
                      style={{
                        color: dimension.color,
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                      }}
                    >
                      {dimension.name}
                    </h3>
                  </div>

                  {/* Keys list */}
                  <div className="flex-1 flex flex-col justify-center space-y-2">
                    {dimension.keys.map((keyId, keyIndex) => {
                      const key = KEYS[keyId as keyof typeof KEYS];
                      if (!key) return null;
                      return (
                        <motion.div
                          key={keyId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{
                            opacity: revealedDimension === dimension.id ? 1 : 0,
                            x: revealedDimension === dimension.id ? 0 : -20
                          }}
                          transition={{
                            duration: 0.4,
                            delay: revealedDimension === dimension.id ? 0.35 + keyIndex * 0.08 : 0,
                            ease: 'easeOut'
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-black/30 backdrop-blur-sm"
                        >
                          <div
                            className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden"
                            style={{ background: `${dimension.color}30` }}
                          >
                            <Image
                              src={key.icon}
                              alt={key.name}
                              fill
                              className="object-contain p-1.5"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white">
                              {key.name}
                            </h4>
                            <p className="text-xs text-white/50 truncate">
                              {key.description}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Hover border glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 30px ${dimension.color}10, 0 0 40px ${dimension.color}08`,
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Explore Framework CTA */}
        <motion.div
          className="mt-12 md:mt-16 text-center"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: 'easeOut', delay: 0.4 },
            },
          }}
        >
          <Link
            href="/framework"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 group"
          >
            <span className="text-gray-400 group-hover:text-white transition-colors">
              Explore the Framework
            </span>
            <svg
              className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </motion.div>

        {/* Combined logo hint */}
        <motion.p
          className="text-center text-gray-600 mt-12 text-sm"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: 'easeOut', delay: 0.5 },
            },
          }}
        >
          Together, the four shapes form the FourFlow symbol — four forces in harmony.
        </motion.p>
      </motion.div>
    </section>
  );
}
