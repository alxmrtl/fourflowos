'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getAllApps, App } from '@/data/apps';
import { DIMENSIONS } from '@/data/framework';
import LandingNav from '@/components/landing/LandingNav';

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
            <Image
              src={dim.icon}
              alt={dim.name}
              width={14}
              height={14}
              className="opacity-80"
            />
            <span className="text-[10px] font-medium" style={{ color: dim.color }}>
              {dim.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AppCard({ app, index, onClick, muted }: { app: App; index: number; onClick: () => void; muted?: boolean }) {
  const isActive = !app.inDevelopment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`group block w-full text-left rounded-2xl overflow-hidden transition-all duration-300 ${
        muted
          ? 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10'
          : 'bg-white/[0.06] border border-white/15 hover:bg-white/10 hover:border-white/25'
      }`}
    >
      {/* Gradient Header Strip */}
      <div className={`h-20 bg-gradient-to-r ${app.gradient} relative overflow-hidden`}>
        <div className={`absolute inset-0 ${muted ? 'bg-black/50' : 'bg-black/20'}`} />
        <div className="absolute bottom-3 left-4">
          <div className={`w-12 h-12 rounded-xl backdrop-blur-sm shadow-lg overflow-hidden flex-shrink-0 ${muted ? 'opacity-60' : ''}`} style={{ background: app.id === 'curiosity-explorer' ? '#333333' : 'rgba(255,255,255,0.2)' }}>
            <Image src={app.icon} alt={app.name} width={48} height={48} className="object-cover" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className={`text-lg font-bold transition-colors ${muted ? 'text-gray-400' : 'text-white'}`}>
            {app.name}
          </h3>
          <div className="flex gap-1 flex-shrink-0">
            {app.platforms.map((p) => (
              <PlatformBadge key={p} platform={p} />
            ))}
          </div>
        </div>
        <p className={`text-[13px] font-medium mb-3 ${muted ? 'text-gray-600' : ''}`} style={!muted ? { color: app.accentColor } : undefined}>{app.tagline}</p>

        <p className={`text-sm leading-relaxed mb-4 ${muted ? 'text-gray-600' : 'text-gray-400'}`}>{app.description}</p>

        {/* Dimension pills */}
        <DimensionPills pillars={app.relatedPillars} />

        {/* Actions */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={onClick}
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
    </motion.div>
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

          {/* Features */}
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

          {/* Pillars */}
          {pillarData.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Dimensions</h4>
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

          {/* CTA */}
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

export default function AppsPage() {
  const apps = getAllApps();
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  const active = apps.filter((a) => !a.inDevelopment);
  const inDev = apps.filter((a) => a.inDevelopment);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <LandingNav />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Tools &amp; Apps for{' '}
              <span className="bg-gradient-to-r from-[#FF6F61] via-[#6BA292] via-[#5B84B1] to-[#7A4DA4] bg-clip-text text-transparent">
                Flow
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Interactive tools and apps designed to help you enter flow states, build meaningful habits,
              and align your life with the Four Pillars framework.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Active Section */}
      <section className="pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">Active</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {active.map((app, index) => (
              <AppCard key={app.id} app={app} index={index} onClick={() => setSelectedApp(app)} />
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      {inDev.length > 0 && (
        <section className="pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-sm font-semibold text-white/30 uppercase tracking-wider mb-6">Coming Soon</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {inDev.map((app, index) => (
                <AppCard key={app.id} app={app} index={index + active.length} onClick={() => setSelectedApp(app)} muted />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="p-8 md:p-12 bg-gradient-to-br from-[#FF6F61]/10 via-[#6BA292]/10 to-[#7A4DA4]/10 border border-white/10 rounded-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Enter Your Flow State?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Start with any tool that resonates with you. Each is designed to stand alone
              while working together as part of the FourFlowOS ecosystem.
            </p>
            <Link
              href="/#framework"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-colors"
            >
              Learn the Framework
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6">
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

      {/* Modal */}
      <AnimatePresence>
        {selectedApp && (
          <AppModal app={selectedApp} onClose={() => setSelectedApp(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
