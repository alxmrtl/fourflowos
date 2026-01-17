'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
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
    fullDescription: 'Craft narratives that drive meaningful action. Develop a generative story, pursue a worthy mission, and embody an empowered role in your journey.',
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
  const keysRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const gridInView = useInView(gridRef, { once: true, margin: '-100px' });
  const keysInView = useInView(keysRef, { once: true, margin: '-100px' });

  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

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

      {/* Dimensions Grid - Interactive */}
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
              Explore Each Dimension
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Click any dimension to dive deeper into its three Flow Keys
            </p>
          </motion.div>

          {/* 2x2 Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {Object.values(DIMENSIONS).map((dimension, index) => {
              const details = dimensionDetails[dimension.id as keyof typeof dimensionDetails];
              const isHovered = hoveredDimension === dimension.id;
              const isExpanded = expandedDimension === dimension.id;

              return (
                <motion.div
                  key={dimension.id}
                  className="relative group cursor-pointer"
                  initial={{ opacity: 0, y: 40 }}
                  animate={gridInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.6 }}
                  onMouseEnter={() => setHoveredDimension(dimension.id)}
                  onMouseLeave={() => setHoveredDimension(null)}
                  onClick={() => setExpandedDimension(isExpanded ? null : dimension.id)}
                >
                  <motion.div
                    className="relative rounded-2xl overflow-hidden border border-white/10 transition-colors duration-300"
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
                      borderColor: isHovered ? `${dimension.color}40` : 'rgba(255,255,255,0.1)',
                    }}
                    animate={{
                      boxShadow: isHovered
                        ? `0 0 60px -10px ${dimension.color}40, inset 0 0 40px ${dimension.color}10`
                        : '0 0 0 0 transparent',
                    }}
                  >
                    {/* Top accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ background: dimension.color }}
                    />

                    {/* Hover glow */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${dimension.color}20, transparent 70%)`,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="relative p-6 md:p-8">
                      {/* Header */}
                      <div className="flex items-start gap-4 md:gap-6 mb-6">
                        {/* Icon */}
                        <motion.div
                          className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl flex-shrink-0"
                          style={{ background: `${dimension.color}15` }}
                          animate={{
                            scale: isHovered ? 1.05 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <Image
                            src={dimension.sectionLogo}
                            alt={dimension.name}
                            fill
                            className="object-contain p-2"
                          />
                        </motion.div>

                        {/* Title area */}
                        <div className="flex-1">
                          <span
                            className="text-xs font-bold uppercase tracking-wider"
                            style={{ color: dimension.color }}
                          >
                            {details.descriptor}
                          </span>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">
                            {dimension.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 italic">
                            &ldquo;{details.question}&rdquo;
                          </p>
                        </div>

                        {/* Expand indicator */}
                        <motion.div
                          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center"
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                        >
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 leading-relaxed mb-6">
                        {details.fullDescription}
                      </p>

                      {/* Keys Preview Row */}
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">
                          3 Flow Keys
                        </span>
                        <div className="flex gap-2">
                          {dimension.keys.map((key, keyIndex) => (
                            <motion.div
                              key={key.id}
                              className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg"
                              style={{ background: `${dimension.color}15` }}
                              initial={{ scale: 0 }}
                              animate={gridInView ? { scale: 1 } : {}}
                              transition={{
                                delay: 0.3 + index * 0.1 + keyIndex * 0.1,
                                type: 'spring',
                                stiffness: 200,
                              }}
                              whileHover={{ scale: 1.1 }}
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

                      {/* Expanded Keys Section */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="pt-6 mt-6 border-t border-white/10">
                              <div className="grid gap-4">
                                {dimension.keys.map((key, keyIndex) => (
                                  <Link
                                    key={key.id}
                                    href={`/dimension/${dimension.id}/key/${key.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="group/key"
                                  >
                                    <motion.div
                                      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-300"
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: keyIndex * 0.1 }}
                                      whileHover={{
                                        background: `${dimension.color}10`,
                                        x: 8,
                                      }}
                                    >
                                      <div
                                        className="relative w-12 h-12 rounded-lg flex-shrink-0"
                                        style={{ background: `${dimension.color}20` }}
                                      >
                                        <Image
                                          src={key.icon}
                                          alt={key.name}
                                          fill
                                          className="object-contain p-1"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <h4
                                          className="font-semibold text-white group-hover/key:translate-x-1 transition-transform"
                                        >
                                          {key.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 line-clamp-1">
                                          {key.description}
                                        </p>
                                      </div>
                                      <svg
                                        className="w-5 h-5 text-gray-500 group-hover/key:text-white group-hover/key:translate-x-1 transition-all"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </motion.div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Synergy Constellation - Key Connections */}
      <SynergyConstellation />

      {/* All Keys Overview Section */}
      <section ref={keysRef} className="relative py-16 md:py-24 bg-[#050505]">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={keysInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              The 12 Flow Keys
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Each dimension contains three keys&mdash;specific practices and principles that unlock flow.
              Master all twelve to achieve complete alignment.
            </p>
          </motion.div>

          {/* Keys by Dimension */}
          <div className="space-y-8">
            {Object.values(DIMENSIONS).map((dimension, dimIndex) => (
              <motion.div
                key={dimension.id}
                initial={{ opacity: 0, y: 30 }}
                animate={keysInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: dimIndex * 0.15, duration: 0.6 }}
              >
                {/* Dimension header */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${dimension.color}20` }}
                  >
                    <div className="relative w-6 h-6">
                      <Image
                        src={dimension.sectionLogo}
                        alt={dimension.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{dimension.name}</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                {/* Keys grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  {dimension.keys.map((key, keyIndex) => (
                    <Link
                      key={key.id}
                      href={`/dimension/${dimension.id}/key/${key.id}`}
                      className="group"
                    >
                      <motion.div
                        className="relative p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all duration-300 h-full"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={keysInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: dimIndex * 0.15 + keyIndex * 0.08, duration: 0.4 }}
                        whileHover={{
                          background: `${dimension.color}08`,
                          y: -4,
                          boxShadow: `0 10px 40px -10px ${dimension.color}30`,
                        }}
                      >
                        {/* Key icon */}
                        <div
                          className="relative w-12 h-12 rounded-lg mb-4"
                          style={{ background: `${dimension.color}15` }}
                        >
                          <Image
                            src={key.icon}
                            alt={key.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>

                        {/* Key name */}
                        <h4 className="font-semibold text-white mb-2 group-hover:translate-x-1 transition-transform">
                          {key.name}
                        </h4>

                        {/* Key description */}
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {key.description}
                        </p>

                        {/* Arrow indicator */}
                        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg
                            className="w-5 h-5"
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
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
