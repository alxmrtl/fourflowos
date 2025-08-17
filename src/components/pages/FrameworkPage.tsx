'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DIMENSIONS } from '@/data/framework';
import { DimensionType } from '@/types/framework';
import TopBar from '@/components/navigation/TopBar';
import TouchRipple from '@/components/TouchRipple';

export default function FrameworkPage() {
  const getDimensionPath = (dimension: DimensionType) => `/dimension/${dimension}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <TopBar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-2 lg:py-4 h-screen flex flex-col">
        {/* Header Box */}
        <motion.div 
          className="bg-[#333333] rounded-xl shadow-md p-6 lg:p-8 mb-4 lg:mb-6 text-left flex items-center"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Find Your Flow
            </h2>
            <p className="text-sm lg:text-base text-gray-200 leading-relaxed max-w-xl">
              Stop forcing focus. Start aligning the four pieces that create it naturally.
            </p>
          </div>
        </motion.div>

        {/* Four Dimensions Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 lg:gap-6 w-full">
            {Object.values(DIMENSIONS).map((dimension, index) => {
              const descriptors = {
                self: 'Inner Mastery',
                space: 'Environment Design', 
                story: 'Direction Setting',
                spirit: 'Inner Drive'
              };
              
              return (
                <motion.div
                  key={dimension.id}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: index * 0.05,
                    ease: 'easeOut'
                  }}
                >
                  <TouchRipple 
                    color={`${dimension.color}40`}
                    className="rounded-lg"
                  >
                    <Link 
                      href={getDimensionPath(dimension.id)}
                      className="bg-white rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] active:shadow-md transition-all duration-200 p-4 lg:p-6 group h-36 lg:h-48 w-full touch-manipulation transform hover:-translate-y-1 block"
                      style={{
                        borderLeft: `4px solid ${dimension.color}`,
                        borderTop: `1px solid ${dimension.color}20`,
                        borderRight: `1px solid ${dimension.color}20`,
                        borderBottom: `1px solid ${dimension.color}20`
                      }}
                    >
                  {/* Top Section: Logo and Descriptor */}
                  <div className="flex items-center gap-3 lg:gap-4 mb-3 lg:mb-4">
                    {/* Dimension Icon - Top Left */}
                    <div className="w-12 h-12 lg:w-16 lg:h-16 relative flex-shrink-0">
                      <Image
                        src={dimension.sectionLogo}
                        alt={dimension.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    {/* 2-Word Descriptor - To the right of logo */}
                    <p 
                      className="text-xs lg:text-sm font-bold uppercase tracking-wider"
                      style={{ color: dimension.color }}
                    >
                      {descriptors[dimension.id as keyof typeof descriptors]}
                    </p>
                  </div>
                  
                  {/* Bottom Section: Keys Row spanning full width */}
                  <div className="flex justify-between">
                    {dimension.keys.map((key) => (
                      <div 
                        key={key.id} 
                        className="w-8 h-8 lg:w-10 lg:h-10 relative opacity-60 group-hover:opacity-80 transition-opacity"
                        title={key.name}
                      >
                        <Image
                          src={key.icon}
                          alt={key.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>
                    </Link>
                  </TouchRipple>
                </motion.div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}