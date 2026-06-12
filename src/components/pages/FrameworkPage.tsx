'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { GRADIENTS } from '@/styles/brand-colors';
import { useRef, useState } from 'react';
import { DIMENSIONS } from '@/data/framework';
import PageLayout from '@/components/layout/PageLayout';
import SynergyConstellation from '@/components/landing/SynergyConstellation';
import { useAuth } from '@/hooks/useAuth';

const dimensionDetails = {
  self: {
    descriptor: 'Your inner state',
    question: 'How am I right now?',
    tagline: 'Body, mind, and emotion in tune — the signal chain starts here.',
  },
  space: {
    descriptor: 'Your environment',
    question: 'What supports my flow?',
    tagline: 'The setup that makes focus the path of least resistance.',
  },
  story: {
    descriptor: 'Your direction',
    question: 'What am I building?',
    tagline: 'Mission, role, and arc — where past meets future.',
  },
  spirit: {
    descriptor: 'Your core',
    question: 'What drives me?',
    tagline: 'Values and vision as fuel, not constraint.',
  },
};

// Radial reveal origins based on key index (left / middle / right)
const KEY_ORIGINS = ['15% 75%', '50% 75%', '85% 75%'];

export default function FrameworkPage() {
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const gridInView = useInView(gridRef, { once: true, margin: '-100px' });
  const { user } = useAuth();

  const [selectedKey, setSelectedKey] = useState<{ dimensionId: string; keyId: string } | null>(null);

  const handleKeyClick = (dimensionId: string, keyId: string) => {
    if (selectedKey?.dimensionId === dimensionId && selectedKey?.keyId === keyId) {
      setSelectedKey(null);
    } else {
      setSelectedKey({ dimensionId, keyId });
    }
  };

  const handleSwitchKey = (dimensionId: string, keyId: string) => {
    setSelectedKey({ dimensionId, keyId });
  };

  return (
    <PageLayout accentColor="#6330A0">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <motion.p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: '#6330A0' }}
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            The Framework
          </motion.p>

          <motion.h1
            className="font-display text-5xl md:text-6xl font-normal text-white mb-4 leading-[1.1]"
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            The map behind{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRADIENTS.textWide }}>
              your profile.
            </span>
          </motion.h1>

          <motion.p
            className="text-base text-gray-400 max-w-xl leading-relaxed mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Your Flow Archetype emerges from four dimensions. Here&apos;s what each one
            reveals — and why it shapes how freely you flow.
          </motion.p>

          <motion.p
            className="text-sm text-gray-500"
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Tap into any dimension. Click a key to see what it opens up.
          </motion.p>
        </div>
      </section>

      {/* ── Framework Grid ────────────────────────────────────────────────────── */}
      <section ref={gridRef} className="relative py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {Object.values(DIMENSIONS).map((dimension, index) => {
              const details = dimensionDetails[dimension.id as keyof typeof dimensionDetails];
              const isThisDimensionActive = selectedKey?.dimensionId === dimension.id;
              const selectedKeyData = isThisDimensionActive && selectedKey
                ? dimension.keys.find(k => k.id === selectedKey.keyId)
                : undefined;
              const selectedKeyIndex = isThisDimensionActive && selectedKey
                ? dimension.keys.findIndex(k => k.id === selectedKey.keyId)
                : 0;
              const radialOrigin = KEY_ORIGINS[selectedKeyIndex] ?? '50% 75%';

              return (
                <motion.div
                  key={dimension.id}
                  className="relative"
                  initial={{ opacity: 0, y: 40 }}
                  animate={gridInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.6 }}
                >
                  <div
                    className="relative rounded-2xl overflow-hidden border"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                      borderColor: isThisDimensionActive ? `${dimension.color}40` : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    {/* Left spine — Signal Pulse */}
                    <div
                      className="absolute top-0 left-0 bottom-0 w-4 z-10 flex flex-col items-center justify-evenly py-8"
                      style={{
                        background: `${dimension.color}0D`,
                        borderRight: `1px solid ${dimension.color}20`,
                      }}
                    >
                      {dimension.keys.map((key) => {
                        const isKeyActive = selectedKey?.keyId === key.id && isThisDimensionActive;
                        return (
                          <div
                            key={key.id}
                            className="rounded-full transition-all duration-300"
                            style={{
                              width: isKeyActive ? 7 : 4,
                              height: isKeyActive ? 7 : 4,
                              background: isKeyActive ? dimension.color : `${dimension.color}40`,
                              boxShadow: isKeyActive ? `0 0 8px 3px ${dimension.color}70` : 'none',
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* ── Front layer: dimension header + compact key buttons (drives card height) ── */}
                    <motion.div
                      className="relative p-6 md:p-8 pt-7 md:pt-9 pl-8 md:pl-10"
                      animate={{
                        opacity: isThisDimensionActive ? 0 : 1,
                        pointerEvents: isThisDimensionActive ? 'none' : 'auto',
                      }}
                      transition={{ duration: 0.3, delay: isThisDimensionActive ? 0 : 0.3 }}
                    >
                      {/* Dimension header — links to dimension page */}
                      <Link
                        href={`/dimension/${dimension.id}`}
                        className="group/header block mb-6"
                      >
                        <div className="flex items-start gap-4 md:gap-5">
                          <div
                            className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl flex-shrink-0"
                            style={{ background: `${dimension.color}15` }}
                          >
                            <Image
                              src={dimension.sectionLogo}
                              alt={dimension.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>

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

                      {/* Compact key selector buttons */}
                      <div className="grid grid-cols-3 gap-3">
                        {dimension.keys.map((key) => (
                          <button
                            key={key.id}
                            onClick={() => handleKeyClick(dimension.id, key.id)}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] text-center"
                            style={{
                              borderColor: `${dimension.color}20`,
                              background: `${dimension.color}08`,
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLElement).style.borderColor = `${dimension.color}50`;
                              (e.currentTarget as HTMLElement).style.background = `${dimension.color}15`;
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLElement).style.borderColor = `${dimension.color}20`;
                              (e.currentTarget as HTMLElement).style.background = `${dimension.color}08`;
                            }}
                          >
                            <div
                              className="relative w-10 h-10 rounded-lg flex-shrink-0"
                              style={{ background: `${dimension.color}20` }}
                            >
                              <Image
                                src={key.icon}
                                alt={key.name}
                                fill
                                className="object-contain p-1.5"
                              />
                            </div>
                            <span className="text-[11px] text-gray-300 leading-tight font-medium">
                              {key.name}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Dimension tagline — fills vertical rhythm, gives back layer room */}
                      <p className="text-xs text-gray-600 mt-4 pb-2 leading-relaxed">
                        {details.tagline}
                      </p>
                    </motion.div>

                    {/* ── Radial ink sweep overlay ── */}
                    <motion.div
                      className="absolute inset-0"
                      initial={false}
                      animate={{
                        clipPath: isThisDimensionActive
                          ? `circle(150% at ${radialOrigin})`
                          : `circle(0% at ${radialOrigin})`,
                      }}
                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        background: `linear-gradient(135deg, ${dimension.color}25, ${dimension.color}15)`,
                      }}
                    />

                    {/* ── Back layer: key detail + switcher tabs ── */}
                    <motion.div
                      className="absolute inset-0 pt-7 md:pt-9 pr-6 md:pr-8 pb-6 md:pb-8 pl-8 md:pl-10 flex flex-col overflow-hidden"
                      initial={false}
                      animate={{
                        opacity: isThisDimensionActive ? 1 : 0,
                        pointerEvents: isThisDimensionActive ? 'auto' : 'none',
                      }}
                      transition={{ duration: 0.3, delay: isThisDimensionActive ? 0.3 : 0 }}
                    >
                      {/* Close button — absolute, zero layout footprint */}
                      <button
                        onClick={() => setSelectedKey(null)}
                        className="absolute top-4 right-4 w-6 h-6 rounded-full border border-white/15 flex items-center justify-center text-gray-600 hover:text-gray-300 hover:border-white/30 transition-colors z-10"
                        aria-label="Close"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Key insights — flex-1, clips gracefully if content is long */}
                      <div className="flex-1 overflow-hidden">
                        {selectedKeyData && (
                          <div className="space-y-2.5">
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">
                                The Insight
                              </p>
                              <p className="text-xs text-gray-300 leading-relaxed">
                                {selectedKeyData.coreInsight}
                              </p>
                            </div>

                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">
                                Flow Connection
                              </p>
                              <p className="text-xs text-gray-300 leading-relaxed">
                                {selectedKeyData.flowConnection}
                              </p>
                            </div>

                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">
                                Without This
                              </p>
                              <p className="text-xs text-gray-400 leading-relaxed italic">
                                {selectedKeyData.withoutThis}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Explore link + key switcher — pinned to bottom, never clipped */}
                      <div className="flex-shrink-0 mt-3">
                        {selectedKeyData && (
                          <Link
                            href={`/dimension/${dimension.id}/key/${selectedKeyData.id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold hover:gap-2 transition-all duration-200 mb-2.5"
                            style={{ color: dimension.color }}
                            onClick={e => e.stopPropagation()}
                          >
                            Explore this key in full
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        )}
                        <div className="flex gap-1.5 pt-2.5 border-t border-white/10">
                          {dimension.keys.map((key) => {
                            const isActive = selectedKey?.keyId === key.id;
                            return (
                              <button
                                key={key.id}
                                onClick={() => handleSwitchKey(dimension.id, key.id)}
                                className="flex-1 py-1 rounded-lg text-[10px] font-medium transition-all duration-200 leading-tight"
                                style={{
                                  background: isActive ? `${dimension.color}20` : 'rgba(255,255,255,0.03)',
                                  color: isActive ? dimension.color : '#6b7280',
                                  border: `1px solid ${isActive ? `${dimension.color}40` : 'rgba(255,255,255,0.07)'}`,
                                }}
                              >
                                {key.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>

                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Auth-aware CTA below grid */}
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link
              href={user ? '/me' : '/map'}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors group"
            >
              {user ? 'Explore your profile' : 'Get your Flow Profile'}
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
                  style={{ background: '#E8453515' }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: '#E84535' }} />
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
                  style={{ background: '#3E6FA315' }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: '#3E6FA3' }} />
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
                className="group relative rounded-2xl border border-white/10 p-6 hover:border-[#6330A0]/40 hover:bg-[#6330A0]/[0.05] transition-all duration-300"
              >
                <div
                  className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center"
                  style={{ background: '#6330A015' }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: '#6330A0' }} />
                </div>
                <h3 className="text-white font-bold mb-2">Map your signal</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  The profile is the starting point. See which dimension is in the way — and what it looks like for you specifically.
                </p>
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all duration-200"
                  style={{ color: '#6330A0' }}
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
