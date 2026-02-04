'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SAGE } from './constants';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  icon: string;
  items: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    title: 'Getting Started',
    icon: '🚀',
    items: [
      {
        question: 'What is FlowRead and how does it work?',
        answer:
          'FlowRead is a speed reading trainer designed to improve your reading speed through scientifically-backed techniques. It combines rapid serial visual presentation (RSVP), chunked reading, and guided pacing to help you read faster while maintaining comprehension. The app works by training your eyes to move more efficiently across text, reducing subvocalization (inner speech), and helping you process larger chunks of information at once.',
      },
      {
        question: 'How do I get started with FlowRead?',
        answer:
          'Step 1: Take a speed test in the Test tab to establish your baseline reading speed.\n\nStep 2: Go to the Train tab and select a training mode (Word-by-Word, Phrases, or Line-by-Line).\n\nStep 3: Choose your text and adjust the speed to match your current ability.\n\nStep 4: Practice regularly with progressively faster speeds as you improve.',
      },
      {
        question: "What's a good starting speed for training?",
        answer:
          'Start with a speed slightly faster than your baseline reading speed from the test. For example:\n\n• If you tested at 200 WPM, start training at 220-250 WPM\n• If you tested at 300 WPM, start training at 320-350 WPM\n• If you tested at 400+ WPM, start training at 420-450 WPM\n\nThe key is to challenge yourself without creating frustration.',
      },
      {
        question: 'How often should I practice?',
        answer:
          'For best results, practice 15-30 minutes daily. Consistency is more important than long sessions.\n\n• Beginners: 10-15 minutes daily, focusing on one training mode\n• Intermediate: 20-25 minutes daily, mixing different modes\n• Advanced: 30+ minutes daily, with regular speed increases',
      },
    ],
  },
  {
    title: 'Training Modes',
    icon: '🎯',
    items: [
      {
        question: "What's the difference between the training modes?",
        answer:
          'Word-by-Word: Displays one word at a time at your set speed. Great for eliminating subvocalization and improving focus.\n\nPhrases: Shows 6 words at once, helping you learn to process larger chunks of information. Improves comprehension at higher speeds.\n\nLine-by-Line: Highlights complete lines sequentially, simulating natural reading while maintaining pace control. Best for transitioning to normal reading.',
      },
      {
        question: 'Which training mode should I start with?',
        answer:
          "Start with Word-by-Word if you're new to speed reading. It's the most focused approach and helps break bad reading habits quickly.\n\nOnce comfortable (after 1-2 weeks), try Phrases to improve your ability to process multiple words as units.\n\nUse Line-by-Line when you want to practice with a more natural reading experience at controlled speeds.",
      },
      {
        question: 'Can I use my own texts for training?',
        answer:
          'Yes! Click "Choose Text" in the Train tab, then "New Text" to add your own content. You can paste articles, books, or documents you want to read, save multiple texts for different types of training, and use material relevant to your work or interests. Training with familiar content types can improve your real-world reading speed more effectively.',
      },
    ],
  },
  {
    title: 'Progress & Results',
    icon: '📈',
    items: [
      {
        question: 'How quickly will I see results?',
        answer:
          'Most users see improvements within the first week of regular practice:\n\n• Days 1-3: Adjustment period, getting comfortable with the interface\n• Week 1: 10-25% speed increase with maintained comprehension\n• Week 2-4: 30-50% improvement as techniques become natural\n• Month 2+: 50-100%+ improvement for dedicated users\n\nResults vary based on starting speed, practice frequency, and individual learning pace.',
      },
      {
        question: 'What should I do if I hit a plateau?',
        answer:
          'Plateaus are normal. Try these strategies:\n\n• Switch training modes: If using Word-by-Word, try Phrases mode\n• Vary your content: Use different text types (news, fiction, technical)\n• Take a break: Sometimes 2-3 days off helps consolidate gains\n• Focus on comprehension: Ensure you\'re understanding what you read\n• Increase challenge gradually: Push speed up in smaller increments',
      },
      {
        question: 'How do I know if I\'m maintaining comprehension?',
        answer:
          'Good comprehension indicators include:\n\n• You can summarize what you\'ve read\n• You remember key details and main ideas\n• You can answer questions about the content\n• The reading feels smooth, not rushed or confused\n\nIf comprehension drops, reduce speed by 10-15% and focus on understanding before pushing speed again.',
      },
    ],
  },
  {
    title: 'Tips & Best Practices',
    icon: '💡',
    items: [
      {
        question: 'What are the most important speed reading techniques?',
        answer:
          '1. Eliminate subvocalization: Stop "hearing" words in your head. FlowRead\'s pacing helps break this habit.\n\n2. Reduce fixations: Train your eyes to take in more words per glance instead of reading word-by-word.\n\n3. Use peripheral vision: Learn to see groups of words rather than individual words.\n\n4. Minimize regression: Avoid going back to re-read. Trust your first pass through the text.\n\n5. Practice chunking: Group words into meaningful phrases rather than processing each word separately.',
      },
      {
        question: 'What environment is best for training?',
        answer:
          'Optimize your training environment:\n\n• Good lighting: Avoid eye strain with proper lighting\n• Minimal distractions: Turn off notifications, find a quiet space\n• Comfortable posture: Sit upright, screen at eye level\n• Proper distance: Keep device 18-24 inches from your eyes\n• Regular breaks: Follow the 20-20-20 rule (every 20 min, look at something 20 feet away for 20 seconds)',
      },
      {
        question: 'Should I adjust the font size or style?',
        answer:
          'Yes! Customize the display for optimal comfort:\n\n• Font size: Use the slider to find a size that\'s easy to read without straining\n• Font style: Choose Serif for traditional reading or Sans for screen reading\n\nThe right settings reduce eye fatigue and help you maintain focus during longer sessions.',
      },
    ],
  },
];

function FAQAccordion({ section }: { section: FAQSection }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div
      className="relative rounded-2xl p-4 mb-4"
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="absolute top-0 left-4 right-4 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${SAGE}40, transparent)` }}
      />

      <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
        <span>{section.icon}</span>
        {section.title}
      </h3>

      <div className="space-y-2">
        {section.items.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full flex items-center justify-between py-2 text-left text-sm text-gray-300 hover:text-white transition-colors"
            >
              <span>{item.question}</span>
              <span
                className={`transform transition-transform text-gray-500 ${
                  expandedIndex === index ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>

            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="py-2 text-sm text-gray-500 whitespace-pre-line leading-relaxed">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutScreen() {
  return (
    <div className="space-y-4">
      <div
        className="relative rounded-2xl p-6 text-center"
        style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="absolute top-0 left-4 right-4 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${SAGE}60, transparent)` }}
        />

        <h2 className="text-xl font-bold text-white mb-2">About FlowRead</h2>
        <p className="text-gray-500 text-sm">Your comprehensive speed reading training companion</p>
      </div>

      {faqSections.map((section) => (
        <FAQAccordion key={section.title} section={section} />
      ))}
    </div>
  );
}
