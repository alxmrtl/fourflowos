'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MAIN_LOGO, BG_CIRCLE, DIMENSIONS } from '@/data/framework';
import TopBar from '@/components/navigation/TopBar';

export default function AboutPage() {
  const sections = [
    {
      id: 'fourgames',
      title: 'FourGames',
      content: `FourGames represents the playful intersection of growth and mastery. Just as games create optimal challenge-skill balance that naturally generates flow states, the FourFlow framework gamifies personal development across four key dimensions.

Each dimension becomes a "game" with its own rules, challenges, and progression systems. This approach transforms the often overwhelming journey of personal growth into an engaging, systematic adventure where every challenge becomes an opportunity to level up.`
    },
    {
      id: 'origin-story',
      title: 'Flow Origin Story',
      content: `My path has led me from the haze of hesitation to the clear rhythm of inspired action. I used to dance with distraction. Now, I choreograph high-flow lifestyles that bridge science and spirituality to cultivate presence and clarity.

In flow, we harmonize effort with ease, replace apathy with inspiration, and leave behind grinding for thriving in joy and simplicity. Work, wellness, and wonder resonate in unison.

This framework emerged from years of studying peak performance, consciousness research, and the practical application of flow science in real-world contexts. It's not just theory—it's a lived methodology for sustainable excellence.`
    },
    {
      id: 'holistic-thinking',
      title: 'Holistic Thinking',
      content: `Traditional approaches to personal development often focus on isolated aspects of life—productivity here, mindfulness there, fitness somewhere else. FourFlowOS recognizes that optimal performance emerges from the dynamic interaction between all dimensions of human experience.

Holistic thinking means understanding that:
• Your physical state affects your mental clarity
• Your environment shapes your emotional patterns  
• Your sense of purpose influences your energy levels
• Your values determine your sustainability

When we optimize all four dimensions simultaneously, we create synergistic effects that far exceed the sum of individual improvements.`
    },
    {
      id: 'pitch',
      title: 'The Pitch',
      content: `Imagine waking up each day feeling genuinely excited about your work, moving through challenges with grace and confidence, operating from a place of authentic purpose rather than external pressure.

This isn't wishful thinking—it's the natural result of aligning the four fundamental dimensions of human performance: Self, Space, Story, and Spirit.

FourFlowOS provides the systematic methodology to make this transformation practical and sustainable. It's designed for high-capability professionals who are tired of feeling trapped, drained, or disconnected from their work, despite their success.

The goal isn't just productivity—it's the integration of excellence with fulfillment, achievement with meaning, success with joy.`
    },
    {
      id: 'who-its-for',
      title: 'Who It&apos;s For',
      content: `FourFlowOS is designed for individuals who:

**High-Capability Professionals** experiencing overwhelm, apathy, or disconnection despite their skills and achievements.

**Entrepreneurs and Creatives** seeking to align their work with deeper purpose and sustainable engagement.

**Leaders and Teams** wanting to optimize collective performance while maintaining individual fulfillment.

**Growth-Oriented Individuals** ready to move beyond fragmented self-improvement approaches to a comprehensive, integrated methodology.

**People in Transition** navigating career changes, life shifts, or seeking greater alignment between their values and daily actions.

If you've ever felt like you're capable of more but trapped in patterns that drain rather than energize you, FourFlowOS offers a systematic path to transformation.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <TopBar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto relative">
              <Image
                src={BG_CIRCLE}
                alt="Background"
                fill
                className="object-contain opacity-20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 relative">
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
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About FourFlowOS
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Awakening millions through flow, guiding individuals to find their unique role 
            in life&apos;s greater synchronicity.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              I envision a world where millions are awakened through <strong>flow</strong>, discovering their{' '}
              <strong>unique role in life&apos;s greater synchronicity</strong>. My mission is to ignite this inner fire, 
              guiding others to find joy, purpose, and fulfillment in their work and lives through a holistic 
              framework that aligns Self, Space, Story, and Spirit.
            </p>
          </div>
        </div>

        {/* Four Dimensions Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">The Four Dimensions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.values(DIMENSIONS).map((dimension) => (
              <div key={dimension.id} className="flex items-start gap-4">
                <div className="w-12 h-12 relative flex-shrink-0">
                  <Image
                    src={dimension.icon}
                    alt={dimension.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 
                    className="text-lg font-bold mb-2"
                    style={{ color: dimension.color }}
                  >
                    {dimension.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {dimension.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {section.title}
              </h2>
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                style={{ whiteSpace: 'pre-line' }}
              >
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Begin Your Flow Journey?
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Transform from overwhelm to clarity, apathy to engagement, through the systematic 
            integration of Self, Space, Story, and Spirit.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Explore the Framework
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}