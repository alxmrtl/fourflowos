'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { DIMENSIONS, KEYS } from '@/data/framework';
import { DimensionType, KeyType } from '@/types/framework';
import PageLayout from '@/components/layout/PageLayout';

interface DimensionPageProps {
  dimension: DimensionType;
}

const getDimensionDescription = (dimension: DimensionType) => {
  const descriptions = {
    self: {
      text: "Develop unshakeable focus and presence by integrating physical, mental, and emotional intelligence.",
      question: "What am I doing now?",
    },
    space: {
      text: "Build spaces and systems that multiply your leverage while removing distractions.",
      question: "What supports your flow?",
    },
    story: {
      text: "Transform your sense of purpose into a driving force for excellence and fulfillment.",
      question: "What are you building?",
    },
    spirit: {
      text: "Access unlimited energy and direction through aligned values, wonder, and vision.",
      question: "What drives you?",
    }
  };
  return descriptions[dimension];
};

const KEY_NUMBERS: Record<string, number> = {
  'tuned-emotions': 1,
  'open-mind': 2,
  'focused-body': 3,
  'intentional-space': 4,
  'optimized-tools': 5,
  'feedback-systems': 6,
  'generative-story': 7,
  'clear-mission': 8,
  'empowered-role': 9,
  'grounding-values': 10,
  'visualized-vision': 11,
  'ignited-curiosity': 12
};

const getKeyDisplayInfo = (keyId: string) => {
  const keyData = KEYS[keyId as KeyType];
  return {
    name: keyData?.name || keyId,
    keyNumber: KEY_NUMBERS[keyId] || 0,
    coreInsight: keyData?.coreInsight || '',
    flowConnection: keyData?.flowConnection || '',
    withoutThis: keyData?.withoutThis || ''
  };
};

export default function DimensionPage({ dimension }: DimensionPageProps) {
  const dimensionData = DIMENSIONS[dimension];
  const heroRef = useRef(null);
  const keysRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const keysInView = useInView(keysRef, { once: true, margin: '-50px' });

  if (!dimensionData) {
    return <div>Dimension not found</div>;
  }

  const getKeyPath = (keyId: string) => `/dimension/${dimension}/key/${keyId}`;
  const dimensionDesc = getDimensionDescription(dimension);

  return (
    <PageLayout accentColor={dimensionData.color}>
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-12 md:py-20">
        {/* Animated background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${dimensionData.color}40, transparent 60%)`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Link href="/framework" className="text-gray-500 hover:text-white transition-colors text-sm">
              Framework
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white text-sm font-medium">{dimensionData.name}</span>
          </motion.nav>

          {/* Dimension Header */}
          <motion.div
            className="relative rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            {/* Gradient background */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${dimensionData.color}20, transparent)`,
              }}
            />
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: dimensionData.color }}
            />

            <div className="relative p-6 md:p-10 border border-white/10 rounded-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Icon */}
                <motion.div
                  className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl flex-shrink-0"
                  style={{ background: `${dimensionData.color}20` }}
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Image
                    src={dimensionData.sectionLogo}
                    alt={dimensionData.name}
                    fill
                    className="object-contain p-2"
                  />
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ color: dimensionData.color }}
                  >
                    {dimensionData.name} Dimension
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    {dimensionData.name}
                  </h1>
                  <p className="text-gray-400 leading-relaxed mb-2">
                    {dimensionDesc.text}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    &ldquo;{dimensionDesc.question}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Keys Section */}
      <section ref={keysRef} className="relative py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Section header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={keysInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-white mb-2">
              3 Flow Keys
            </h2>
            <p className="text-gray-500 text-sm">
              Master these keys to unlock flow in the {dimensionData.name} dimension
            </p>
          </motion.div>

          {/* Keys List */}
          <div className="space-y-4">
            {dimensionData.keys.map((key, index) => {
              const keyInfo = getKeyDisplayInfo(key.id);
              return (
                <motion.div
                  key={key.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={keysInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={getKeyPath(key.id)}
                    className="group block"
                  >
                    <div
                      className="relative p-6 md:p-8 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
                      style={{
                        boxShadow: `0 0 0 0 ${dimensionData.color}00`,
                      }}
                    >
                      {/* Left accent */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1 group-hover:w-1.5 transition-all duration-300"
                        style={{ background: dimensionData.color }}
                      />

                      {/* Hover glow */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 0% 50%, ${dimensionData.color}15, transparent 50%)`,
                        }}
                      />

                      <div className="relative z-10">
                        {/* Header Row */}
                        <div className="flex items-start gap-4 md:gap-5 mb-5">
                          {/* Key Icon */}
                          <div
                            className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl flex-shrink-0"
                            style={{ background: `${dimensionData.color}15` }}
                          >
                            <Image
                              src={key.icon}
                              alt={key.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>

                          {/* Key Title */}
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs font-bold uppercase tracking-wider mb-1"
                              style={{ color: dimensionData.color }}
                            >
                              Flow Key #{keyInfo.keyNumber}
                            </p>
                            <h3 className="text-xl md:text-2xl font-semibold text-white group-hover:translate-x-1 transition-transform">
                              {keyInfo.name}
                            </h3>
                          </div>

                          {/* Arrow */}
                          <div className="flex-shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all mt-2">
                            <svg
                              className="w-5 h-5"
                              style={{ color: dimensionData.color }}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>

                        {/* Essence Card Content */}
                        <div className="space-y-4 pl-0 md:pl-[4.5rem]">
                          {/* Core Insight */}
                          <div>
                            <p
                              className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
                              style={{ color: dimensionData.color }}
                            >
                              Core Insight
                            </p>
                            <p className="text-[15px] text-gray-200 leading-relaxed">
                              {keyInfo.coreInsight}
                            </p>
                          </div>

                          {/* The Flow Connection */}
                          <div>
                            <p
                              className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
                              style={{ color: dimensionData.color }}
                            >
                              The Flow Connection
                            </p>
                            <p className="text-[15px] text-gray-300 leading-relaxed">
                              {keyInfo.flowConnection}
                            </p>
                          </div>

                          {/* Without This */}
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 text-gray-500">
                              Without This
                            </p>
                            <p className="text-[15px] text-gray-400 leading-relaxed italic">
                              {keyInfo.withoutThis}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Back to Framework CTA */}
      <section className="relative py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/framework"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 group"
            >
              <svg
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Framework
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
