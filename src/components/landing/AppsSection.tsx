'use client';

import { motion, useInView, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { getAllApps } from '@/data/apps';

export default function AppsSection() {
  const apps = getAllApps();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2 }); // Removed once: true

  const containerVariants: Variants = {
    hidden: { opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
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
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7A4DA4]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF6F61]/10 rounded-full blur-3xl" />

      <motion.div
        className="max-w-7xl mx-auto px-6 relative z-10"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        {/* Section header */}
        <motion.div className="text-center mb-16 md:mb-20" variants={itemVariants}>
          <motion.span
            className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-6"
            variants={itemVariants}
          >
            Tools &amp; Apps
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Tools That Put It{' '}
            <span className="bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] bg-clip-text text-transparent">
              Into Practice
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Each app targets a specific aspect of flow. All privacy-first, all local data, no accounts required.
          </p>
        </motion.div>

        {/* Interactive Tools */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Interactive Tools</h3>
          <Link
            href="/dimension/spirit/key/ignited-curiosity#curiosity-explorer"
            className="group block p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-[#7A4DA4]/10 to-transparent border border-[#7A4DA4]/20 hover:border-[#7A4DA4]/40 transition-all duration-300"
          >
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#7A4DA4]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#7A4DA4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">
                  Curiosity Explorer
                </h4>
                <p className="text-sm text-[#7A4DA4] font-medium mb-2">Spirit &middot; Ignited Curiosity</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Surface your curiosities from multiple angles, then find unique intersections where your flow lives. A guided braindump that connects to your vision, values, and purpose.
                </p>
              </div>
              <div className="flex-shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <svg className="w-5 h-5 text-[#7A4DA4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Apps grid */}
        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Apps</h3>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {apps.map((app, index) => (
            <motion.div
              key={app.id}
              className="group relative"
              variants={itemVariants}
            >
              <div className="relative p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden h-full">
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                {/* Glow effect */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{ background: app.accentColor }}
                />

                <div className="relative z-10">
                  {/* App icon and header */}
                  <div className="flex items-start gap-6 mb-6">
                    <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 bg-gradient-to-br from-gray-800 to-gray-900">
                      <Image
                        src={app.icon}
                        alt={app.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                        {app.name}
                      </h3>
                      <p
                        className="text-sm font-medium"
                        style={{ color: app.accentColor }}
                      >
                        {app.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {app.description}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-3 mb-8">
                    {app.features.slice(0, 5).map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3 text-sm text-gray-300"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: app.accentColor }}
                        />
                        {feature.title}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center gap-4">
                    {app.inDevelopment ? (
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-gray-400 font-medium rounded-full">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          In Development
                        </span>
                      </div>
                    ) : (
                      <a
                        href={app.appStoreUrl}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        Download on App Store
                      </a>
                    )}
                    <span className="text-xs text-gray-500">
                      100% Local Data
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </section>
  );
}
