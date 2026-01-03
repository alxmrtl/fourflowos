'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import PageLayout from '@/components/layout/PageLayout';

export default function AboutPage() {
  const contentRef = useRef(null);
  const contentInView = useInView(contentRef, { once: true, margin: '-100px' });

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
              The Human Behind the Framework
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
              Matt
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Flow researcher, creator, and someone who spent years figuring out how to stop fighting
            myself and start working with my own nature.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section ref={contentRef} className="relative py-16 md:py-24 bg-[#050505]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 40 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-gray-300 text-lg leading-relaxed">
                I built FourFlowOS because I was tired of productivity systems that treated me like a machine.
                The timers, the trackers, the guilt-laden todo apps&mdash;none of them worked because they
                missed the point entirely.
              </p>

              <p className="text-gray-400 leading-relaxed">
                Flow isn&apos;t about forcing yourself to focus. It&apos;s about creating conditions where focus
                happens naturally. That insight changed everything for me, and I wanted to build something
                that reflected it.
              </p>

              <p className="text-gray-400 leading-relaxed">
                This framework draws from years of exploring what actually works&mdash;from consciousness research
                to peak performance science to ancient wisdom traditions. Not because any of them have all the
                answers, but because together they point toward something true about how we&apos;re wired.
              </p>

              <p className="text-gray-400 leading-relaxed">
                I&apos;m still learning. Still experimenting. Still refining how the four dimensions interact
                and support each other. If any of this resonates with you, I&apos;d love to hear about your own
                journey toward flow.
              </p>
            </div>

            {/* Connect Section */}
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
