'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DIMENSIONS, MAIN_LOGO, BG_CIRCLE } from '@/data/framework';
import { DimensionType } from '@/types/framework';
import TopIconBar from '@/components/navigation/TopIconBar';
import MenuButton from '@/components/navigation/MenuButton';

export default function FrameworkPage() {
  const getDimensionPath = (dimension: DimensionType) => `/dimension/${dimension}`;
  const getKeyPath = (keyId: string, dimension: DimensionType) => `/dimension/${dimension}/key/${keyId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 relative">
              <Image
                src={MAIN_LOGO}
                alt="FourFlowOS"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FourFlowOS</h1>
              <p className="text-sm text-gray-600">Awakening millions through flow</p>
            </div>
          </div>
          <MenuButton />
        </div>
      </header>

      <TopIconBar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative mb-6">
            <div className="w-32 h-32 mx-auto relative">
              <Image
                src={BG_CIRCLE}
                alt="Background"
                fill
                className="object-contain opacity-20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 relative">
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
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Flow
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A holistic framework for achieving flow states through the systematic integration of 
            Self, Space, Story, and Spirit dimensions.
          </p>
        </div>

        {/* Four Dimensions Grid - Compact Layout */}
        <div className="grid grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {Object.values(DIMENSIONS).map((dimension) => (
            <Link 
              key={dimension.id}
              href={getDimensionPath(dimension.id)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-200 hover:border-gray-300 text-center group"
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
              
              {/* Dimension Name */}
              <h3 
                className="text-xl font-bold mb-2"
                style={{ color: dimension.color }}
              >
                {dimension.name}
              </h3>
              
              {/* Keys Row */}
              <div className="flex justify-center gap-2 mb-3">
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
              
              {/* Short Description */}
              <p className="text-sm text-gray-600 line-clamp-2">
                {dimension.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Start Your Flow Journey
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Transform from overwhelm to clarity, apathy to engagement, through a systematic approach 
            to flow states across all four dimensions of life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/dimension/self"
              className="px-6 py-3 bg-[#FF6F61] text-white rounded-lg hover:bg-[#E64A45] transition-colors font-medium"
            >
              Explore SELF
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}