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
    <footer ref={ref} className="relative bg-ground-deep pt-20 pb-8 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-spirit/5 to-transparent rounded-full blur-3xl" />

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
              The operating system for flow. Flow isn&apos;t forced — it&apos;s cultivated,
              and the conditions are trainable. One framework, four dimensions:
              Self, Space, Story, and Spirit.
            </p>
            <div className="flex items-center gap-2">
              {['#E84535', '#4E8C73', '#3E6FA3', '#6330A0'].map((color, i) => (
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
                <Link href="/map" className="text-gray-500 hover:text-white transition-colors">
                  Your Flow Profile
                </Link>
              </li>
              <li>
                <Link href="/framework" className="text-gray-500 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/apps" className="text-gray-500 hover:text-white transition-colors">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/together" className="text-gray-500 hover:text-white transition-colors">
                  Work Together
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-500 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 hover:text-white transition-colors">
                  About
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
                  href="mailto:fourflowos@gmail.com"
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
            Made for those who seek flow
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
