'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getAllApps, App } from '@/data/apps';
import LandingNav from '@/components/landing/LandingNav';

function AppCard({ app, index }: { app: App; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/apps/${app.id}`}
        className="group block bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300"
      >
        {/* Gradient Header */}
        <div
          className={`h-32 bg-gradient-to-r ${app.gradient} relative overflow-hidden`}
        >
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            style={{
              backgroundImage: 'radial-gradient(circle at center, white 0%, transparent 70%)',
              backgroundSize: '200% 200%',
            }}
          />
          <div className="absolute bottom-4 left-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg overflow-hidden">
              <Image
                src={app.icon}
                alt={app.name}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
          </div>
          {app.comingSoon && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-white text-xs font-medium">
              Coming Soon
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-xl font-bold text-white group-hover:text-gray-200 transition-colors">
              {app.name}
            </h3>
            <div className="flex gap-1">
              {app.platforms.map((platform) => (
                <span
                  key={platform}
                  className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400 uppercase"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-4">{app.tagline}</p>
          <p className="text-gray-400 text-sm line-clamp-2">{app.description}</p>

          {/* Features Preview */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {app.features.slice(0, 3).map((feature, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-white/5 rounded text-xs text-gray-500"
                >
                  {feature.title}
                </span>
              ))}
              {app.features.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-600">
                  +{app.features.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="mt-4 flex items-center text-sm text-gray-500 group-hover:text-white transition-colors">
            <span>Learn more</span>
            <svg
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function AppsPage() {
  const apps = getAllApps();

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
              Apps Built for{' '}
              <span className="bg-gradient-to-r from-[#FF6F61] via-[#6BA292] via-[#5B84B1] to-[#7A4DA4] bg-clip-text text-transparent">
                Flow
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tools designed to help you enter flow states, build meaningful habits,
              and align your life with the Four Pillars framework.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app, index) => (
              <AppCard key={app.id} app={app} index={index} />
            ))}
          </div>
        </div>
      </section>

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
              Start with any app that resonates with you. Each is designed to stand alone
              while working together as part of the FourFlowOS ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#0a0a0a] font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </Link>
              <Link
                href="/#framework"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-colors"
              >
                Learn the Framework
              </Link>
            </div>
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
