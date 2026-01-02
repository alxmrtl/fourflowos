'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { DIMENSIONS } from '@/data/framework';

const keyElevatorPitches: Record<string, string> = {
  'tuned-emotions': 'Use your feelings as signals to stay in the sweet spot between bored and overwhelmed.',
  'open-mind': 'Cultivate cognitive flexibility that turns obstacles into opportunities.',
  'focused-body': 'Anchor yourself in physical presence to amplify mental clarity.',
  'intentional-space': 'Design environments that make flow states inevitable.',
  'optimized-tools': 'Leverage systems that multiply your output and minimize friction.',
  'feedback-systems': 'Build loops that accelerate learning and maintain momentum.',
  'generative-story': 'Craft a narrative that transforms challenges into compelling adventures.',
  'worthy-mission': 'Pursue goals that pull you forward with magnetic purpose.',
  'empowered-role': 'Embody an identity that naturally produces peak performance.',
  'grounding-values': 'Anchor decisions in principles that create lasting fulfillment.',
  'visualized-vision': 'See your future so clearly it becomes an irresistible destination.',
  'ignited-curiosity': 'Fuel endless growth with wonder that turns work into play.',
};

export default function KeysSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-32 bg-[#080808] overflow-hidden"
    >
      {/* Parallax background pattern */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          y: backgroundY,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            The System
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-[#FF6F61] via-[#6BA292] via-[#5B84B1] to-[#7A4DA4] bg-clip-text text-transparent">
              12 Flow Keys
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Each dimension contains three keys—specific areas of mastery that unlock
            deeper states of flow. Learn them, practice them, embody them.
          </p>
        </motion.div>

        {/* Keys by dimension */}
        <div className="space-y-16 md:space-y-24">
          {Object.values(DIMENSIONS).map((dimension, dimIndex) => (
            <motion.div
              key={dimension.id}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 + dimIndex * 0.2 }}
            >
              {/* Dimension label */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${dimension.color}20` }}
                >
                  <Image
                    src={dimension.icon}
                    alt={dimension.name}
                    width={28}
                    height={28}
                    className="opacity-80"
                  />
                </div>
                <div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: dimension.color }}
                  >
                    {dimension.name}
                  </span>
                  <p className="text-sm text-gray-500">{dimension.description}</p>
                </div>
              </div>

              {/* Keys grid */}
              <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
                {dimension.keys.map((key, keyIndex) => (
                  <motion.div
                    key={key.id}
                    className="group relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + dimIndex * 0.2 + keyIndex * 0.1 }}
                  >
                    <div
                      className="relative p-6 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden h-full"
                      style={{
                        boxShadow: `inset 0 1px 0 0 ${dimension.color}10`,
                      }}
                    >
                      {/* Glow effect on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${dimension.color}20, transparent 60%)`,
                        }}
                      />

                      <div className="relative z-10">
                        {/* Key number badge */}
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center"
                            style={{ background: `${dimension.color}15` }}
                          >
                            <Image
                              src={key.icon}
                              alt={key.name}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          </div>
                          <span
                            className="text-xs font-mono px-2 py-1 rounded"
                            style={{
                              background: `${dimension.color}15`,
                              color: dimension.color,
                            }}
                          >
                            KEY {dimIndex * 3 + keyIndex + 1}
                          </span>
                        </div>

                        {/* Key name */}
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">
                          {key.name}
                        </h3>

                        {/* Elevator pitch */}
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {keyElevatorPitches[key.id] || key.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom visual connector */}
        <motion.div
          className="mt-20 flex justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center gap-2">
            {[...Array(12)].map((_, i) => {
              const colors = ['#FF6F61', '#FF6F61', '#FF6F61', '#6BA292', '#6BA292', '#6BA292', '#5B84B1', '#5B84B1', '#5B84B1', '#7A4DA4', '#7A4DA4', '#7A4DA4'];
              return (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: colors[i] }}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 1.5 + i * 0.05 }}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
