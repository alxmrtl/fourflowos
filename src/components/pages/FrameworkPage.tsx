'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { DIMENSIONS } from '@/data/framework';
import PageLayout from '@/components/layout/PageLayout';
import SynergyConstellation from '@/components/landing/SynergyConstellation';

const dimensionDetails = {
  self: {
    descriptor: 'Inner Mastery',
    question: 'What am I doing now?',
    fullDescription: 'Tune your inner instruments for optimal performance. Master emotions, sharpen the mind, and optimize your body to become a vessel for peak experience.',
    gradient: 'from-[#FF6F61] to-[#FF8A80]',
  },
  space: {
    descriptor: 'Environment Design',
    question: 'What supports your flow?',
    fullDescription: 'Create environments that amplify your potential. Design intentional settings, optimize your tools, and build feedback systems that make flow inevitable.',
    gradient: 'from-[#6BA292] to-[#8FC4B0]',
  },
  story: {
    descriptor: 'Direction Setting',
    question: 'What are you building?',
    fullDescription: 'Craft narratives that drive meaningful action. Develop a generative story, build a clear mission, and embody an empowered role in your journey.',
    gradient: 'from-[#5B84B1] to-[#7DA3C9]',
  },
  spirit: {
    descriptor: 'Inner Drive',
    question: 'What drives you?',
    fullDescription: 'Align with your deepest values and vision. Ground yourself in core principles, visualize your future, and ignite the curiosity that fuels endless growth.',
    gradient: 'from-[#7A4DA4] to-[#9A6DC4]',
  },
};

export default function FrameworkPage() {
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const gridInView = useInView(gridRef, { once: true, margin: '-100px' });

  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <PageLayout accentColor="#7A4DA4">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-16 md:py-24 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                'radial-gradient(ellipse at 30% 30%, #FF6F61 0%, transparent 50%)',
                'radial-gradient(ellipse at 70% 30%, #6BA292 0%, transparent 50%)',
                'radial-gradient(ellipse at 70% 70%, #5B84B1 0%, transparent 50%)',
                'radial-gradient(ellipse at 30% 70%, #7A4DA4 0%, transparent 50%)',
                'radial-gradient(ellipse at 30% 30%, #FF6F61 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-8">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4]" />
              The Complete Framework
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            Four Dimensions of{' '}
            <span className="bg-gradient-to-r from-[#FF6F61] via-[#6BA292] via-[#5B84B1] to-[#7A4DA4] bg-clip-text text-transparent">
              Flow
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Flow isn&apos;t about willpower&mdash;it&apos;s about alignment. When Self, Space, Story, and Spirit
            work together, focus becomes effortless and performance becomes natural.
          </motion.p>

          {/* Animated four-dot indicator */}
          <motion.div
            className="flex justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            {['#FF6F61', '#6BA292', '#5B84B1', '#7A4DA4'].map((color, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{ background: color }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Unified Framework Grid */}
      <section ref={gridRef} className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Explore the Framework
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Four dimensions, twelve keys&mdash;click any to dive deeper
            </p>
          </motion.div>

          {/* 2x2 Dimension Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {Object.values(DIMENSIONS).map((dimension, index) => {
              const details = dimensionDetails[dimension.id as keyof typeof dimensionDetails];
              const isDimensionHovered = hoveredDimension === dimension.id;

              return (
                <motion.div
                  key={dimension.id}
                  className="relative"
                  initial={{ opacity: 0, y: 40 }}
                  animate={gridInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.6 }}
                >
                  <div
                    className="relative rounded-2xl overflow-hidden border border-white/10 transition-colors duration-300"
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
                      borderColor: isDimensionHovered ? `${dimension.color}40` : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    {/* Top accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ background: dimension.color }}
                    />

                    {/* Hover glow for entire card */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 50% 30%, ${dimension.color}15, transparent 70%)`,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isDimensionHovered ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="relative p-6 md:p-8">
                      {/* Clickable Dimension Header */}
                      <Link
                        href={`/dimension/${dimension.id}`}
                        className="group/header block mb-6"
                        onMouseEnter={() => setHoveredDimension(dimension.id)}
                        onMouseLeave={() => setHoveredDimension(null)}
                      >
                        <div className="flex items-start gap-4 md:gap-5">
                          {/* Icon */}
                          <motion.div
                            className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl flex-shrink-0"
                            style={{ background: `${dimension.color}15` }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Image
                              src={dimension.sectionLogo}
                              alt={dimension.name}
                              fill
                              className="object-contain p-2"
                            />
                          </motion.div>

                          {/* Title area */}
                          <div className="flex-1 min-w-0">
                            <span
                              className="text-xs font-bold uppercase tracking-wider"
                              style={{ color: dimension.color }}
                            >
                              {details.descriptor}
                            </span>
                            <h3 className="text-xl md:text-2xl font-bold text-white mt-0.5 group-hover/header:translate-x-1 transition-transform">
                              {dimension.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 italic">
                              &ldquo;{details.question}&rdquo;
                            </p>
                          </div>

                          {/* Arrow indicator */}
                          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover/header:opacity-100 transition-opacity">
                            <svg
                              className="w-4 h-4 text-gray-400 group-hover/header:translate-x-0.5 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Link>

                      {/* Keys Grid - Always visible */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {dimension.keys.map((key, keyIndex) => {
                          const keyId = `${dimension.id}-${key.id}`;
                          const isKeyHovered = hoveredKey === keyId;

                          return (
                            <Link
                              key={key.id}
                              href={`/dimension/${dimension.id}/key/${key.id}`}
                              className="group/key"
                              onMouseEnter={() => setHoveredKey(keyId)}
                              onMouseLeave={() => setHoveredKey(null)}
                            >
                              <motion.div
                                className="relative p-4 rounded-xl bg-white/[0.03] border border-white/5 transition-all duration-300 h-full"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={gridInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: 0.2 + index * 0.1 + keyIndex * 0.08, duration: 0.4 }}
                                style={{
                                  borderColor: isKeyHovered ? `${dimension.color}40` : 'rgba(255,255,255,0.05)',
                                  background: isKeyHovered ? `${dimension.color}08` : 'rgba(255,255,255,0.03)',
                                }}
                                whileHover={{
                                  y: -4,
                                  boxShadow: `0 10px 30px -10px ${dimension.color}30`,
                                }}
                              >
                                {/* Key icon */}
                                <div
                                  className="relative w-10 h-10 rounded-lg mb-3"
                                  style={{ background: `${dimension.color}15` }}
                                >
                                  <Image
                                    src={key.icon}
                                    alt={key.name}
                                    fill
                                    className="object-contain p-1.5"
                                  />
                                </div>

                                {/* Key name */}
                                <h4 className="font-semibold text-white text-sm mb-1 group-hover/key:translate-x-0.5 transition-transform">
                                  {key.name}
                                </h4>

                                {/* Key description - truncated */}
                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                  {key.description}
                                </p>

                                {/* Arrow indicator on hover */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover/key:opacity-100 transition-opacity">
                                  <svg
                                    className="w-4 h-4"
                                    style={{ color: dimension.color }}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                  </svg>
                                </div>
                              </motion.div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Synergy Constellation - Key Connections */}
      <SynergyConstellation />

      {/* CTA Section */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Find Your Flow?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Start with any dimension that resonates with you. The framework meets you where you are
              and guides you toward complete alignment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/apps"
                className="px-8 py-4 bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                Explore Our Apps
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-full hover:bg-white/5 hover:border-gray-400 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
