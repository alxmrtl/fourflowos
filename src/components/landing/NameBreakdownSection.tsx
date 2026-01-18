'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

const nameBreakdown = [
  {
    word: 'FOUR',
    meaning: 'dimensions of life tuned to generate',
    connector: '...',
    color: '#FF6F61',
  },
  {
    word: 'FLOW',
    meaning: '— effortless action, peak engagement — through your own',
    connector: '...',
    color: '#6BA292',
  },
  {
    word: 'OS',
    meaning: '— an operating system for how you live.',
    connector: '',
    color: '#7A4DA4',
  },
];

const shapeImages = [
  { src: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SELF - Frequencies.png', color: '#FF6F61' },
  { src: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPACE - Sqaure.png', color: '#6BA292' },
  { src: '/assets/LOGOS/MAIN LOGO - ELEMENTS/STORY - Cross.png', color: '#5B84B1' },
  { src: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPIRIT - Circle.png', color: '#7A4DA4' },
];

export default function NameBreakdownSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 bg-[#0a0a0a] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, #FF6F61 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, #7A4DA4 0%, transparent 40%)
            `,
          }}
        />
      </div>

      <motion.div
        className="relative max-w-4xl mx-auto px-6"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.5,
              staggerChildren: 0.15,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {/* Section intro */}
        <motion.div
          className="text-center mb-16"
          variants={{
            hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.7, ease: 'easeOut' },
            },
          }}
        >
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-4">Introducing</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            <span className="bg-gradient-to-r from-[#FF6F61] via-[#6BA292] via-[#5B84B1] to-[#7A4DA4] bg-clip-text text-transparent">
              FourFlowOS
            </span>
          </h2>
        </motion.div>

        {/* The three words */}
        <div className="space-y-12 md:space-y-16">
          {nameBreakdown.map((item, index) => (
            <motion.div
              key={item.word}
              className="relative"
              variants={{
                hidden: { opacity: 0, x: index % 2 === 0 ? -50 : 50, filter: 'blur(8px)' },
                visible: {
                  opacity: 1,
                  x: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.8, ease: 'easeOut' },
                },
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                {/* The word */}
                <motion.div
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span
                    className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                    style={{ color: item.color }}
                  >
                    {item.word}
                  </span>
                </motion.div>

                {/* The meaning */}
                <div className="flex-1">
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                    {item.meaning}
                    {item.connector && (
                      <span className="text-gray-500 ml-1">{item.connector}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Decorative line */}
              {index < nameBreakdown.length - 1 && (
                <motion.div
                  className="mt-12 md:mt-16 h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${item.color}30, transparent)`,
                  }}
                  variants={{
                    hidden: { scaleX: 0 },
                    visible: { scaleX: 1, transition: { duration: 0.8, delay: 0.3 } },
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Four shapes merging visual */}
        <motion.div
          className="mt-16 md:mt-20 flex justify-center"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: 'easeOut', delay: 0.5 },
            },
          }}
        >
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            {/* Four shapes that animate toward center */}
            {shapeImages.map((shape, index) => (
              <motion.div
                key={index}
                className="absolute w-10 h-10 md:w-12 md:h-12"
                style={{
                  top: '50%',
                  left: '50%',
                }}
                initial={{
                  x: `${(index === 0 || index === 3 ? -1 : 1) * 60}%`,
                  y: `${(index < 2 ? -1 : 1) * 60}%`,
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={isInView ? {
                  x: '-50%',
                  y: '-50%',
                  opacity: 0.8,
                  scale: 1,
                } : {
                  x: `${(index === 0 || index === 3 ? -1 : 1) * 60}%`,
                  y: `${(index < 2 ? -1 : 1) * 60}%`,
                  opacity: 0,
                  scale: 0.5,
                }}
                transition={{
                  duration: 1.2,
                  delay: 0.8 + index * 0.15,
                  ease: 'easeOut',
                }}
              >
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-40"
                  style={{ background: shape.color }}
                />
                <Image
                  src={shape.src}
                  alt=""
                  fill
                  className="object-contain"
                />
              </motion.div>
            ))}

            {/* Center logo that fades in */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 1.8, ease: 'easeOut' }}
            >
              <Image
                src="/assets/LOGOS/FOURFLOW - MAIN LOGO.png"
                alt="FourFlowOS"
                fill
                className="object-contain"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Closing statement */}
        <motion.div
          className="mt-12 text-center space-y-2"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: 'easeOut', delay: 0.6 },
            },
          }}
        >
          <p className="text-lg text-gray-400">
            Not another app. <span className="text-white">A way of seeing.</span>
          </p>
          <p className="text-lg text-gray-400">
            Not a hack. <span className="text-white">An alignment practice.</span>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
