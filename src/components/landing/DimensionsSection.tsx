'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { DIMENSIONS, KEYS } from '@/data/framework';

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
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);
  const [showAllKeys, setShowAllKeys] = useState(false);

  const toggleDimension = (id: string) => {
    setExpandedDimension(expandedDimension === id ? null : id);
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
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                style={{
                  background: `linear-gradient(135deg, ${dimension.color}08, ${dimension.color}03)`,
                  border: `1px solid ${dimension.color}20`,
                }}
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={() => toggleDimension(dimension.id)}
              >
                {/* Main card content */}
                <div className="p-6 md:p-8">
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
                      {/* Name + Shape label */}
                      <div className="flex items-baseline gap-3 mb-2">
                        <h3
                          className="text-2xl md:text-3xl font-bold tracking-tight"
                          style={{ color: dimension.color }}
                        >
                          {dimension.name}
                        </h3>
                        <span className="text-xs text-gray-600 font-medium uppercase tracking-widest">
                          {dimension.shape}
                        </span>
                      </div>

                      {/* Symbolism */}
                      <p className="text-lg text-white font-medium mb-1">
                        {dimension.symbolism}
                      </p>

                      {/* Meta explainer */}
                      <p className="text-gray-500 text-sm mb-3">
                        {dimension.meta}
                      </p>

                      {/* Question */}
                      <p
                        className="text-sm font-medium italic"
                        style={{ color: `${dimension.color}99` }}
                      >
                        "{dimension.question}"
                      </p>
                    </div>
                  </div>

                  {/* Keys teaser bar */}
                  <div className="mt-5 pt-4 border-t border-white/5">
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
                      <motion.div
                        animate={{ rotate: expandedDimension === dimension.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg
                          className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Expanded keys section */}
                <AnimatePresence>
                  {expandedDimension === dimension.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-6 md:px-8 pb-6 md:pb-8 pt-2 space-y-3"
                        style={{ background: `${dimension.color}05` }}
                      >
                        {dimension.keys.map((keyId, keyIndex) => {
                          const key = KEYS[keyId as keyof typeof KEYS];
                          return (
                            <motion.div
                              key={keyId}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: keyIndex * 0.1 }}
                              className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                            >
                              <div
                                className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden"
                                style={{ background: `${dimension.color}15` }}
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
                                <p className="text-xs text-gray-500 truncate">
                                  {key.description}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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

        {/* 12 Keys summary */}
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
          <button
            onClick={() => setShowAllKeys(!showAllKeys)}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 group"
          >
            <span className="text-gray-400 group-hover:text-white transition-colors">
              {showAllKeys ? 'Hide' : 'Explore'} the 12 Flow Keys
            </span>
            <motion.svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: showAllKeys ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </button>

          <AnimatePresence>
            {showAllKeys && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {dimensionData.map((dimension) => (
                    <div key={dimension.id} className="space-y-2">
                      <div
                        className="text-xs font-semibold uppercase tracking-wider mb-3"
                        style={{ color: dimension.color }}
                      >
                        {dimension.name}
                      </div>
                      {dimension.keys.map((keyId, keyIndex) => {
                        const key = KEYS[keyId as keyof typeof KEYS];
                        return (
                          <motion.div
                            key={keyId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: keyIndex * 0.05 }}
                            className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-default"
                          >
                            <div
                              className="w-6 h-6 rounded flex-shrink-0 overflow-hidden"
                              style={{ background: `${dimension.color}15` }}
                            >
                              <Image
                                src={key.icon}
                                alt={key.name}
                                width={24}
                                height={24}
                                className="object-contain p-0.5"
                              />
                            </div>
                            <span className="text-xs text-gray-400 truncate">
                              {key.name}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm text-gray-600">
                  Each dimension contains three keys — practices and principles for unlocking flow.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
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
