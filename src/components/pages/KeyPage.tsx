'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { KEYS, DIMENSIONS } from '@/data/framework';
import { getLearnContent, getPracticeContent } from '@/data/content';
import { KeyType, DimensionType } from '@/types/framework';
import TopIconBar from '@/components/navigation/TopIconBar';
import MenuButton from '@/components/navigation/MenuButton';

interface KeyPageProps {
  keyId: KeyType;
  dimension: DimensionType;
}

export default function KeyPage({ keyId, dimension }: KeyPageProps) {
  const [activeTab, setActiveTab] = useState<'learn' | 'practice'>('learn');
  
  const keyData = KEYS[keyId];
  const dimensionData = DIMENSIONS[dimension];
  
  if (!keyData || !dimensionData) {
    return <div>Key not found</div>;
  }

  const learnContent = getLearnContent(dimension, keyId);
  const practiceContent = getPracticeContent(dimension, keyId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href={`/dimension/${dimension}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back to {dimensionData.name}</span>
            </Link>
          </div>
          <MenuButton />
        </div>
      </header>

      <TopIconBar currentDimension={dimension} currentKey={keyId} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Key Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto relative mb-4">
              <Image
                src={keyData.icon}
                alt={keyData.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span 
                className="text-sm font-medium px-3 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${dimensionData.color}20`,
                  color: dimensionData.color 
                }}
              >
                {dimensionData.name}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {keyData.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {keyData.description}
            </p>
          </div>
        </div>

        {/* Learn/Practice Toggle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('learn')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'learn'
                  ? 'text-gray-900 border-b-2 border-gray-900 bg-gray-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Learn
              </div>
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'practice'
                  ? 'text-gray-900 border-b-2 border-gray-900 bg-gray-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Practice
              </div>
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'learn' && (
              <div className="space-y-8">
                {learnContent.length > 0 ? (
                  learnContent.map((item) => (
                    <article key={item.id} className="prose prose-lg max-w-none">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-lg text-gray-600 mb-6 font-medium">
                        {item.description}
                      </p>
                      <div 
                        className="text-gray-700 leading-relaxed"
                        style={{ whiteSpace: 'pre-line' }}
                      >
                        {item.content}
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-200">
                        {item.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No learning content yet</h3>
                    <p className="text-gray-600">Learning materials for this key will be added soon.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'practice' && (
              <div className="space-y-8">
                {practiceContent.length > 0 ? (
                  practiceContent.map((item) => (
                    <article key={item.id} className="prose prose-lg max-w-none">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-lg text-gray-600 mb-6 font-medium">
                        {item.description}
                      </p>
                      <div 
                        className="text-gray-700 leading-relaxed"
                        style={{ whiteSpace: 'pre-line' }}
                      >
                        {item.content}
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-200">
                        {item.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No practice content yet</h3>
                    <p className="text-gray-600">Practice exercises for this key will be added soon.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <Link
            href={`/dimension/${dimension}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>All {dimensionData.name} Keys</span>
          </Link>
          
          <Link
            href="/"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Explore Framework
          </Link>
        </div>
      </main>
    </div>
  );
}