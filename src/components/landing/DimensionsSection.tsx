'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { KEYS, DIMENSION_AUDIENCE_COPY, KEY_AUDIENCE_COPY } from '@/data/framework';
import { useAudience } from '@/context/AudienceContext';
import { KeyType } from '@/types/framework';
import { CORAL, SAGE, STEEL, AMETHYST, GRADIENTS } from '@/styles/brand-colors';
import PrincipleBridge from './PrincipleBridge';

const pillarSymbols = [
  { src: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SELF - Frequencies.png', alt: 'SELF', color: CORAL, x: '-8%', y: '-4%' },
  { src: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPACE - Sqaure.png', alt: 'SPACE', color: SAGE, x: '6%', y: '4%' },
  { src: '/assets/LOGOS/MAIN LOGO - ELEMENTS/STORY - Cross.png', alt: 'STORY', color: STEEL, x: '-4%', y: '6%' },
  { src: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPIRIT - Circle.png', alt: 'SPIRIT', color: AMETHYST, x: '8%', y: '-2%' },
];

const dimensionData = [
  {
    id: 'self',
    name: 'SELF',
    shape: 'Frequencies',
    shapeImage: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SELF - Frequencies.png',
    symbolism: 'Energy that pulses through you',
    meta: 'Your inner state — body, mind, emotions',
    question: 'How am I right now?',
    color: '#E84535',
    keys: ['tuned-emotions', 'open-mind', 'focused-body'] as KeyType[],
  },
  {
    id: 'space',
    name: 'SPACE',
    shape: 'Square',
    shapeImage: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPACE - Sqaure.png',
    symbolism: 'Structure that grounds you',
    meta: 'Your environment — setting, systems, tools',
    question: 'What supports my flow?',
    color: '#4E8C73',
    keys: ['intentional-space', 'optimized-tools', 'feedback-systems'] as KeyType[],
  },
  {
    id: 'story',
    name: 'STORY',
    shape: 'Cross',
    shapeImage: '/assets/LOGOS/MAIN LOGO - ELEMENTS/STORY - Cross.png',
    symbolism: 'Where past meets future',
    meta: 'Your direction — narrative, mission, role',
    question: 'What am I building?',
    color: '#3E6FA3',
    keys: ['generative-story', 'clear-mission', 'empowered-role'] as KeyType[],
  },
  {
    id: 'spirit',
    name: 'SPIRIT',
    shape: 'Circle',
    shapeImage: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPIRIT - Circle.png',
    symbolism: 'Infinite potential',
    meta: 'Your core — values, vision, curiosity',
    question: 'What drives me?',
    color: '#6330A0',
    keys: ['grounding-values', 'visualized-vision', 'ignited-curiosity'] as KeyType[],
  },
];

export default function DimensionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.15 });
  const [revealedDimension, setRevealedDimension] = useState<string | null>(null);
  const { audience } = useAudience();

  const toggleDimension = (id: string) => {
    setRevealedDimension(revealedDimension === id ? null : id);
  };

  // Get audience-specific copy or default to individual
  const getAudienceCopy = (dimensionId: string) => {
    const copy = DIMENSION_AUDIENCE_COPY[dimensionId as keyof typeof DIMENSION_AUDIENCE_COPY];
    if (!copy) return null;
    return audience === 'leader' ? copy.leader : copy.individual;
  };

  const getKeyCopy = (keyId: KeyType) => {
    const copy = KEY_AUDIENCE_COPY[keyId];
    if (!copy) return null;
    return audience === 'leader' ? copy.leader : copy.individual;
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center py-16 md:py-20 bg-[#050505] overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, #E84535 0%, transparent 30%),
              radial-gradient(circle at 80% 30%, #4E8C73 0%, transparent 30%),
              radial-gradient(circle at 30% 80%, #3E6FA3 0%, transparent 30%),
              radial-gradient(circle at 70% 70%, #6330A0 0%, transparent 30%)
            `,
          }}
        />
      </div>

      <motion.div
        className="relative w-full px-[10%] lg:px-[20%]"
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
        {/* Section header — That alignment has a structure */}
        <div className="max-w-3xl mx-auto text-center mb-8 md:mb-10">
          <motion.h2
            className="font-display text-3xl md:text-5xl font-normal text-white leading-[1.15]"
            variants={{
              hidden: { opacity: 0, y: 56, filter: 'blur(14px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.0, ease: 'easeOut', delay: 0.1 } },
            }}
          >
            That alignment has a{' '}
            <span className="italic bg-clip-text text-transparent" style={{ backgroundImage: GRADIENTS.textWide }}>
              structure
            </span>
            .
          </motion.h2>
        </div>

        {/* Four dimension cards */}
        <div className="grid grid-cols-2 gap-2 md:gap-6 lg:gap-8">
          {dimensionData.map((dimension, index) => {
            const audienceCopy = getAudienceCopy(dimension.id);

            return (
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
                  className="relative rounded-2xl overflow-hidden cursor-pointer group h-[156px] md:h-[300px]"
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
                    className="absolute inset-0 p-3 md:p-8 flex flex-col justify-center"
                    animate={{
                      opacity: revealedDimension === dimension.id ? 0 : 1,
                    }}
                    transition={{ duration: 0.3, delay: revealedDimension === dimension.id ? 0 : 0.3 }}
                  >
                    <div className="flex items-center gap-3 md:gap-5">
                      {/* Shape */}
                      <motion.div
                        className="relative flex-shrink-0 w-9 h-9 md:w-20 md:h-20"
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
                          className="text-sm md:text-3xl font-bold tracking-tight mb-1 md:mb-2"
                          style={{ color: dimension.color }}
                        >
                          {dimension.name}
                        </h3>

                        {/* Audience-aware tagline */}
                        <p className="text-[10px] md:text-lg text-white/80 font-medium mb-0.5 md:mb-1 leading-tight">
                          {audienceCopy ? `"${audienceCopy.tagline}"` : `"${dimension.question}"`}
                        </p>

                        {/* Audience-aware description — hidden on mobile */}
                        <p className="hidden md:block text-gray-400 text-xs mb-3">
                          {audienceCopy ? audienceCopy.description : dimension.meta}
                        </p>

                        {/* Shape + Symbolism — hidden on mobile */}
                        <p
                          className="hidden md:block text-sm font-medium italic"
                          style={{ color: `${dimension.color}99` }}
                        >
                          {dimension.shape} — {dimension.symbolism}
                        </p>
                      </div>
                    </div>

                    {/* Mobile-only tap hint */}
                    <div className="md:hidden absolute bottom-3 right-4 flex items-center gap-1.5">
                      <div className="flex gap-1">
                        {dimension.keys.map((keyId) => (
                          <div
                            key={keyId}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: dimension.color }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 md:text-gray-600">›</span>
                    </div>

                    {/* Desktop teaser bar */}
                    <div className="hidden md:block absolute bottom-6 left-6 right-6 pt-4 border-t border-white/5">
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

                  {/* Back content - Flow Keys with audience-aware copy */}
                  <motion.div
                    className="absolute inset-0 p-3 md:p-8 flex"
                    initial={false}
                    animate={{
                      opacity: revealedDimension === dimension.id ? 1 : 0,
                      pointerEvents: revealedDimension === dimension.id ? 'auto' : 'none',
                    }}
                    transition={{ duration: 0.3, delay: revealedDimension === dimension.id ? 0.3 : 0 }}
                  >
                    {/* Vertical title on left */}
                    <div className="flex flex-col items-center justify-center mr-3 md:mr-8 pl-0.5 md:pl-1">
                      <h3
                        className="text-[9px] md:text-sm font-bold tracking-widest uppercase whitespace-nowrap"
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
                    <div className="flex-1 flex flex-col justify-center space-y-1 md:space-y-2">
                      {dimension.keys.map((keyId, keyIndex) => {
                        const key = KEYS[keyId as keyof typeof KEYS];
                        const keyCopy = getKeyCopy(keyId);
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
                            className="flex items-center gap-1.5 md:gap-3 p-1.5 md:p-3 rounded-lg md:rounded-xl bg-black/30 backdrop-blur-sm"
                          >
                            <div
                              className="relative w-6 h-6 md:w-10 md:h-10 flex-shrink-0 rounded-md md:rounded-lg overflow-hidden"
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
                              <h4 className="text-[10px] md:text-sm font-semibold text-white leading-tight">
                                {key.name}
                              </h4>
                              <p className="hidden md:block text-xs text-white/50 line-clamp-2">
                                {keyCopy ? keyCopy.focus : key.description}
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
            );
          })}
        </div>

        <PrincipleBridge>When the twelve keys cohere, the state is here.</PrincipleBridge>

      </motion.div>
    </section>
  );
}
