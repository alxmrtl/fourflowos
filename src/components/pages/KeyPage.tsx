'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { KEYS, DIMENSIONS } from '@/data/framework';
import { KeyType, DimensionType, ContentItem } from '@/types/framework';
import PageLayout from '@/components/layout/PageLayout';

interface KeyPageProps {
  keyId: KeyType;
  dimension: DimensionType;
  initialContent?: ContentItem[];
}

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

export default function KeyPage({ keyId, dimension, initialContent = [] }: KeyPageProps) {
  const content = initialContent;
  const loading = false;

  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const contentInView = useInView(contentRef, { once: true, margin: '-50px' });

  const keyData = KEYS[keyId];
  const dimensionData = DIMENSIONS[dimension];
  const keyInfo = getKeyDisplayInfo(keyId);

  if (!keyData || !dimensionData) {
    return <div>Key not found</div>;
  }

  return (
    <PageLayout accentColor={dimensionData.color}>
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-12 md:py-20">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0 opacity-15"
            style={{
              background: `radial-gradient(ellipse at 50% 30%, ${dimensionData.color}30, transparent 60%)`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center gap-3 mb-8 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Link href="/framework" className="text-gray-500 hover:text-white transition-colors text-sm">
              Framework
            </Link>
            <span className="text-gray-600">/</span>
            <Link
              href={`/dimension/${dimension}`}
              className="text-gray-500 hover:text-white transition-colors text-sm"
            >
              {dimensionData.name}
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white text-sm font-medium">{keyInfo.name}</span>
          </motion.nav>

          {/* Key Header */}
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
                background: `linear-gradient(135deg, ${dimensionData.color}25, ${dimensionData.color}05)`,
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
                    scale: [1, 1.03, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Image
                    src={keyData.icon}
                    alt={keyData.name}
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
                    Flow Key #{keyInfo.keyNumber}
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    {keyInfo.name}
                  </h1>

                  {/* Essence Card Content */}
                  <div className="space-y-4">
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section ref={contentRef} className="relative py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Section header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-white mb-2">
              Resources & Content
            </h2>
            <p className="text-gray-500 text-sm">
              Learn and practice to master this flow key
            </p>
          </motion.div>

          {/* Content List */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="relative w-12 h-12 mb-4">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-t-2"
                  style={{ borderColor: dimensionData.color }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <p className="text-gray-500">Loading content...</p>
            </motion.div>
          ) : content.length > 0 ? (
            <div className="space-y-4">
              {content.map((item, index) => {
                const isPinned = item.is_pinned;
                const isLearn = item.type === 'learn';

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={contentInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <Link
                      href={`/content/${item.id}`}
                      className="group block"
                    >
                      <div
                        className={`relative p-5 md:p-6 rounded-xl border transition-all duration-300 overflow-hidden ${
                          isPinned
                            ? 'bg-gradient-to-r from-white/[0.08] to-white/[0.03] border-white/20'
                            : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* Left accent */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 transition-all duration-300 ${
                            isPinned ? 'w-1.5' : 'w-1 group-hover:w-1.5'
                          }`}
                          style={{ background: dimensionData.color }}
                        />

                        {/* Hover glow */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at 0% 50%, ${dimensionData.color}10, transparent 50%)`,
                          }}
                        />

                        <div className="flex items-start gap-4 relative z-10">
                          {/* Content Icon */}
                          <div
                            className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center ${
                              isPinned
                                ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20'
                                : 'bg-white/5'
                            }`}
                          >
                            {isPinned ? (
                              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ) : (
                              <svg
                                className="w-6 h-6 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                {isLearn ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                )}
                              </svg>
                            )}
                          </div>

                          {/* Content Info */}
                          <div className="flex-1 min-w-0">
                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              {isPinned && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                  Essential
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  isLearn
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-green-500/20 text-green-400'
                                }`}
                              >
                                {item.type}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-white mb-1 group-hover:translate-x-1 transition-transform">
                              {item.title}
                            </h3>

                            {/* Description for pinned items */}
                            {isPinned && item.description && (
                              <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                                {item.description}
                              </p>
                            )}

                            {/* Meta */}
                            {item.read_time && (
                              <span className="text-xs text-gray-500">{item.read_time} min read</span>
                            )}
                          </div>

                          {/* Arrow */}
                          <div className="flex-shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
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
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No content yet</h3>
              <p className="text-gray-500">Content for this key will be added soon.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Navigation Section */}
      <section className="relative py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/dimension/${dimension}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 group"
            >
              <svg
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to {dimensionData.name}
            </Link>
            <Link
              href="/framework"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              View All Dimensions
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
