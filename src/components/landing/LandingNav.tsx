'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBarUserButton from '@/components/navigation/TopBarUserButton';
import { useAuth } from '@/hooks/useAuth';

const pillarColors = ['#FF6F61', '#6BA292', '#5B84B1', '#7A4DA4'];

export default function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileSignOut = async () => {
    setIsMobileMenuOpen(false);
    await signOut();
    router.push('/');
  };

  // Signal link: signed-in users go to their profile hub; others go to intake
  const signalLink = user
    ? { href: '/me', label: 'Your Archetype' }
    : { href: '/map', label: 'Discover Your Archetype' };

  const mainNavLinks = [
    { ...signalLink, featured: true },
    { href: '/framework', label: 'How It Works' },
    { href: '/apps', label: 'Practice' },
    { href: '/together', label: 'Work Together' },
  ];

  const legalLinks = [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
    { href: '/support', label: 'Support' },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-3' : 'py-5'
        }`}
      >
        {/* Background */}
        <motion.div
          className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5"
          style={{ opacity: backgroundOpacity }}
        />

        <div className="relative max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image
                src="/assets/LOGOS/FOURFLOW - MAIN LOGO.png"
                alt="FourFlowOS"
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">
              FourFlow<span className="text-gray-400">OS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {mainNavLinks.map((link, index) =>
              (link as { featured?: boolean }).featured ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-1.5 text-white text-sm font-medium rounded-full border border-[#FF6F61]/35 bg-gradient-to-r from-[#FF6F61]/[0.08] to-[#7A4DA4]/[0.08] hover:from-[#FF6F61]/15 hover:to-[#7A4DA4]/15 hover:border-[#FF6F61]/55 transition-all duration-300 shadow-[0_0_14px_rgba(255,111,97,0.10)] hover:shadow-[0_0_22px_rgba(255,111,97,0.25)]"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-gray-400 hover:text-white transition-colors duration-300 text-sm font-medium group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {link.label}
                  <motion.span
                    className="absolute bottom-0 left-1/2 h-0.5 rounded-full"
                    style={{
                      backgroundColor: pillarColors[index % pillarColors.length],
                      originX: 0.5,
                    }}
                    initial={{ width: 0, x: '-50%' }}
                    animate={{
                      width: hoveredIndex === index ? '60%' : 0,
                      x: '-50%',
                    }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  />
                </Link>
              )
            )}
          </div>

          {/* Desktop: profile icon dropdown */}
          <div className="hidden lg:flex items-center gap-3">
            <TopBarUserButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden relative w-10 h-10 flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="relative w-6 h-5">
              <motion.span
                className="absolute left-0 w-full h-0.5 bg-white rounded-full"
                animate={{
                  top: isMobileMenuOpen ? '50%' : '0%',
                  rotate: isMobileMenuOpen ? 45 : 0,
                  translateY: isMobileMenuOpen ? '-50%' : 0,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 top-1/2 w-full h-0.5 bg-white rounded-full -translate-y-1/2"
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 w-full h-0.5 bg-white rounded-full"
                animate={{
                  bottom: isMobileMenuOpen ? '50%' : '0%',
                  rotate: isMobileMenuOpen ? -45 : 0,
                  translateY: isMobileMenuOpen ? '50%' : 0,
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        className="fixed inset-0 z-40 lg:hidden"
        initial={{ opacity: 0, pointerEvents: 'none' }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
        }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <motion.div
          className="absolute top-20 left-4 right-4 bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[calc(100vh-120px)] overflow-y-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: isMobileMenuOpen ? 0 : -20,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex flex-col gap-1">
            {/* Main Navigation */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
              Navigate
            </p>
            {mainNavLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : -10 }}
                transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
              >
                <Link
                  href={link.href}
                  className="flex items-center text-white hover:text-gray-300 transition-colors text-lg font-medium py-3 px-2 rounded-lg hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span
                    className="w-1 h-1 rounded-full mr-3"
                    style={{ backgroundColor: pillarColors[index % pillarColors.length] }}
                  />
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* Legal Links */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
                Legal & Support
              </p>
              {legalLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : -10 }}
                  transition={{ duration: 0.2, delay: 0.25 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block text-gray-400 hover:text-white transition-colors text-base py-2 px-2 rounded-lg hover:bg-white/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Account section */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-1">
              {user ? (
                <>
                  {user.email && (
                    <p className="text-xs text-gray-500 px-2 pb-1 truncate">{user.email}</p>
                  )}
                  <button
                    onClick={handleMobileSignOut}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-base py-2 px-2 rounded-lg hover:bg-white/5 w-full text-left"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/me"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-base py-2 px-2 rounded-lg hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Sign In
                </Link>
              )}
            </div>

            {/* CTA Button — only for signed-out users */}
            {!user && (
              <div className="mt-2">
                <Link
                  href="/map"
                  className="block w-full text-center px-5 py-3 bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Discover Your Archetype
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
