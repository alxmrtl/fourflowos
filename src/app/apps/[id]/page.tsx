'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { getApp, getAllApps } from '@/data/apps';
import { DIMENSIONS } from '@/data/framework';
import LandingNav from '@/components/landing/LandingNav';

export default function AppDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const app = getApp(id);

  if (!app) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <LandingNav />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/apps"
              className="inline-flex items-center text-gray-500 hover:text-white transition-colors mb-8"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Apps
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* App Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl flex-shrink-0">
                  <Image
                    src={app.icon}
                    alt={app.name}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {app.name}
                  </h1>
                  <p className="text-xl text-gray-400">{app.tagline}</p>
                </div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {app.description}
              </p>

              {/* Platforms & CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {app.platforms.includes('ios') && (
                  <a
                    href={app.appStoreUrl || '#'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0a0a0a] font-semibold rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    App Store
                  </a>
                )}
                {app.platforms.includes('web') && (
                  <a
                    href={app.webUrl || '#'}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Open Web App
                  </a>
                )}
              </div>

              {/* Related Dimensions */}
              <div>
                <p className="text-gray-500 text-sm mb-3">Related Dimensions</p>
                <div className="flex gap-2">
                  {app.relatedPillars.map((pillarId) => {
                    const pillar = DIMENSIONS[pillarId];
                    return (
                      <Link
                        key={pillarId}
                        href={`/dimension/${pillarId}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: `${pillar.color}20`,
                          color: pillar.color,
                        }}
                      >
                        <div className="w-4 h-4 relative">
                          <Image
                            src={pillar.icon}
                            alt={pillar.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        {pillar.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* App Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div
                className={`aspect-square rounded-3xl bg-gradient-to-br ${app.gradient} p-8 flex items-center justify-center relative overflow-hidden`}
              >
                {/* Decorative elements */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
                  style={{
                    backgroundImage: 'radial-gradient(circle at center, white 0%, transparent 60%)',
                    backgroundSize: '150% 150%',
                  }}
                />
                <div className="w-48 h-48 rounded-3xl bg-white/20 backdrop-blur-sm shadow-2xl overflow-hidden">
                  <Image
                    src={app.icon}
                    alt={app.name}
                    width={192}
                    height={192}
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-white mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Key Features
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {app.features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white font-bold"
                  style={{ backgroundColor: app.accentColor }}
                >
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Description */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="prose prose-invert prose-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">About {app.name}</h2>
            {app.fullDescription.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-300 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Privacy & Legal */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="p-8 bg-white/5 border border-white/10 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Privacy First</h3>
                <p className="text-gray-400 mb-4">
                  {app.name} stores all your data locally on your device. We never collect, transmit,
                  or have access to your personal data. Your habits, sessions, and preferences
                  remain completely private.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/privacy" className="text-[#6330A0] hover:text-[#9A6DC4] transition-colors text-sm font-medium">
                    Privacy Policy →
                  </Link>
                  <Link href="/terms" className="text-[#6330A0] hover:text-[#9A6DC4] transition-colors text-sm font-medium">
                    Terms of Service →
                  </Link>
                  <Link href="/support" className="text-[#6330A0] hover:text-[#9A6DC4] transition-colors text-sm font-medium">
                    Support →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other Apps */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Other Apps in the Ecosystem
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {getAllApps()
              .filter((a) => a.id !== app.id)
              .map((otherApp) => (
                <Link
                  key={otherApp.id}
                  href={`/apps/${otherApp.id}`}
                  className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden">
                      <Image
                        src={otherApp.icon}
                        alt={otherApp.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold group-hover:text-gray-200 transition-colors">
                        {otherApp.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{otherApp.tagline}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">{otherApp.description}</p>
                </Link>
              ))}
          </div>
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
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/support" className="text-gray-500 hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
