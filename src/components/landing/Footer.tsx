'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const currentYear = new Date().getFullYear();

  return (
    <footer ref={ref} className="relative bg-[#050505] pt-20 pb-8 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-[#7A4DA4]/5 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Main footer content */}
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand column */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/assets/LOGOS/FOURFLOW - MAIN LOGO.png"
                  alt="FourFlowOS"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-white font-bold text-xl">
                FourFlow<span className="text-gray-500">OS</span>
              </span>
            </div>
            <p className="text-gray-500 max-w-md mb-6 leading-relaxed">
              The operating system for flow states. A framework and ecosystem of tools
              designed to help you achieve effortless focus through the alignment of
              Self, Space, Story, and Spirit.
            </p>
            <div className="flex items-center gap-2">
              {['#FF6F61', '#6BA292', '#5B84B1', '#7A4DA4'].map((color, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{ background: color }}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Links column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#framework" className="text-gray-500 hover:text-white transition-colors">
                  The Framework
                </Link>
              </li>
              <li>
                <Link href="#apps" className="text-gray-500 hover:text-white transition-colors">
                  Our Apps
                </Link>
              </li>
              <li>
                <Link href="/framework" className="text-gray-500 hover:text-white transition-colors">
                  Interactive Guide
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Legal column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@fourflow.app"
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} FourFlowOS. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm flex items-center gap-2">
            Made with
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              ❤️
            </motion.span>
            for flow seekers
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
