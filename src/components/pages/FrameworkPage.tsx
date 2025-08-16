'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DIMENSIONS } from '@/data/framework';
import { DimensionType } from '@/types/framework';
import TopBar from '@/components/navigation/TopBar';

export default function FrameworkPage() {
  const getDimensionPath = (dimension: DimensionType) => `/dimension/${dimension}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <TopBar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-2 h-screen flex flex-col">
        {/* Header Box */}
        <div className="bg-[#333333] rounded-xl shadow-md p-6 mb-4 text-left flex items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Find Your Flow
            </h2>
            <p className="text-sm text-gray-200 leading-relaxed max-w-xl">
              Stop forcing focus. Start aligning the four pieces that create it naturally.
            </p>
          </div>
        </div>

        {/* Four Dimensions Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 w-full">
            {Object.values(DIMENSIONS).map((dimension) => {
              const descriptors = {
                self: 'Inner Mastery',
                space: 'Environment Design', 
                story: 'Direction Setting',
                spirit: 'Inner Drive'
              };
              
              return (
                <Link 
                  key={dimension.id}
                  href={getDimensionPath(dimension.id)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 group h-36 w-full"
                  style={{
                    borderLeft: `4px solid ${dimension.color}`,
                    borderTop: `1px solid ${dimension.color}20`,
                    borderRight: `1px solid ${dimension.color}20`,
                    borderBottom: `1px solid ${dimension.color}20`
                  }}
                >
                  {/* Top Section: Logo and Descriptor */}
                  <div className="flex items-center gap-3 mb-3">
                    {/* Dimension Icon - Top Left */}
                    <div className="w-12 h-12 relative flex-shrink-0">
                      <Image
                        src={dimension.sectionLogo}
                        alt={dimension.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    {/* 2-Word Descriptor - To the right of logo */}
                    <p 
                      className="text-xs font-bold uppercase tracking-wider"
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
                        className="w-8 h-8 relative opacity-60 group-hover:opacity-80 transition-opacity"
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
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}