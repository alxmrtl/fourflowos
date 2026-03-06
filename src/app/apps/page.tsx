'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { GRADIENTS } from '@/styles/brand-colors';
import Link from 'next/link';
import { APPS, App } from '@/data/apps';
import { DIMENSIONS } from '@/data/framework';
import { DimensionType } from '@/types/framework';
import LandingNav from '@/components/landing/LandingNav';
import { useAuth } from '@/hooks/useAuth';

// ─── Live tool display order ───────────────────────────────────────────────────

const LIVE_ORDER = ['flowzone', 'flowread', 'curiosity-explorer', 'flowrep'];

// ─── Platform badge ────────────────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span className="px-2 py-0.5 bg-white/8 rounded text-[10px] text-gray-500 uppercase font-semibold tracking-wider">
      {platform}
    </span>
  );
}

// ─── App detail modal ─────────────────────────────────────────────────────────

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

// ─── Live tool row ─────────────────────────────────────────────────────────────

function ToolRow({
  app,
  index,
  onDetails,
}: {
  app: App;
  index: number;
  onDetails: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="flex items-start gap-4 md:gap-5 p-5 md:p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.055] hover:border-white/[0.18] transition-all duration-300"
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 mt-0.5"
        style={{ background: `${app.accentColor}18`, border: `1px solid ${app.accentColor}28` }}
      >
        <Image src={app.icon} alt={app.name} width={44} height={44} className="object-cover" />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {/* Name + tagline inline */}
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 mb-2">
          <h3 className="text-base md:text-[17px] font-bold text-white leading-snug">{app.name}</h3>
          <span className="text-sm font-medium" style={{ color: app.accentColor }}>
            {app.tagline}
          </span>
        </div>

        {/* What it is */}
        {app.what && (
          <p className="text-xs text-gray-600 mb-2">{app.what}</p>
        )}

        {/* Description */}
        <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">{app.description}</p>

        {/* Footer: platforms + actions */}
        <div className="flex items-center gap-2 mt-3.5 flex-wrap">
          {app.platforms.map((p) => <PlatformBadge key={p} platform={p} />)}
          <div className="flex-1" />
          <button
            onClick={onDetails}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
          >
            Details
          </button>
          <a
            href={app.webUrl || app.appStoreUrl || '#'}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-gray-100 transition-colors"
          >
            Open
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Coming soon card ─────────────────────────────────────────────────────────

function ComingSoonCard({ app, index }: { app: App; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="flex items-start gap-4 p-5 rounded-2xl border border-white/6 bg-white/[0.018]"
    >
      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 opacity-35 mt-0.5">
        <Image src={app.icon} alt={app.name} width={40} height={40} className="object-cover" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-500">{app.name}</h3>
          <span className="text-[10px] font-semibold text-gray-700 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Soon
          </span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">{app.description}</p>
        <div className="flex gap-1 mt-2.5">
          {app.platforms.map((p) => <PlatformBadge key={p} platform={p} />)}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section divider label ────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-white/6" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PracticePage() {
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const { user } = useAuth();

  const liveTools = LIVE_ORDER.map((id) => APPS[id]).filter((a): a is App => Boolean(a) && !a.inDevelopment);
  const comingSoon = Object.values(APPS).filter((a) => a.inDevelopment);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <LandingNav />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Practice System
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-normal text-white mb-5 leading-[1.1]">
              The tools that{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRADIENTS.textWide }}>
                train flow.
              </span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-xl mb-8">
              Each practice targets a specific condition that flow requires — attention, velocity, curiosity, movement.
              Use your Flow Profile to know where to start, or begin anywhere.
            </p>

            {user ? (
              <Link
                href="/me"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-sm text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                See which conditions to prioritize
              </Link>
            ) : (
              <Link
                href="/map"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#6330A0]/20 transition-all"
                style={{ background: GRADIENTS.primaryCta }}
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
      <div className="max-w-3xl mx-auto px-6 mb-10">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Live tools */}
      <div className="max-w-3xl mx-auto px-6 mb-16">
        <SectionLabel label="Live" />
        <div className="flex flex-col gap-3">
          {liveTools.map((app, i) => (
            <ToolRow
              key={app.id}
              app={app}
              index={i}
              onDetails={() => setSelectedApp(app)}
            />
          ))}
        </div>
      </div>

      {/* Coming soon */}
      {comingSoon.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 mb-24">
          <SectionLabel label="Coming Soon" />
          <div className="grid sm:grid-cols-2 gap-3">
            {comingSoon.map((app, i) => (
              <ComingSoonCard key={app.id} app={app} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="p-8 md:p-10 rounded-3xl border border-white/8 bg-white/[0.03] text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-normal text-white mb-3">
              Start with your profile.
            </h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm leading-relaxed">
              Your Flow Profile shows which conditions are restricting access right now.
              Use that to choose where to focus — rather than guessing.
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#6330A0]/20 transition-all"
                style={{ background: GRADIENTS.primaryCta }}
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
        <div className="max-w-3xl mx-auto px-6">
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
