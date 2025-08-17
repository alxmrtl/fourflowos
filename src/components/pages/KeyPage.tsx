'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { KEYS, DIMENSIONS } from '@/data/framework';
import { getLearnContent, getPracticeContent } from '@/data/content';
import { KeyType, DimensionType } from '@/types/framework';
import TopBar from '@/components/navigation/TopBar';

interface KeyPageProps {
  keyId: KeyType;
  dimension: DimensionType;
}

const getKeyDisplayInfo = (keyId: string) => {
  const keyInfo: Record<string, { name: string; description: string; keyNumber: number }> = {
    'tuned-emotions': { 
      name: 'Tuned Emotions', 
      description: 'Use your feelings as signals to stay in the sweet spot between bored and overwhelmed.',
      keyNumber: 1
    },
    'open-mind': { 
      name: 'Open Mind', 
      description: 'Clear mental clutter and stay flexible so new ideas can flow naturally.',
      keyNumber: 2
    },
    'focused-body': { 
      name: 'Focused Body', 
      description: 'Get out of your head and into your body to stop overthinking and stay present.',
      keyNumber: 3
    },
    'intentional-space': { 
      name: 'Intentional Space', 
      description: 'Set up your environment to automatically put you in focus mode without willpower.',
      keyNumber: 4
    },
    'optimized-tools': { 
      name: 'Optimized Tools', 
      description: 'Use the right systems and tech to get more done with less effort.',
      keyNumber: 5
    },
    'feedback-systems': { 
      name: 'Feedback Systems', 
      description: 'Build quick ways to know if you\'re on track and course-correct fast.',
      keyNumber: 6
    },
    'generative-story': { 
      name: 'Generative Story', 
      description: 'Create a personal narrative that makes challenges feel like adventure, not problems.',
      keyNumber: 7
    },
    'worthy-mission': { 
      name: 'Worthy Mission', 
      description: 'Connect your daily work to something bigger that naturally motivates you.',
      keyNumber: 8
    },
    'empowered-role': { 
      name: 'Empowered Role', 
      description: 'Know what you own and why it matters so you can work with real purpose.',
      keyNumber: 9
    },
    'grounding-values': { 
      name: 'Grounding Values', 
      description: 'Know what you stand for so decisions become obvious and doubt disappears.',
      keyNumber: 10
    },
    'visualized-vision': { 
      name: 'Visualized Vision', 
      description: 'See your future clearly so your brain starts noticing the right opportunities.',
      keyNumber: 11
    },
    'ignited-curiosity': { 
      name: 'Ignited Curiosity', 
      description: 'Stay genuinely interested in your work so focus happens without forcing it.',
      keyNumber: 12
    }
  };
  return keyInfo[keyId] || { name: keyId, description: 'Flow key description', keyNumber: 0 };
};

export default function KeyPage({ keyId, dimension }: KeyPageProps) {
  const [activeTab, setActiveTab] = useState<'learn' | 'practice'>('learn');
  
  const keyData = KEYS[keyId];
  const dimensionData = DIMENSIONS[dimension];
  const keyInfo = getKeyDisplayInfo(keyId);
  
  if (!keyData || !dimensionData) {
    return <div>Key not found</div>;
  }

  const learnContent = getLearnContent(dimension, keyId);
  const practiceContent = getPracticeContent(dimension, keyId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <TopBar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-2 py-4">
        {/* Key Info Box */}
        <div 
          className="rounded-lg shadow-sm p-3 mb-3 h-32"
          style={{ backgroundColor: dimensionData.color }}
        >
          <div className="flex items-center gap-3 h-full">
            <div className="w-12 h-12 relative flex-shrink-0">
              <Image
                src={keyData.icon}
                alt={keyData.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider mb-1 text-white">
                FLOW KEY #{keyInfo.keyNumber}
              </p>
              <h1 className="text-xl font-bold text-white mb-1">
                {keyInfo.name}
              </h1>
              <p className="text-xs leading-relaxed text-white">
                {keyInfo.description}
              </p>
            </div>
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

          {/* Content List */}
          <div className="p-6">
            {activeTab === 'learn' && (
              <div className="space-y-2">
                {learnContent.length > 0 ? (
                  learnContent.map((item) => (
                    <Link
                      key={item.id}
                      href={`/content/${item.id}`}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 py-1.5 px-3 group flex items-start gap-3"
                      style={{ 
                        borderLeft: `4px solid ${dimensionData.color}`,
                        borderTop: `1px solid ${dimensionData.color}20`,
                        borderRight: `1px solid ${dimensionData.color}20`,
                        borderBottom: `1px solid ${dimensionData.color}20`
                      }}
                    >
                      {/* Content Image Placeholder */}
                      <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      
                      {/* Content Info */}
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-gray-700 transition-colors mb-0 leading-tight">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span 
                            className="text-xs font-medium px-2 py-1 rounded"
                            style={{ 
                              backgroundColor: `${dimensionData.color}20`,
                              color: dimensionData.color 
                            }}
                          >
                            {dimensionData.name}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{keyInfo.name}</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
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
              <div className="space-y-2">
                {practiceContent.length > 0 ? (
                  practiceContent.map((item) => (
                    <Link
                      key={item.id}
                      href={`/content/${item.id}`}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 py-1.5 px-3 group flex items-start gap-3"
                      style={{ 
                        borderLeft: `4px solid ${dimensionData.color}`,
                        borderTop: `1px solid ${dimensionData.color}20`,
                        borderRight: `1px solid ${dimensionData.color}20`,
                        borderBottom: `1px solid ${dimensionData.color}20`
                      }}
                    >
                      {/* Content Image Placeholder */}
                      <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      
                      {/* Content Info */}
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-gray-700 transition-colors mb-0 leading-tight">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span 
                            className="text-xs font-medium px-2 py-1 rounded"
                            style={{ 
                              backgroundColor: `${dimensionData.color}20`,
                              color: dimensionData.color 
                            }}
                          >
                            {dimensionData.name}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{keyInfo.name}</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
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
      </main>
    </div>
  );
}