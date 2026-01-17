'use client';

import { motion, useInView, Variants } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

const apps = [
  {
    id: 'flowzone',
    name: 'FlowZone',
    tagline: 'Train Your Focus',
    description: 'Focus timer with breathwork, distraction tracking, and support through the hard first 25%. Build your focus muscle session by session.',
    features: [
      'Focus Reps tracking',
      'Struggle Phase support',
      'Breathwork integration',
      'Goal linking & daily containers',
      'Statistics & insights',
    ],
    icon: '/assets/apps/flowzone-icon.png',
    gradient: 'from-[#FF6F61] to-[#7A4DA4]',
    accentColor: '#FF6F61',
    appStoreUrl: '#',
    comingSoon: false,
  },
  {
    id: 'flowhabits',
    name: 'FlowHabits',
    tagline: 'Balanced Daily Habits',
    description: 'Habit tracker organized by the four dimensions. Build routines that support flow across Self, Space, Story, and Spirit.',
    features: [
      'Four Pillars organization',
      'Streak tracking',
      'Balance indicators',
      'Gentle accountability',
      'Local privacy',
    ],
    icon: '/assets/apps/flowhabits-icon.png',
    gradient: 'from-[#6BA292] to-[#5B84B1]',
    accentColor: '#6BA292',
    appStoreUrl: '#',
    comingSoon: false,
  },
  {
    id: 'flowread',
    name: 'FlowRead',
    tagline: 'Read Faster, Focus Deeper',
    description: 'Speed reading trainer using RSVP and chunking. Expand your reading capacity and find flow in text.',
    features: [
      'RSVP training',
      'Word chunking',
      'Progressive speed',
      'Custom content',
      'Progress tracking',
    ],
    icon: '/assets/apps/flowread-icon.png',
    gradient: 'from-[#5B84B1] to-[#7A4DA4]',
    accentColor: '#5B84B1',
    appStoreUrl: '#',
    webUrl: '#',
    isWebApp: true,
    comingSoon: false,
  },
  {
    id: 'flowrep',
    name: 'FlowRep',
    tagline: 'Simple Movement Tracking',
    description: 'Minimalist rep counter for daily exercise. Set targets, track streaks, build consistency.',
    features: [
      'Daily rep tracking',
      'Daily targets',
      'Streak tracking',
      'Custom exercises',
      'Minimalist design',
    ],
    icon: '/assets/apps/flowrep-icon.png',
    gradient: 'from-[#FF6F61] to-[#5B84B1]',
    accentColor: '#FF6F61',
    appStoreUrl: '#',
    comingSoon: false,
  },
];

export default function AppsSection() {
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
            The Apps
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

        {/* Apps grid */}
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
                    {app.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3 text-sm text-gray-300"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: app.accentColor }}
                        />
                        {feature}
                      </li>
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

      </motion.div>
    </section>
  );
}
