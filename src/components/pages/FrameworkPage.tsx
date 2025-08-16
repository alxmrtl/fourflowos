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
      <main className="max-w-6xl mx-auto px-2 py-4 h-screen flex flex-col">
        {/* Header Box */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-100 p-8 mb-6 text-center relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-8 h-8 border border-gray-300 rounded-full"></div>
            <div className="absolute top-8 right-6 w-4 h-4 border border-gray-300 rounded-full"></div>
            <div className="absolute bottom-6 left-8 w-6 h-6 border border-gray-300 rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-3 h-3 border border-gray-300 rounded-full"></div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2 relative z-10" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Find Your Flow
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto relative z-10 leading-relaxed">
            Stop forcing focus. Start aligning the four pieces that create it naturally.
          </p>
        </div>

        {/* Four Dimensions Grid */}
        <div className="flex-1 flex items-center">
          <div className="grid grid-cols-2 gap-4 w-full max-w-5xl mx-auto">
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
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 text-center group h-64 w-full flex flex-col justify-between"
                  style={{
                    borderLeft: `4px solid ${dimension.color}`,
                    borderTop: `1px solid ${dimension.color}20`,
                    borderRight: `1px solid ${dimension.color}20`,
                    borderBottom: `1px solid ${dimension.color}20`
                  }}
                >
                  {/* Dimension Icon */}
                  <div className="w-16 h-16 mx-auto relative flex-shrink-0">
                    <Image
                      src={dimension.sectionLogo}
                      alt={dimension.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  {/* 2-Word Descriptor */}
                  <p 
                    className="text-xs font-bold uppercase tracking-wider flex-shrink-0"
                    style={{ color: dimension.color }}
                  >
                    {descriptors[dimension.id as keyof typeof descriptors]}
                  </p>
                  
                  {/* Keys Row */}
                  <div className="flex justify-center gap-1 flex-shrink-0">
                    {dimension.keys.map((key) => (
                      <div 
                        key={key.id} 
                        className="w-5 h-5 relative opacity-60 group-hover:opacity-80 transition-opacity"
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