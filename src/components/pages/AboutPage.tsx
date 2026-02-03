'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';

export default function AboutPage() {
  return (
    <PageLayout accentColor="#7A4DA4">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-8">
              About FourFlowOS
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            Hi, I&apos;m{' '}
            <span className="bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] bg-clip-text text-transparent">
              Alex
            </span>
          </motion.h1>
        </div>
      </section>

      {/* The Project Section */}
      <section className="relative py-16 md:py-24 bg-[#050505]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">The Project</h2>
              <div className="space-y-5 text-gray-300 leading-relaxed">
                <p>
                  FourFlowOS started as a side project that wouldn&apos;t leave me alone. For years I&apos;d been pulling threads from different places—psychology research, self-improvement books, contemplative traditions, flow science—and I kept noticing the same patterns showing up everywhere. Different words, same underlying structure.
                </p>
                <p>
                  I went deep on flow states specifically, including training with the Flow Research Collective, because flow seemed like the clearest signal that something was working. When you&apos;re in flow, you&apos;re not forcing it. You&apos;re aligned with something.
                </p>
                <p>
                  The meta-framework comes from Jamie Combs&apos; FourGames—a way of looking at life through four interconnected &quot;games&quot; that we&apos;re all playing: what&apos;s happening in your body and mind (Self), what environment surrounds you (Space), what larger story you&apos;re part of (Story), and what actually matters to you (Spirit). Each one has its own rules and dynamics. When I discovered it, flow fit perfectly into that lens. Get the four games working together and flow becomes less rare.
                </p>
                <p className="text-gray-400">
                  This is still a work in progress. I build it because I use it.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Let&apos;s Connect</h3>
              <p className="text-gray-400 mb-6">
                I&apos;m building this in public and sharing what I learn along the way.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] text-white font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                >
                  Get in Touch
                </Link>
                <Link
                  href="/framework"
                  className="px-6 py-3 border border-gray-600 text-gray-300 font-medium rounded-full hover:bg-white/5 hover:border-gray-400 transition-all duration-300"
                >
                  Explore the Framework
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
