'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { KEYS, DIMENSIONS, MAIN_LOGO } from '@/data/framework';
import { getContentByDimensionAndKey } from '@/data/content';
import { KeyType, DimensionType, ContentItem } from '@/types/framework';
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
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const keyData = KEYS[keyId];
  const dimensionData = DIMENSIONS[dimension];
  const keyInfo = getKeyDisplayInfo(keyId);
  
  useEffect(() => {
    async function loadContent() {
      try {
        const keyContent = await getContentByDimensionAndKey(dimension, keyId);
        // Sort: pinned first, then by created date (newest first)
        const sortedContent = keyContent.sort((a, b) => {
          if (a.is_pinned && !b.is_pinned) return -1;
          if (!a.is_pinned && b.is_pinned) return 1;
          if (a.is_pinned && b.is_pinned) {
            return (a.pin_order || 0) - (b.pin_order || 0);
          }
          // For non-pinned content, sort by created date (newest first)
          const aDate = new Date(a.created_date || '2024-01-01');
          const bDate = new Date(b.created_date || '2024-01-01');
          return bDate.getTime() - aDate.getTime();
        });
        setContent(sortedContent);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadContent();
  }, [dimension, keyId]);
  
  if (!keyData || !dimensionData) {
    return <div>Key not found</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        {keyData && dimensionData && (
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-2 lg:px-8 py-3">
              <nav className="flex items-center space-x-3">
                <Link 
                  href="/" 
                  className="flex items-center hover:opacity-80 transition-opacity"
                  title="FourFlowOS Home"
                >
                  <div className="relative w-8 h-8">
                    <Image
                      src={MAIN_LOGO}
                      alt="FourFlowOS"
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>
                
                <span className="text-gray-400 text-lg">→</span>
                
                <Link 
                  href={`/dimension/${dimension}`}
                  className="flex items-center hover:opacity-80 transition-opacity"
                  title={`${dimensionData.name} Dimension`}
                >
                  <div className="relative w-7 h-7">
                    <Image
                      src={dimensionData.sectionLogo}
                      alt={dimensionData.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>
                
                <span className="text-gray-400 text-lg">→</span>
                
                <div className="flex items-center">
                  <div className="relative w-6 h-6">
                    <Image
                      src={keyData.icon}
                      alt={keyData.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-gray-700 font-medium text-sm ml-2">
                    {keyInfo.name}
                  </span>
                </div>
              </nav>
            </div>
          </div>
        )}
        <main className="max-w-6xl mx-auto px-2 lg:px-8 py-4 lg:py-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading content...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <TopBar />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-2 lg:px-8 py-3">
          <nav className="flex items-center space-x-3">
            <Link 
              href="/" 
              className="flex items-center hover:opacity-80 transition-opacity"
              title="FourFlowOS Home"
            >
              <div className="relative w-8 h-8">
                <Image
                  src={MAIN_LOGO}
                  alt="FourFlowOS"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            
            <span className="text-gray-400 text-lg">→</span>
            
            <Link 
              href={`/dimension/${dimension}`}
              className="flex items-center hover:opacity-80 transition-opacity"
              title={`${dimensionData.name} Dimension`}
            >
              <div className="relative w-7 h-7">
                <Image
                  src={dimensionData.sectionLogo}
                  alt={dimensionData.name}
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            
            <span className="text-gray-400 text-lg">→</span>
            
            <div className="flex items-center">
              <div className="relative w-6 h-6">
                <Image
                  src={keyData.icon}
                  alt={keyData.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-gray-700 font-medium text-sm ml-2">
                {keyInfo.name}
              </span>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-2 lg:px-8 py-4 lg:py-6">
        {/* Key Info Box */}
        <div 
          className="rounded-lg shadow-sm p-3 lg:p-6 mb-3 lg:mb-6 h-32 lg:h-40"
          style={{ backgroundColor: dimensionData.color }}
        >
          <div className="flex items-center gap-3 lg:gap-6 h-full">
            <div className="w-12 h-12 lg:w-16 lg:h-16 relative flex-shrink-0">
              <Image
                src={keyData.icon}
                alt={keyData.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs lg:text-sm font-bold uppercase tracking-wider mb-1 text-white">
                FLOW KEY #{keyInfo.keyNumber}
              </p>
              <h1 className="text-xl lg:text-2xl font-bold text-white mb-1">
                {keyInfo.name}
              </h1>
              <p className="text-xs lg:text-sm leading-relaxed text-white">
                {keyInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          {/* Content List */}
          <div className="p-4 lg:p-6">
            <div className="space-y-3 lg:space-y-4">
              {content.length > 0 ? (
                content.map((item) => {
                  const isPinned = item.is_pinned;
                  const isLearn = item.type === 'learn';
                  
                  return (
                    <Link
                      key={item.id}
                      href={`/content/${item.id}`}
                      className={`block rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-3 lg:p-4 group ${
                        isPinned 
                          ? 'bg-gradient-to-r from-white to-gray-50' 
                          : 'bg-white'
                      }`}
                      style={{ 
                        borderLeft: isPinned 
                          ? `6px solid ${dimensionData.color}` 
                          : `3px solid ${dimensionData.color}`,
                        borderTop: `1px solid ${dimensionData.color}20`,
                        borderRight: `1px solid ${dimensionData.color}20`,
                        borderBottom: `1px solid ${dimensionData.color}20`,
                        boxShadow: isPinned 
                          ? `0 4px 6px -1px ${dimensionData.color}15, 0 2px 4px -1px ${dimensionData.color}06`
                          : undefined
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Content Icon */}
                        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded flex-shrink-0 flex items-center justify-center ${
                          isPinned ? 'bg-gradient-to-br from-yellow-100 to-orange-100' : 'bg-gray-100'
                        }`}>
                          {isPinned && (
                            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          )}
                          {!isPinned && (
                            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {isLearn ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              )}
                            </svg>
                          )}
                        </div>
                        
                        {/* Content Info */}
                        <div className="flex-1">
                          {isPinned && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                Pinned Essential
                              </span>
                            </div>
                          )}
                          
                          <h3 className={`font-bold text-gray-900 group-hover:text-gray-700 transition-colors leading-tight ${
                            isPinned ? 'text-base lg:text-lg mb-1' : 'text-sm lg:text-base mb-1'
                          }`}>
                            {item.title}
                          </h3>
                          
                          {isPinned && item.description && (
                            <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            {item.read_time && (
                              <span className="text-xs text-gray-500">{item.read_time} min read</span>
                            )}
                          </div>
                        </div>

                        {/* Arrow */}
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
                  <p className="text-gray-600">Content for this key will be added soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}