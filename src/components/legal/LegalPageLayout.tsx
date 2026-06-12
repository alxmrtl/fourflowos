'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { GRADIENTS } from '@/styles/brand-colors';
import { ReactNode } from 'react';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export default function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-ground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 bg-ground/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image
                src="/assets/LOGOS/FOURFLOW - MAIN LOGO.png"
                alt="FourFlowOS"
                fill
                className="object-contain group-hover:scale-110 transition-transform"
              />
            </div>
            <span className="text-white font-bold text-lg">
              FourFlow<span className="text-gray-400">OS</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
            <p className="text-gray-400">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Policy content */}
          <div className="prose prose-invert prose-lg max-w-none">
            {children}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-4xl mx-auto px-6">
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
              <Link href="/eula" className="text-gray-500 hover:text-white transition-colors">
                EULA
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Reusable section component
export function LegalSection({
  number,
  title,
  children
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: GRADIENTS.primaryCta }}>
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

// Info box component
export function InfoBox({
  variant = 'default',
  title,
  children
}: {
  variant?: 'default' | 'success' | 'warning';
  title?: string;
  children: ReactNode;
}) {
  const variants = {
    default: 'bg-white/5 border-white/10',
    success: 'bg-green-500/10 border-green-500/20',
    warning: 'bg-yellow-500/10 border-yellow-500/20',
  };

  return (
    <div className={`p-6 border rounded-xl ${variants[variant]}`}>
      {title && <h3 className="text-white font-semibold mb-3">{title}</h3>}
      <div className="text-gray-400">{children}</div>
    </div>
  );
}
