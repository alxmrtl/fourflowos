'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DIMENSIONS } from '@/data/framework';
import { DimensionType } from '@/types/framework';
import TopContextBar from '@/components/navigation/TopContextBar';
import MenuButton from '@/components/navigation/MenuButton';

interface DimensionPageProps {
  dimension: DimensionType;
}

export default function DimensionPage({ dimension }: DimensionPageProps) {
  const dimensionData = DIMENSIONS[dimension];
  
  if (!dimensionData) {
    return <div>Dimension not found</div>;
  }

  const getKeyPath = (keyId: string) => `/dimension/${dimension}/key/${keyId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back to Framework</span>
            </Link>
          </div>
          <MenuButton />
        </div>
      </header>

      <TopContextBar currentDimension={dimension} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Dimension Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto relative mb-4">
              <Image
                src={dimensionData.sectionLogo}
                alt={dimensionData.name}
                fill
                className="object-contain"
              />
            </div>
            <h1 
              className="text-4xl font-bold mb-4"
              style={{ color: dimensionData.color }}
            >
              {dimensionData.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {dimensionData.description}
            </p>
          </div>
        </div>

        {/* Keys Grid */}
        <div className="space-y-6">
          {dimensionData.keys.map((key, index) => (
            <div key={key.id} className="group">
              <Link 
                href={getKeyPath(key.id)}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-200 hover:border-gray-300"
              >
                <div className="flex items-start gap-6">
                  {/* Key Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 relative">
                      <Image
                        src={key.icon}
                        alt={key.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* Key Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span 
                        className="text-sm font-medium px-3 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${dimensionData.color}20`,
                          color: dimensionData.color 
                        }}
                      >
                        Key {index + 1}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                      {key.name}
                    </h2>
                    
                    <p className="text-gray-600 text-lg leading-relaxed mb-4">
                      {key.description}
                    </p>
                    
                    {/* Action Hint */}
                    <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-700 transition-colors">
                      <span className="text-sm">Explore Learn & Practice</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Master the {dimensionData.name} Dimension
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Dive deep into each key to develop a comprehensive understanding and practical mastery 
            of the {dimensionData.name.toLowerCase()} dimension of flow.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={getKeyPath(dimensionData.keys[0].id)}
              className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              style={{ backgroundColor: dimensionData.color }}
            >
              Start with {dimensionData.keys[0].name}
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Explore Other Dimensions
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}