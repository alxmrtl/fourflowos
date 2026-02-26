'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getAllApps, App } from '@/data/apps';
import { DIMENSIONS } from '@/data/framework';
import { DimensionType } from '@/types/framework';
import LandingNav from '@/components/landing/LandingNav';
import { useAuth } from '@/hooks/useAuth';

// ─── Pillar meta: keys trained + practice rationale ───────────────────────────

const PILLAR_PRACTICE_META: Record<DimensionType, {
  trains: string[];
  practiceRationale: string;
}> = {
  self: {
    trains: ['Tuned Emotions', 'Focused Body', 'Open Mind'],
    practiceRationale: 'The SELF pillar is your reception layer — how well you pick up your own signals. Training it means building the physical and mental conditions that let you enter flow on demand.',
  },
  space: {
    trains: ['Intentional Space', 'Optimized Tools', 'Feedback Systems'],
    practiceRationale: 'SPACE is the transmission layer — your environment either amplifies or dampens the signal. Training it means removing friction so the work flows instead of fights.',
  },
  story: {
    trains: ['Generative Story', 'Clear Mission', 'Empowered Role'],
    practiceRationale: 'STORY gives your effort direction across time. Training it means clarifying what you\'re building and why — so daily action connects to something larger.',
  },
  spirit: {
    trains: ['Grounding Values', 'Ignited Curiosity', 'Visualized Vision'],
    practiceRationale: 'SPIRIT is your timeless direction — what is always true for you. Training it means surfacing the curiosity and vision that make flow feel inevitable rather than forced.',
  },
};

// ─── App detail modal ─────────────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-gray-400 uppercase font-semibold tracking-wider">
      {platform}
    </span>
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
              {app.platforms.map((p) => <PlatformBadge key={p} platform={p} />)}
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
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Pillars Trained</h4>
              <div className="flex gap-2">
                {pillarData.map((p) => (
                  <span
                    key={p.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: `${p.color}20`, color: p.color }}
                  >
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
            <button
              disabled
              className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-white/5 border border-white/10 text-gray-500 font-semibold rounded-full cursor-not-allowed"
            >
              Coming Soon
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Practice card (compact, pillar-aware) ────────────────────────────────────

function PracticeCard({
  app,
  primaryPillar,
  index,
  onClick,
}: {
  app: App;
  primaryPillar: DimensionType;
  index: number;
  onClick: () => void;
}) {
  const isActive = !app.inDevelopment;
  const dim = DIMENSIONS[primaryPillar];
  // Secondary pillars (not the primary one displayed in this section)
  const secondaryPillars = app.relatedPillars.filter((p) => p !== primaryPillar);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 ${
        isActive
          ? 'bg-white/[0.04] border-white/10 hover:bg-white/[0.07] hover:border-white/20'
          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
      }`}
    >
      {/* Pillar color top strip */}
      <div className="h-0.5 w-full" style={{ background: isActive ? dim.color : `${dim.color}40` }} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 ${isActive ? '' : 'opacity-40'}`}
            style={{ background: `${dim.color}15` }}
          >
            <Image src={app.icon} alt={app.name} width={40} height={40} className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-bold text-base ${isActive ? 'text-white' : 'text-gray-500'}`}>
                {app.name}
              </h3>
              {!isActive && (
                <span className="text-[10px] font-semibold text-gray-600 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Soon
                </span>
              )}
            </div>
            <p className={`text-xs font-medium mt-0.5 ${isActive ? '' : 'text-gray-600'}`} style={isActive ? { color: app.accentColor } : undefined}>
              {app.tagline}
            </p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {app.platforms.map((p) => <PlatformBadge key={p} platform={p} />)}
          </div>
        </div>

        {/* Description */}
        <p className={`text-sm leading-relaxed mb-4 ${isActive ? 'text-gray-400' : 'text-gray-600'}`}>
          {app.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {secondaryPillars.map((sp) => {
              const spDim = DIMENSIONS[sp];
              if (!spDim) return null;
              return (
                <span
                  key={sp}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background: `${spDim.color}15`, color: `${spDim.color}99` }}
                >
                  + {spDim.name}
                </span>
              );
            })}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onClick}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
            >
              Details
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
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Pillar section ───────────────────────────────────────────────────────────

function PillarSection({
  pillar,
  apps,
  onSelectApp,
  baseIndex,
}: {
  pillar: DimensionType;
  apps: App[];
  onSelectApp: (app: App) => void;
  baseIndex: number;
}) {
  const dim = DIMENSIONS[pillar];
  const meta = PILLAR_PRACTICE_META[pillar];

  return (
    <section className="mb-16">
      {/* Pillar header */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${dim.color}15`, border: `1px solid ${dim.color}30` }}
        >
          <Image src={dim.icon} alt={dim.name} width={22} height={22} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: dim.color }}>
              {dim.name}
            </h2>
            <div className="flex items-center gap-1.5 flex-wrap">
              {meta.trains.map((key) => (
                <span
                  key={key}
                  className="text-[10px] text-gray-500 px-2 py-0.5 rounded-full bg-white/5 font-medium"
                >
                  {key}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
            {meta.practiceRationale}
          </p>
        </div>
      </div>

      {/* App cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((app, i) => (
          <PracticeCard
            key={app.id}
            app={app}
            primaryPillar={pillar}
            index={baseIndex + i}
            onClick={() => onSelectApp(app)}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PracticePage() {
  const apps = getAllApps();
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const { user } = useAuth();

  // Group apps by their primary pillar (first in relatedPillars array).
  // Each app appears only once, under its primary pillar.
  const pillarOrder: DimensionType[] = ['self', 'space', 'story', 'spirit'];
  const grouped: Record<DimensionType, App[]> = { self: [], space: [], story: [], spirit: [] };

  apps.forEach((app) => {
    const primary = app.relatedPillars[0];
    if (primary && grouped[primary]) {
      grouped[primary].push(app);
    }
  });

  // Build pillar sections only for pillars that have apps
  const activePillars = pillarOrder.filter((p) => grouped[p].length > 0);

  // Running index for staggered animation
  let runningIndex = 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <LandingNav />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumb label */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Practice System
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              Train the conditions <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#FF6F61] via-[#6BA292] via-[#5B84B1] to-[#7A4DA4] bg-clip-text text-transparent">
                your profile measures.
              </span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mb-8">
              The Flow Profile maps which of the four pillars are restricting your flow.
              Each practice below trains one or more of those pillars directly —
              so you know exactly where to focus your effort.
            </p>

            {/* Profile bridge CTA */}
            {user ? (
              <Link
                href="/me"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-sm text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View your signal to see which pillars to prioritize
              </Link>
            ) : (
              <Link
                href="/map"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                Map your signal first
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Pillar sections */}
      <div className="max-w-4xl mx-auto px-6">
        {activePillars.map((pillar) => {
          const sectionApps = grouped[pillar];
          const idx = runningIndex;
          runningIndex += sectionApps.length;
          return (
            <PillarSection
              key={pillar}
              pillar={pillar}
              apps={sectionApps}
              onSelectApp={setSelectedApp}
              baseIndex={idx}
            />
          );
        })}
      </div>

      {/* Bottom CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="p-8 md:p-10 rounded-3xl border border-white/8 bg-white/[0.03] text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-3">
              Start with your profile.
            </h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm leading-relaxed">
              The assessment tells you which pillars are restricting your flow right now.
              Use that to pick where to start — rather than guessing.
            </p>
            {user ? (
              <Link
                href="/me"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-white text-sm font-semibold hover:bg-white/5 transition-colors"
              >
                Open your signal dashboard
              </Link>
            ) : (
              <Link
                href="/map"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                Map your signal
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} FourFlowOS. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">Terms</Link>
              <Link href="/support" className="text-gray-500 hover:text-white transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedApp && (
          <AppModal app={selectedApp} onClose={() => setSelectedApp(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
