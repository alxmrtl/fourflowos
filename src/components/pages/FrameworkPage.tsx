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
        {/* Compact Hero Section - 1/5 of space */}
        <div className="text-center mb-4 flex-shrink-0" style={{ height: '20%' }}>
          <div className="relative mb-3">
            <div className="w-16 h-16 mx-auto relative">
              <Image
                src={BG_CIRCLE}
                alt="Background"
                fill
                className="object-contain opacity-20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 relative">
                  <Image
                    src={MAIN_LOGO}
                    alt="FourFlowOS"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Discover Your Flow
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            A holistic framework for achieving flow states through the systematic integration of 
            Self, Space, Story, and Spirit dimensions.
          </p>
        </div>

        {/* Four Dimensions Grid - Takes up 4/5 of remaining space */}
        <div className="flex-1 flex items-center">
          <div className="grid grid-cols-2 gap-4 w-full max-w-5xl mx-auto">
            {Object.values(DIMENSIONS).map((dimension) => (
              <Link 
                key={dimension.id}
                href={getDimensionPath(dimension.id)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-gray-200 hover:border-gray-300 text-center group aspect-square flex flex-col justify-center"
              >
                {/* Dimension Icon */}
                <div className="w-16 h-16 mx-auto mb-3 relative">
                  <Image
                    src={dimension.sectionLogo}
                    alt={dimension.name}
                    fill
                    className="object-contain"
                  />
                </div>
                
                {/* Dimension Name */}
                <h3 
                  className="text-lg font-bold mb-2"
                  style={{ color: dimension.color }}
                >
                  {dimension.name}
                </h3>
                
                {/* Keys Row */}
                <div className="flex justify-center gap-1 mb-2">
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
                
                {/* Short Description */}
                <p className="text-xs text-gray-600 line-clamp-2">
                  {dimension.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}