'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DIMENSIONS, MAIN_LOGO } from '@/data/framework';
import { DimensionType } from '@/types/framework';
import TopBar from '@/components/navigation/TopBar';

interface DimensionPageProps {
  dimension: DimensionType;
}

const getDimensionDescription = (dimension: DimensionType) => {
  const descriptions = {
    self: {
      text: "Develop unshakeable focus and presence by integrating physical, mental, and emotional intelligence.",
      keys: []
    },
    space: {
      text: "Build spaces and systems that multiply your leverage while removing distractions.",
      keys: []
    },
    story: {
      text: "Transform your sense of purpose into a driving force for excellence and fulfillment.",
      keys: []
    },
    spirit: {
      text: "Access unlimited energy and direction through aligned values, wonder, and vision.",
      keys: []
    }
  };
  return descriptions[dimension];
};

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

export default function DimensionPage({ dimension }: DimensionPageProps) {
  const dimensionData = DIMENSIONS[dimension];
  
  if (!dimensionData) {
    return <div>Dimension not found</div>;
  }

  const getKeyPath = (keyId: string) => `/dimension/${dimension}/key/${keyId}`;
  const dimensionDesc = getDimensionDescription(dimension);

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
            
            <div className="flex items-center">
              <div className="relative w-7 h-7">
                <Image
                  src={dimensionData.sectionLogo}
                  alt={dimensionData.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-gray-700 font-medium text-sm ml-2">
                {dimensionData.name}
              </span>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-2 lg:px-8 py-4 lg:py-6 min-h-screen flex flex-col">
        {/* Compact Dimension Header */}
        <motion.div 
          className="rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6 flex-shrink-0" 
          style={{ backgroundColor: dimensionData.color }}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="w-12 h-12 lg:w-16 lg:h-16 relative flex-shrink-0">
              <Image
                src={dimensionData.sectionLogo}
                alt={dimensionData.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs lg:text-sm font-bold uppercase tracking-wider mb-1 text-white">
                {dimensionData.name} DIMENSION
              </p>
              <p className="text-sm lg:text-base leading-relaxed text-white">
                {dimensionDesc.text}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Three Key Sections */}
        <div className="grid grid-cols-1 gap-2 lg:gap-4">
          {dimensionData.keys.map((key, index) => {
            const keyInfo = getKeyDisplayInfo(key.id);
            return (
              <motion.div
                key={key.id}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.15, 
                  delay: index * 0.03,
                  ease: 'easeOut'
                }}
              >
                <Link
                  href={getKeyPath(key.id)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-300 py-1.5 lg:py-3 px-3 lg:px-4 group flex items-start gap-3 lg:gap-4 block touch-manipulation"
                  style={{ 
                    borderLeft: `4px solid ${dimensionData.color}`,
                    borderTop: `1px solid ${dimensionData.color}20`,
                    borderRight: `1px solid ${dimensionData.color}20`,
                    borderBottom: `1px solid ${dimensionData.color}20`
                  }}
                >
                {/* Key Icon */}
                <div className="w-8 h-8 lg:w-12 lg:h-12 relative flex-shrink-0">
                  <Image
                    src={key.icon}
                    alt={key.name}
                    fill
                    className="object-contain"
                  />
                </div>
                
                {/* Key Content */}
                <div className="flex-1">
                  <p className="text-xs lg:text-sm font-bold uppercase tracking-wider mb-0" style={{ color: dimensionData.color }}>
                    FLOW KEY #{keyInfo.keyNumber}
                  </p>
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors mb-0 leading-tight">
                    {keyInfo.name}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 leading-tight mt-0.5">
                    {keyInfo.description}
                  </p>
                </div>

                {/* Arrow */}
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}