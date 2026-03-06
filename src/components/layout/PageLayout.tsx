'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import LandingNav from '@/components/landing/LandingNav';
import Footer from '@/components/landing/Footer';

interface PageLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  accentColor?: string;
}

/**
 * Shared page layout component that provides consistent dark theme
 * and design language across all inner pages (About, Blog, Framework, etc.)
 */
export default function PageLayout({
  children,
  showFooter = true,
  accentColor = '#6330A0'
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient orbs - very subtle */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.07]"
          style={{
            background: accentColor,
            left: '-10%',
            top: '10%',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.05]"
          style={{
            background: '#E84535',
            right: '-5%',
            bottom: '20%',
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Navigation */}
      <LandingNav />

      {/* Main content */}
      <main className="relative z-10 pt-24">
        {children}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
}
