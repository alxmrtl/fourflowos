'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

const apps = [
  {
    id: 'flowspace',
    name: 'FlowSpace',
    tagline: 'Enter Your Flow State',
    description: 'A comprehensive focus app with binaural beats, breathwork patterns, and daily containers. Design your ideal focus sessions and track your flow experiences.',
    features: [
      'Binaural beats for enhanced focus',
      '7+ guided breathwork patterns',
      'Focus timer with daily containers',
      'Flow rep tracking & statistics',
      'Vision & mission alignment tools',
    ],
    icon: '/assets/apps/flowspace-icon.png',
    gradient: 'from-[#7A4DA4] to-[#5B84B1]',
    accentColor: '#7A4DA4',
    appStoreUrl: '#',
    comingSoon: false,
  },
  {
    id: 'fourflowhabits',
    name: 'FourFlow Habits',
    tagline: 'Build Flow-Aligned Habits',
    description: 'Track habits across all four pillars for holistic growth. Build streaks, earn achievements, and visualize your momentum toward balanced development.',
    features: [
      'Habits organized by 4 pillars',
      'Streak tracking with leaderboard',
      'Achievement badges & milestones',
      'Weekly momentum visualization',
      'Pillar balance analysis',
    ],
    icon: '/assets/apps/habits-icon.png',
    gradient: 'from-[#FF6F61] to-[#6BA292]',
    accentColor: '#FF6F61',
    appStoreUrl: '#',
    comingSoon: false,
  },
];

export default function AppsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="apps"
      ref={ref}
      className="relative py-24 md:py-32 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7A4DA4]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF6F61]/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            The Ecosystem
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Apps Built on{' '}
            <span className="bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] bg-clip-text text-transparent">
              FourFlowOS
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Practical tools that bring the framework to life. Each app is designed to help you
            master specific aspects of flow—privacy-first, beautifully crafted, endlessly useful.
          </p>
        </motion.div>

        {/* Apps grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {apps.map((app, index) => (
            <motion.div
              key={app.id}
              className="group relative"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + index * 0.2, duration: 0.6 }}
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
                    {app.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-center gap-3 text-sm text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.5 + index * 0.2 + featureIndex * 0.05 }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: app.accentColor }}
                        />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center gap-4">
                    {app.comingSoon ? (
                      <span className="px-6 py-3 bg-white/5 text-gray-500 font-medium rounded-full">
                        Coming Soon
                      </span>
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

        {/* Privacy callout */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Privacy First</p>
              <p className="text-sm text-gray-400">All data stored locally. No accounts. No tracking.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
