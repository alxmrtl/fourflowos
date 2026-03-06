'use client';

import { useState } from 'react';
import { motion, useInView, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';
import { GRADIENTS } from '@/styles/brand-colors';
import Link from 'next/link';
import { useRef } from 'react';
import { getAllApps, App } from '@/data/apps';
import { DIMENSIONS } from '@/data/framework';

function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-gray-400 uppercase font-semibold tracking-wider">
      {platform}
    </span>
  );
}

function DimensionPills({ pillars }: { pillars: App['relatedPillars'] }) {
  return (
    <div className="flex gap-1.5">
      {pillars.map((p) => {
        const dim = DIMENSIONS[p];
        if (!dim) return null;
        return (
          <div
            key={p}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ background: `${dim.color}15` }}
          >
            <Image src={dim.icon} alt={dim.name} width={14} height={14} className="opacity-80" />
            <span className="text-[10px] font-medium" style={{ color: dim.color }}>{dim.name}</span>
          </div>
        );
      })}
    </div>
  );
}

function AppModal({ app, onClose }: { app: App; onClose: () => void }) {
  const isActive = !app.inDevelopment;
  const pillarData = app.relatedPillars.map((p) => {
    const dim = DIMENSIONS[p];
    return dim ? { name: dim.name, color: dim.color, icon: dim.icon } : null;
  }).filter(Boolean) as { name: string; color: string; icon: string }[];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#141414] border border-white/10 rounded-3xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className={`h-28 bg-gradient-to-r ${app.gradient} relative overflow-hidden rounded-t-3xl`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-4 left-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg overflow-hidden">
              <Image src={app.icon} alt={app.name} width={64} height={64} className="object-cover" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h2 className="text-2xl font-bold text-white">{app.name}</h2>
            <div className="flex gap-1 flex-shrink-0 mt-1">
              {app.platforms.map((p) => (
                <PlatformBadge key={p} platform={p} />
              ))}
            </div>
          </div>
          <p className="text-sm font-medium mb-4" style={{ color: app.accentColor }}>{app.tagline}</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 whitespace-pre-line">{app.fullDescription}</p>

          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Features</h4>
            <ul className="space-y-2">
              {app.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: app.accentColor }} />
                  <div>
                    <span className="text-gray-200 font-medium">{feature.title}</span>
                    <span className="text-gray-500"> — {feature.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {pillarData.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Dimensions</h4>
              <div className="flex gap-2">
                {pillarData.map((p) => (
                  <span key={p.name} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: `${p.color}20`, color: p.color }}>
                    <Image src={p.icon} alt={p.name} width={14} height={14} />
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {isActive ? (
            <a
              href={app.webUrl || app.appStoreUrl || '#'}
              className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Open
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          ) : (
            <button disabled className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-white/5 border border-white/10 text-gray-500 font-semibold rounded-full cursor-not-allowed">
              Coming Soon
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function CardContent({ app, muted, onMoreInfo }: { app: App; muted?: boolean; onMoreInfo: () => void }) {
  const isActive = !app.inDevelopment;

  return (
    <>
      <div className={`h-20 bg-gradient-to-r ${app.gradient} relative overflow-hidden`}>
        <div className={`absolute inset-0 ${muted ? 'bg-black/50' : 'bg-black/20'}`} />
        <div className="absolute bottom-3 left-4">
          <div className={`w-12 h-12 rounded-xl backdrop-blur-sm shadow-lg overflow-hidden flex-shrink-0 ${muted ? 'opacity-60' : ''}`} style={{ background: app.id === 'curiosity-explorer' ? '#333333' : 'rgba(255,255,255,0.2)' }}>
            <Image src={app.icon} alt={app.name} width={48} height={48} className="object-cover" />
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className={`text-lg font-bold transition-colors ${muted ? 'text-gray-400' : 'text-white'}`}>{app.name}</h3>
          <div className="flex gap-1 flex-shrink-0">
            {app.platforms.map((p) => (
              <PlatformBadge key={p} platform={p} />
            ))}
          </div>
        </div>
        <p className={`text-[13px] font-medium mb-3 ${muted ? 'text-gray-600' : ''}`} style={!muted ? { color: app.accentColor } : undefined}>{app.tagline}</p>
        <p className={`text-sm leading-relaxed mb-4 ${muted ? 'text-gray-600' : 'text-gray-400'}`}>{app.description}</p>
        <DimensionPills pillars={app.relatedPillars} />
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onMoreInfo(); }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              muted
                ? 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                : 'bg-white/10 text-gray-300 hover:bg-white/15 hover:text-white'
            }`}
          >
            More Info
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {isActive ? (
            <a
              href={app.webUrl || app.appStoreUrl || '#'}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-gray-100 transition-colors"
            >
              Open
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          ) : (
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-gray-600 cursor-not-allowed">
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default function AppsSection() {
  const apps = getAllApps();
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2 });

  const active = apps.filter((a) => !a.inDevelopment);
  const inDev = apps.filter((a) => a.inDevelopment);

  const containerVariants: Variants = {
    hidden: { opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: 'easeOut' as const },
    },
  };

  return (
    <section
      id="apps"
      ref={ref}
      className="relative py-24 md:py-32 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] overflow-hidden"
    >
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6330A0]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#E84535]/10 rounded-full blur-3xl" />

      <motion.div
        className="max-w-7xl mx-auto px-6 relative z-10"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <motion.div className="text-center mb-16 md:mb-20" variants={itemVariants}>
          <motion.span
            className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-6"
            variants={itemVariants}
          >
            Tools &amp; Apps
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Tools That Put It{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRADIENTS.textAccent }}>
              Into Practice
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Each tool targets a specific aspect of flow. All privacy-first, all local data, no accounts required.
          </p>
        </motion.div>

        {/* Active */}
        <motion.h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-5" variants={itemVariants}>Active</motion.h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {active.map((app) => (
            <motion.div
              key={app.id}
              className="group block w-full text-left bg-white/[0.06] border border-white/15 hover:bg-white/10 hover:border-white/25 rounded-2xl overflow-hidden transition-all duration-300"
              variants={itemVariants}
            >
              <CardContent app={app} onMoreInfo={() => setSelectedApp(app)} />
            </motion.div>
          ))}
        </div>

        {/* Coming Soon */}
        {inDev.length > 0 && (
          <>
            <motion.h3 className="text-sm font-semibold text-white/30 uppercase tracking-wider mb-5" variants={itemVariants}>Coming Soon</motion.h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {inDev.map((app) => (
                <motion.div
                  key={app.id}
                  className="group block w-full text-left bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 rounded-2xl overflow-hidden transition-all duration-300"
                  variants={itemVariants}
                >
                  <CardContent app={app} muted onMoreInfo={() => setSelectedApp(app)} />
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* View all link */}
        <motion.div className="text-center" variants={itemVariants}>
          <Link
            href="/apps"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-white font-medium rounded-full hover:bg-white/5 transition-colors text-sm"
          >
            View All Tools & Apps
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selectedApp && (
          <AppModal app={selectedApp} onClose={() => setSelectedApp(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
