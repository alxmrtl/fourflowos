'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DIMENSIONS, MAIN_LOGO } from '@/data/framework';
import { DimensionType } from '@/types/framework';
import MenuButton from '@/components/navigation/MenuButton';

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
  const keyInfo: Record<string, { name: string; emoji: string; description: string }> = {
    'tuned-emotions': { 
      name: 'Tuned Emotions', 
      emoji: '💫', 
      description: 'Use your feelings as signals to stay in the sweet spot between bored and overwhelmed.'
    },
    'open-mind': { 
      name: 'Open Mind', 
      emoji: '🧠', 
      description: 'Clear mental clutter and stay flexible so new ideas can flow naturally.'
    },
    'focused-body': { 
      name: 'Focused Body', 
      emoji: '🧘', 
      description: 'Get out of your head and into your body to stop overthinking and stay present.'
    },
    'intentional-space': { 
      name: 'Intentional Space', 
      emoji: '🏡', 
      description: 'Set up your environment to automatically put you in focus mode without willpower.'
    },
    'optimized-tools': { 
      name: 'Optimized Tools', 
      emoji: '⚡', 
      description: 'Use the right systems and tech to get more done with less effort.'
    },
    'feedback-systems': { 
      name: 'Feedback Systems', 
      emoji: '🔄', 
      description: 'Build quick ways to know if you\'re on track and course-correct fast.'
    },
    'generative-story': { 
      name: 'Generative Story', 
      emoji: '📖', 
      description: 'Create a personal narrative that makes challenges feel like adventure, not problems.'
    },
    'worthy-mission': { 
      name: 'Worthy Mission', 
      emoji: '🎯', 
      description: 'Connect your daily work to something bigger that naturally motivates you.'
    },
    'empowered-role': { 
      name: 'Empowered Role', 
      emoji: '👑', 
      description: 'Know what you own and why it matters so you can work with real purpose.'
    },
    'grounding-values': { 
      name: 'Grounding Values', 
      emoji: '⚖️', 
      description: 'Know what you stand for so decisions become obvious and doubt disappears.'
    },
    'visualized-vision': { 
      name: 'Visualized Vision', 
      emoji: '✨', 
      description: 'See your future clearly so your brain starts noticing the right opportunities.'
    },
    'ignited-curiosity': { 
      name: 'Ignited Curiosity', 
      emoji: '🔥', 
      description: 'Stay genuinely interested in your work so focus happens without forcing it.'
    }
  };
  return keyInfo[keyId] || { name: keyId, emoji: '🔑', description: 'Flow key description' };
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
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
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
          </Link>
          <MenuButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-2 py-4 h-screen flex flex-col">
        {/* Compact Dimension Header - 1/4 of space */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200 flex-shrink-0" style={{ height: '25%' }}>
          <div className="flex items-start gap-4 h-full">
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image
                src={dimensionData.sectionLogo}
                alt={dimensionData.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 flex items-center">
              <p className="text-sm leading-relaxed text-gray-700">
                {dimensionDesc.text}
              </p>
            </div>
          </div>
        </div>

        {/* Three Key Sections - 3/4 of space */}
        <div className="flex-1 grid grid-cols-1 gap-3">
          {dimensionData.keys.map((key) => {
            const keyInfo = getKeyDisplayInfo(key.id);
            return (
              <Link
                key={key.id}
                href={getKeyPath(key.id)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-gray-200 hover:border-gray-300 group flex items-center gap-4"
              >
                {/* Key Icon */}
                <div className="w-12 h-12 relative flex-shrink-0">
                  <Image
                    src={key.icon}
                    alt={key.name}
                    fill
                    className="object-contain"
                  />
                </div>
                
                {/* Key Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {keyInfo.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                    <span>{keyInfo.emoji}</span>
                    <span>{keyInfo.description}</span>
                  </p>
                </div>

                {/* Arrow */}
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}