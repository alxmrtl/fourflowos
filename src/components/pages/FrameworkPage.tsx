'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DIMENSIONS, MAIN_LOGO, BG_CIRCLE } from '@/data/framework';
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Find Your Flow
          </h2>
          <p className="text-base text-gray-700 max-w-2xl mx-auto">
            Most people struggle with focus and motivation because they're missing key pieces. Get all four dimensions working for you.
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
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 text-center group aspect-square flex flex-col justify-center"
                  style={{
                    borderLeft: `4px solid ${dimension.color}`,
                    borderTop: `1px solid ${dimension.color}20`,
                    borderRight: `1px solid ${dimension.color}20`,
                    borderBottom: `1px solid ${dimension.color}20`
                  }}
                >
                  {/* Dimension Icon */}
                  <div className="w-20 h-20 mx-auto mb-4 relative">
                    <Image
                      src={dimension.sectionLogo}
                      alt={dimension.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  {/* Keys Row */}
                  <div className="flex justify-center gap-1 mb-4">
                    {dimension.keys.map((key) => (
                      <div 
                        key={key.id} 
                        className="w-6 h-6 relative opacity-60 group-hover:opacity-80 transition-opacity"
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
                  
                  {/* 2-Word Descriptor */}
                  <p 
                    className="text-lg font-semibold"
                    style={{ color: dimension.color }}
                  >
                    {descriptors[dimension.id as keyof typeof descriptors]}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}