'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useAudience, AudienceType } from '@/context/AudienceContext';

const audienceOptions = [
  {
    id: 'individual' as const,
    title: 'Master your own flow',
    subtitle: 'A personal practice',
    description: 'For creators, professionals, builders, and anyone who wants to do their best work',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    gradient: 'from-[#FF6F61] to-[#7A4DA4]',
  },
  {
    id: 'leader' as const,
    title: 'Cultivate flow in others',
    subtitle: 'A leadership framework',
    description: 'For managers, coaches, founders, and those who help others thrive',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    gradient: 'from-[#6BA292] to-[#5B84B1]',
  },
];

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.15 });
  const { audience, setAudience, hasSelected } = useAudience();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAudienceSelect = (id: AudienceType) => {
    setAudience(id);
    // Auto-scroll to next section after a brief delay for the animation
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }, 600);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Subtle mandala background - very slow rotation */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        <div className="relative w-[150vmax] h-[150vmax] opacity-[0.03]">
          <Image
            src="/assets/mandalas/White Outline/Simple-WhiteOutline.png"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
      </motion.div>

      {/* Animated gradient background - slower, more meditative */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-25"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, #FF6F61 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, #6BA292 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, #5B84B1 0%, transparent 50%)',
              'radial-gradient(circle at 20% 80%, #7A4DA4 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, #FF6F61 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating orbs - slower, breathing rhythm */}
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: '#FF6F61' }}
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-0 top-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: '#7A4DA4' }}
          animate={{
            x: [0, -60, 0],
            y: [0, 50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/4 bottom-0 w-72 h-72 rounded-full blur-3xl opacity-12"
          style={{ background: '#6BA292' }}
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Fourth orb for Story pillar */}
        <motion.div
          className="absolute right-1/4 bottom-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ background: '#5B84B1' }}
          animate={{
            x: [0, -30, 0],
            y: [0, 35, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.6,
              staggerChildren: 0.15,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {/* Animated logo */}
        <motion.div
          className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6"
          style={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          variants={{
            hidden: { scale: 0, rotate: -180, opacity: 0 },
            visible: {
              scale: 1,
              rotate: 0,
              opacity: 1,
              transition: {
                type: 'spring',
                stiffness: 80,
                damping: 15,
                duration: 1.2,
              },
            },
          }}
        >
          {/* Outer breathing glow */}
          <motion.div
            className="absolute -inset-4 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(122, 77, 164, 0.4) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Glowing ring behind logo - slower rotation with breathing */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, #FF6F61, #6BA292, #5B84B1, #7A4DA4, #FF6F61)',
              filter: 'blur(20px)',
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
              scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            }}
          />

          {/* Logo image */}
          <div className="absolute inset-1 rounded-full overflow-hidden bg-[#0a0a0a]">
            <Image
              src="/assets/LOGOS/FOURFLOW - MAIN LOGO.png"
              alt="FourFlowOS"
              fill
              className="object-contain p-2"
              priority
            />
          </div>
        </motion.div>

        {/* Main headline - user-focused */}
        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
          variants={{
            hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.8, ease: 'easeOut' },
            },
          }}
        >
          Flow isn&apos;t forced.{' '}
          <span className="bg-gradient-to-r from-[#FF6F61] via-[#6BA292] via-[#5B84B1] to-[#7A4DA4] bg-clip-text text-transparent">
            It&apos;s cultivated.
          </span>
        </motion.h1>

        {/* Sub-tagline */}
        <motion.p
          className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-10"
          variants={{
            hidden: { opacity: 0, y: 25, filter: 'blur(6px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.7, ease: 'easeOut' },
            },
          }}
        >
          Align the four dimensions that create effortless focus and meaningful engagement.
        </motion.p>

        {/* Choice Prompt */}
        <motion.p
          className="text-gray-400 text-lg mb-3"
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: 'easeOut' },
            },
          }}
        >
          Which describes you?
        </motion.p>

        {/* Audience Selection Cards */}
        <motion.div
          className="flex flex-col sm:flex-row gap-5 justify-center max-w-4xl mx-auto"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: 'easeOut' },
            },
          }}
        >
          {audienceOptions.map((option) => {
            const isSelected = audience === option.id;
            const isOtherSelected = hasSelected && !isSelected;

            return (
              <motion.button
                key={option.id}
                onClick={() => handleAudienceSelect(option.id)}
                className="relative flex-1 group"
                animate={{
                  opacity: isOtherSelected ? 0.25 : 1,
                  scale: isOtherSelected ? 0.95 : 1,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                whileHover={!hasSelected ? { scale: 1.03 } : {}}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated gradient border */}
                <motion.div
                  className={`absolute -inset-[2px] rounded-3xl bg-gradient-to-r ${option.gradient} opacity-0 blur-sm`}
                  animate={{
                    opacity: isSelected ? 0.8 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className={`absolute -inset-[1px] rounded-3xl bg-gradient-to-r ${option.gradient}`}
                  animate={{
                    opacity: isSelected ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Card content */}
                <div
                  className={`
                    relative p-8 md:p-10 rounded-3xl text-left transition-all duration-300
                    ${isSelected
                      ? 'bg-[#0a0a0a]'
                      : 'bg-white/[0.03] border border-white/10 group-hover:bg-white/[0.06] group-hover:border-white/20'
                    }
                  `}
                >
                  {/* Selected checkmark */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-r ${option.gradient} flex items-center justify-center`}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Icon */}
                  <motion.div
                    className={`mb-5 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}
                    animate={{ scale: isSelected ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {option.icon}
                  </motion.div>

                  {/* Subtitle */}
                  <p className={`text-xs uppercase tracking-widest mb-2 ${isSelected ? 'text-gray-400' : 'text-gray-600'}`}>
                    {option.subtitle}
                  </p>

                  {/* Title */}
                  <h3 className={`text-xl md:text-2xl font-semibold mb-3 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                    {option.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm md:text-base leading-relaxed ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                    {option.description}
                  </p>

                  {/* CTA indicator */}
                  <motion.div
                    className={`mt-6 flex items-center gap-2 text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'}`}
                    animate={{ x: isSelected ? 0 : 0 }}
                  >
                    <span>{isSelected ? 'Continue below' : 'Choose this path'}</span>
                    <motion.svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{
                        rotate: isSelected ? 90 : 0,
                        x: isSelected ? 0 : [0, 4, 0],
                      }}
                      transition={{
                        rotate: { duration: 0.3 },
                        x: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

      </motion.div>
    </section>
  );
}
