'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { DIMENSIONS } from '@/data/framework';
import { Key } from '@/types/framework';
import PageLayout from '@/components/layout/PageLayout';
import SynergyConstellation from '@/components/landing/SynergyConstellation';

const dimensionDetails = {
  self: {
    descriptor: 'Your inner state',
    question: 'How am I right now?',
  },
  space: {
    descriptor: 'Your environment',
    question: 'What supports my flow?',
  },
  story: {
    descriptor: 'Your direction',
    question: 'What am I building?',
  },
  spirit: {
    descriptor: 'Your core',
    question: 'What drives me?',
  },
};

export default function FrameworkPage() {
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const gridInView = useInView(gridRef, { once: true, margin: '-100px' });

  const [selectedKey, setSelectedKey] = useState<{ dimensionId: string; keyId: string } | null>(null);

  const handleKeyClick = (dimensionId: string, keyId: string) => {
    if (selectedKey?.dimensionId === dimensionId && selectedKey?.keyId === keyId) {
      setSelectedKey(null);
    } else {
      setSelectedKey({ dimensionId, keyId });
    }
  };

  return (
    <PageLayout accentColor="#7A4DA4">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <motion.p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: '#7A4DA4' }}
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            The Framework
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            The map behind{' '}
            <span className="bg-gradient-to-r from-[#FF6F61] via-[#5B84B1] to-[#7A4DA4] bg-clip-text text-transparent">
              your profile.
            </span>
          </motion.h1>

          <motion.p
            className="text-base text-gray-400 max-w-xl leading-relaxed mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Your Flow Archetype emerges from four dimensions. Here&apos;s what each one
            reveals — and why it shapes how freely you flow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link
              href="/map"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors group"
            >
              Don&apos;t have a profile yet? Map your signal
              <svg
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Framework Grid ────────────────────────────────────────────────────── */}
      <section ref={gridRef} className="relative py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6">

          <motion.p
            className="text-center text-sm text-gray-500 mb-10 md:mb-14"
            initial={{ opacity: 0, y: 16 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Tap into any dimension. Click a key to see what it opens up.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {Object.values(DIMENSIONS).map((dimension, index) => {
              const details = dimensionDetails[dimension.id as keyof typeof dimensionDetails];
              const isThisDimensionActive = selectedKey?.dimensionId === dimension.id;
              const selectedKeyData: Key | undefined = isThisDimensionActive && selectedKey
                ? dimension.keys.find(k => k.id === selectedKey.keyId)
                : undefined;

              return (
                <motion.div
                  key={dimension.id}
                  className="relative"
                  initial={{ opacity: 0, y: 40 }}
                  animate={gridInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.6 }}
                >
                  <div
                    className="relative rounded-2xl overflow-hidden border transition-colors duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                      borderColor: isThisDimensionActive ? `${dimension.color}40` : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    {/* Top accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ background: dimension.color }}
                    />

                    {/* Active dimension glow */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 50% 30%, ${dimension.color}12, transparent 70%)`,
                      }}
                      animate={{ opacity: isThisDimensionActive ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="relative p-6 md:p-8">

                      {/* ── Dimension header — links to dimension page ── */}
                      <Link
                        href={`/dimension/${dimension.id}`}
                        className="group/header block mb-6"
                      >
                        <div className="flex items-start gap-4 md:gap-5">
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

                          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover/header:opacity-100 transition-opacity flex-shrink-0">
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

                      {/* ── Keys grid — buttons, not links ── */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {dimension.keys.map((key, keyIndex) => {
                          const isSelected = selectedKey?.dimensionId === dimension.id && selectedKey?.keyId === key.id;

                          return (
                            <button
                              key={key.id}
                              onClick={() => handleKeyClick(dimension.id, key.id)}
                              className="group/key text-left w-full"
                            >
                              <motion.div
                                className="relative p-4 rounded-xl border h-full"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={gridInView ? { opacity: 1, scale: 1 } : {}}
                                style={{
                                  borderColor: isSelected ? `${dimension.color}60` : 'rgba(255,255,255,0.05)',
                                  background: isSelected ? `${dimension.color}12` : 'rgba(255,255,255,0.03)',
                                  boxShadow: isSelected ? `0 0 20px -8px ${dimension.color}50` : undefined,
                                }}
                                whileHover={!isSelected ? {
                                  y: -2,
                                  borderColor: `${dimension.color}40`,
                                  background: `${dimension.color}08`,
                                } : {}}
                                transition={{ delay: 0.2 + index * 0.1 + keyIndex * 0.08, duration: 0.3 }}
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

                                <h4 className="font-semibold text-white text-sm mb-1">
                                  {key.name}
                                </h4>

                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                  {key.description}
                                </p>

                                {/* Chevron — rotates when selected */}
                                <motion.div
                                  className="absolute top-3.5 right-3.5"
                                  animate={{ opacity: isSelected ? 1 : 0.3, rotate: isSelected ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    style={{ color: dimension.color }}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </motion.div>
                              </motion.div>
                            </button>
                          );
                        })}
                      </div>

                      {/* ── Key detail panel — expands below key row ── */}
                      <AnimatePresence>
                        {selectedKeyData && (
                          <motion.div
                            key={selectedKeyData.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div
                              className="mt-4 p-5 rounded-xl space-y-4"
                              style={{
                                background: `${dimension.color}08`,
                                border: `1px solid ${dimension.color}20`,
                              }}
                            >
                              <h4 className="font-bold text-base" style={{ color: dimension.color }}>
                                {selectedKeyData.name}
                              </h4>

                              <div className="space-y-3.5">
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                                    The Insight
                                  </p>
                                  <p className="text-sm text-gray-300 leading-relaxed">
                                    {selectedKeyData.coreInsight}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                                    Flow Connection
                                  </p>
                                  <p className="text-sm text-gray-300 leading-relaxed">
                                    {selectedKeyData.flowConnection}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                                    Without This
                                  </p>
                                  <p className="text-sm text-gray-400 leading-relaxed italic">
                                    {selectedKeyData.withoutThis}
                                  </p>
                                </div>
                              </div>

                              <Link
                                href={`/dimension/${dimension.id}/key/${selectedKeyData.id}`}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold hover:gap-2.5 transition-all duration-200"
                                style={{ color: dimension.color }}
                                onClick={e => e.stopPropagation()}
                              >
                                Explore this key in full
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Synergy Constellation ─────────────────────────────────────────────── */}
      <SynergyConstellation />

      {/* ── Bottom bridge CTA ─────────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Now that you know the terrain
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">
              What would you like to do with it?
            </h2>

            <div className="grid md:grid-cols-3 gap-5">

              {/* Train it */}
              <Link
                href="/apps"
                className="group relative rounded-2xl border border-white/10 p-6 hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300"
              >
                <div
                  className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center"
                  style={{ background: '#FF6F6115' }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: '#FF6F61' }} />
                </div>
                <h3 className="text-white font-bold mb-2">Train it</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  Build the conditions your archetype is pointing at. Each practice targets one or more of the four dimensions directly.
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500 group-hover:text-white transition-colors">
                  Practice system
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>

              {/* Interpret it */}
              <Link
                href="/together"
                className="group relative rounded-2xl border border-white/10 p-6 hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300"
              >
                <div
                  className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center"
                  style={{ background: '#5B84B115' }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: '#5B84B1' }} />
                </div>
                <h3 className="text-white font-bold mb-2">Interpret it</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  Walk through your archetype with a guide. See what it&apos;s actually pointing at — and what a concrete next move looks like.
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500 group-hover:text-white transition-colors">
                  Work together
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>

              {/* Map your signal */}
              <Link
                href="/map"
                className="group relative rounded-2xl border border-white/10 p-6 hover:border-[#7A4DA4]/40 hover:bg-[#7A4DA4]/[0.05] transition-all duration-300"
              >
                <div
                  className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center"
                  style={{ background: '#7A4DA415' }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: '#7A4DA4' }} />
                </div>
                <h3 className="text-white font-bold mb-2">Map your signal</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  The profile is the starting point. See which dimension is in the way — and what it looks like for you specifically.
                </p>
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all duration-200"
                  style={{ color: '#7A4DA4' }}
                >
                  Take the assessment
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>

            </div>
          </motion.div>
        </div>
      </section>

    </PageLayout>
  );
}
