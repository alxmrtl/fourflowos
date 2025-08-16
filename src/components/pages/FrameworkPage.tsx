'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DIMENSIONS, MAIN_LOGO, BG_CIRCLE } from '@/data/framework';
import { DimensionType } from '@/types/framework';
import TopContextBar from '@/components/navigation/TopContextBar';
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

      <TopContextBar />

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

        {/* Four Dimensions Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {Object.values(DIMENSIONS).map((dimension) => (
            <div key={dimension.id} className="group">
              <Link 
                href={getDimensionPath(dimension.id)}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-200 hover:border-gray-300"
              >
                {/* Dimension Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 relative">
                    <Image
                      src={dimension.sectionLogo}
                      alt={dimension.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 
                      className="text-2xl font-bold mb-1"
                      style={{ color: dimension.color }}
                    >
                      {dimension.name}
                    </h3>
                    <p className="text-gray-600">{dimension.description}</p>
                  </div>
                </div>

                {/* Keys */}
                <div className="space-y-2">
                  {dimension.keys.map((key) => (
                    <Link
                      key={key.id}
                      href={getKeyPath(key.id, dimension.id)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-8 h-8 relative">
                        <Image
                          src={key.icon}
                          alt={key.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{key.name}</h4>
                        <p className="text-sm text-gray-600">{key.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Link>
            </div>
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