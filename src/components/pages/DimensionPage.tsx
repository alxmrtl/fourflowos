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
      text: "When tuned emotions become your compass, an open mind embraces infinite possibilities, and a focused body channels pure presence - flow becomes inevitable.",
      keys: ["tuned emotions", "open mind", "focused body"]
    },
    space: {
      text: "Through intentional space design, optimized tools that amplify capability, and feedback systems that accelerate learning - your environment becomes your greatest ally.",
      keys: ["space design", "optimized tools", "feedback systems"]
    },
    story: {
      text: "By weaving generative stories that transform obstacles into adventures, aligning with worthy missions that ignite purpose and stepping into empowered roles that unleash authentic power - you become the hero of your own epic.",
      keys: ["generative stories", "worthy missions", "empowered roles"]
    },
    spirit: {
      text: "Through grounding values that anchor your truth, visualized visions that magnetize your future and ignited curiosity that transforms every moment into discovery - you connect with infinite source of creative flow.",
      keys: ["grounding values", "visualized visions", "ignited curiosity"]
    }
  };
  return descriptions[dimension];
};

const getKeyDisplayInfo = (keyId: string) => {
  const keyInfo = {
    'tuned-emotions': { name: 'Tuned Emotions', emoji: '🎯' },
    'open-mind': { name: 'Open Mind', emoji: '🧠' },
    'focused-body': { name: 'Focused Body', emoji: '⚡' },
    'curated-space': { name: 'Curated Space', emoji: '🏠' },
    'optimized-tools': { name: 'Optimized Tools', emoji: '🛠️' },
    'feedback-systems': { name: 'Feedback Systems', emoji: '📊' },
    'generative-stories': { name: 'Generative Stories', emoji: '📖' },
    'worthy-mission': { name: 'Worthy Mission', emoji: '🎯' },
    'empowered-roles': { name: 'Empowered Roles', emoji: '👑' },
    'grounding-values': { name: 'Grounding Values', emoji: '⚓' },
    'visualized-visions': { name: 'Visualized Visions', emoji: '🔮' },
    'ignited-curiosity': { name: 'Ignited Curiosity', emoji: '🔥' }
  };
  return keyInfo[keyId] || { name: keyId, emoji: '🔑' };
};

export default function DimensionPage({ dimension }: DimensionPageProps) {
  const dimensionData = DIMENSIONS[dimension];
  
  if (!dimensionData) {
    return <div>Dimension not found</div>;
  }

  const getKeyPath = (keyId: string) => `/dimension/${dimension}/key/${keyId}`;
  const dimensionDesc = getDimensionDescription(dimension);

  const renderHighlightedText = (text: string, keys: string[], color: string) => {
    let highlightedText = text;
    keys.forEach(key => {
      const regex = new RegExp(`(${key})`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span style="color: ${color}; font-weight: 600; text-shadow: 0 0 8px ${color}40;">$1</span>`);
    });
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

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
                {renderHighlightedText(dimensionDesc.text, dimensionDesc.keys, dimensionData.color)}
              </p>
            </div>
          </div>
        </div>

        {/* Three Key Sections - 3/4 of space */}
        <div className="flex-1 grid grid-cols-1 gap-3">
          {dimensionData.keys.map((key, index) => {
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
                    {keyInfo.emoji} {keyInfo.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Key to Flow</p>
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