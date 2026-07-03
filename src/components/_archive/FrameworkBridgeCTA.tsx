'use client';

// Archived July 2026: the three-card bridge menu that closed the /framework page
// ("Train it / Interpret it / Map your signal"). Removed in the content cleanup —
// kept as an asset. Note "/apps" now redirects to /framework and "Map your signal"
// is retired vocabulary; refresh copy + targets before reviving.

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FrameworkBridgeCTA() {
  return (
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
              className="group relative rounded-2xl border border-white/10 p-6 hover:border-spirit/40 hover:bg-spirit/[0.05] transition-all duration-300"
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
  );
}
