'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { DIMENSIONS } from '@/data/framework';

const dimensionDetails = {
  self: {
    descriptor: 'Inner Mastery',
    fullDescription: 'Tuning your inner compass for flow navigation. Master your emotions, sharpen your mind, and optimize your body to become a vessel for peak performance.',
    gradient: 'from-[#FF6F61]/20 to-transparent',
  },
  space: {
    descriptor: 'Environment Design',
    fullDescription: 'Creating environments that amplify your potential. Design intentional spaces, optimize your tools, and build feedback systems that make flow inevitable.',
    gradient: 'from-[#6BA292]/20 to-transparent',
  },
  story: {
    descriptor: 'Direction Setting',
    fullDescription: 'Crafting narratives that drive meaningful action. Develop a generative story, pursue a worthy mission, and embody an empowered role in your journey.',
    gradient: 'from-[#5B84B1]/20 to-transparent',
  },
  spirit: {
    descriptor: 'Inner Drive',
    fullDescription: 'Aligning with your deepest values and vision. Ground yourself in core values, visualize your future, and ignite the curiosity that fuels endless growth.',
    gradient: 'from-[#7A4DA4]/20 to-transparent',
  },
};

export default function FrameworkSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="framework"
      ref={ref}
      className="relative py-24 md:py-32 bg-[#0f0f0f] overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6F61] via-[#6BA292] via-[#5B84B1] to-[#7A4DA4]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
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
            The Framework
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Four Dimensions of{' '}
            <span className="bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] bg-clip-text text-transparent">
              Flow
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Flow isn&apos;t about willpower—it&apos;s about alignment. When Self, Space, Story, and Spirit
            work together, focus becomes effortless and performance becomes natural.
          </p>
        </motion.div>

        {/* Dimensions grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {Object.values(DIMENSIONS).map((dimension, index) => {
            const details = dimensionDetails[dimension.id as keyof typeof dimensionDetails];

            return (
              <motion.div
                key={dimension.id}
                className="group relative"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.15, duration: 0.6 }}
              >
                <div
                  className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
                  style={{
                    boxShadow: `0 0 60px -20px ${dimension.color}30`,
                  }}
                >
                  {/* Hover glow effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${dimension.color}15, transparent 40%)`,
                    }}
                  />

                  {/* Color accent line */}
                  <div
                    className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                    style={{ background: dimension.color }}
                  />

                  <div className="relative z-10">
                    {/* Header with icon and name */}
                    <div className="flex items-start gap-5 mb-6">
                      <div
                        className="relative w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden"
                        style={{ background: `${dimension.color}15` }}
                      >
                        <Image
                          src={dimension.sectionLogo}
                          alt={dimension.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div>
                        <span
                          className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: dimension.color }}
                        >
                          {details.descriptor}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">
                          {dimension.name}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {details.fullDescription}
                    </p>

                    {/* Keys preview */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">
                        3 Flow Keys
                      </span>
                      <div className="flex -space-x-2">
                        {dimension.keys.map((key, keyIndex) => (
                          <motion.div
                            key={key.id}
                            className="relative w-10 h-10 rounded-full border-2 border-[#0f0f0f] overflow-hidden"
                            style={{ background: `${dimension.color}20` }}
                            initial={{ scale: 0, x: -10 }}
                            animate={isInView ? { scale: 1, x: 0 } : {}}
                            transition={{
                              delay: 0.5 + index * 0.15 + keyIndex * 0.1,
                              type: 'spring',
                              stiffness: 200,
                            }}
                          >
                            <Image
                              src={key.icon}
                              alt={key.name}
                              fill
                              className="object-contain p-1"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Center connection visual */}
        <motion.div
          className="hidden lg:flex justify-center mt-16"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#FF6F61] via-[#6BA292] via-[#5B84B1] to-[#7A4DA4] opacity-20 blur-xl" />
            </div>
            <div className="relative px-8 py-4 bg-white/5 border border-white/10 rounded-full">
              <span className="text-gray-300 font-medium">
                Alignment Creates Flow
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
