'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import Image from 'next/image';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'flowzone' | 'flowhabits' | 'flowread' | 'flowrep';
}

const faqs: FAQItem[] = [
  {
    question: 'Where is my data stored?',
    answer: 'All your data is stored locally on your device. We do not collect, transmit, or have access to any of your personal data. This means your habits, focus sessions, and preferences never leave your device.',
    category: 'general',
  },
  {
    question: 'Do I need an account to use FourFlowOS apps?',
    answer: 'No! Our apps are designed to work without requiring any account creation or sign-in. Simply download and start using the app immediately.',
    category: 'general',
  },
  {
    question: 'How do I back up my data?',
    answer: 'Since data is stored locally on your device, you can back up your data by backing up your entire device through iCloud or iTunes. Individual app data export features may be added in future updates.',
    category: 'general',
  },
  {
    question: 'What are Focus Reps?',
    answer: 'Focus Reps are a core innovation in FlowZone. Each time you feel distracted but choose to return to focus, you press the Focus Rep button. This makes the invisible work of maintaining focus visible and measurable, helping you build your focus muscle over time.',
    category: 'flowzone',
  },
  {
    question: 'What is the Struggle Phase?',
    answer: 'The Struggle Phase is the first ~25% of any focus session where starting is hardest. FlowZone provides ambient encouragement during this phase because we understand that struggle is normal and part of the process of entering flow.',
    category: 'flowzone',
  },
  {
    question: 'How do the breathwork exercises work?',
    answer: 'FlowZone includes various breathwork patterns designed to help you transition into a focused state. These include box breathing, 4-7-8 breathing, and other techniques. The app guides you through each pattern with visual and optional audio cues.',
    category: 'flowzone',
  },
  {
    question: 'What are the Four Pillars in FlowHabits?',
    answer: 'The Four Pillars are SELF (inner mastery), SPACE (environment design), STORY (direction setting), and SPIRIT (inner drive). Each habit you create can be assigned to a pillar, helping you maintain balance across all dimensions of your life.',
    category: 'flowhabits',
  },
  {
    question: 'How are streaks calculated?',
    answer: 'Streaks count consecutive days you complete a habit. Missing a day resets the streak to zero. We display your current streak and longest streak to help motivate consistency.',
    category: 'flowhabits',
  },
  {
    question: 'How do streaks work in FlowRep?',
    answer: 'Streaks count consecutive days where all exercise targets were met. Rest days don\'t break your streak — they\'re part of the process. Yesterday counts toward your streak, but today only counts once you hit all targets.',
    category: 'flowrep',
  },
  {
    question: 'Can I export my FlowRep data?',
    answer: 'Yes! Go to Settings > Export Backup to save your data as a JSON file. You can import it later using Settings > Import Backup. All data stays on your device — no cloud sync required.',
    category: 'flowrep',
  },
  {
    question: 'How does FlowRead improve reading speed?',
    answer: 'FlowRead uses techniques like RSVP (Rapid Serial Visual Presentation) and word chunking to train your eyes and brain to process text faster. Regular practice with increasing speeds helps expand your reading capacity.',
    category: 'flowread',
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFaqs = selectedCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  const categoryLabels = {
    all: 'All Questions',
    general: 'General',
    flowzone: 'FlowZone',
    flowhabits: 'FlowHabits',
    flowread: 'FlowRead',
    flowrep: 'FlowRep',
  };

  const categoryColors = {
    general: '#333333',
    flowzone: '#FF6F61',
    flowhabits: '#6BA292',
    flowread: '#5B84B1',
    flowrep: '#FF6F61',
  };

  return (
    <LegalPageLayout title="Help & Support" lastUpdated="January 2, 2025">
      {/* Introduction */}
      <section className="mb-12">
        <p className="text-gray-300 leading-relaxed text-lg">
          Welcome to FourFlowOS support. Find answers to common questions below, or contact us directly
          if you need additional help.
        </p>
      </section>

      {/* Quick Contact */}
      <section className="mb-12">
        <div className="p-6 bg-gradient-to-r from-[#FF6F61]/10 to-[#7A4DA4]/10 border border-white/10 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-4">Need Direct Help?</h2>
          <p className="text-gray-400 mb-4">
            We typically respond within 24-48 hours on business days.
          </p>
          <a
            href="mailto:fourflowos@gmail.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Support
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === key
                  ? 'bg-white text-[#0a0a0a]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-5 flex items-start justify-between gap-4 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: categoryColors[faq.category] }}
                  />
                  <span className="text-white font-medium">{faq.question}</span>
                </div>
                <motion.svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-gray-400 pl-5 border-l-2 border-white/10">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* App-Specific Help */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">App Resources</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF6F61]/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-white font-semibold mb-2">FlowZone</h3>
            <p className="text-gray-500 text-sm mb-3">Focus timer with breathwork</p>
            <p className="text-gray-400 text-sm">
              Best for: Deep work sessions, focus training, building concentration habits
            </p>
          </div>
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#6BA292]/20 flex items-center justify-center mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-white font-semibold mb-2">FlowHabits</h3>
            <p className="text-gray-500 text-sm mb-3">Four Pillars habit tracker</p>
            <p className="text-gray-400 text-sm">
              Best for: Building balanced routines, tracking daily habits across life dimensions
            </p>
          </div>
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#5B84B1]/20 flex items-center justify-center mb-4">
              <span className="text-2xl">📖</span>
            </div>
            <h3 className="text-white font-semibold mb-2">FlowRead</h3>
            <p className="text-gray-500 text-sm mb-3">Speed reading trainer</p>
            <p className="text-gray-400 text-sm">
              Best for: Improving reading speed, training visual processing, flow reading practice
            </p>
          </div>
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF6F61]/20 flex items-center justify-center mb-4">
              <span className="text-2xl">💪</span>
            </div>
            <h3 className="text-white font-semibold mb-2">FlowRep</h3>
            <p className="text-gray-500 text-sm mb-3">Daily rep tracker</p>
            <p className="text-gray-400 text-sm">
              Best for: Tracking daily exercise reps, building streaks, making physical practice consistent
            </p>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Common Issues</h2>
        <div className="space-y-4">
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
            <h4 className="text-white font-semibold mb-2">App is running slowly</h4>
            <p className="text-gray-400 text-sm">
              Try closing other apps, restarting your device, or reinstalling the app. Make sure
              you have enough free storage space on your device.
            </p>
          </div>
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
            <h4 className="text-white font-semibold mb-2">Lost my data after reinstalling</h4>
            <p className="text-gray-400 text-sm">
              Since data is stored locally, uninstalling the app removes all associated data.
              We recommend backing up your device before reinstalling any apps.
            </p>
          </div>
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
            <h4 className="text-white font-semibold mb-2">Timer notifications not working</h4>
            <p className="text-gray-400 text-sm">
              Check that notifications are enabled for FlowZone in your device Settings &gt; Notifications.
              Also ensure Do Not Disturb mode is not blocking app notifications.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Summary */}
      <section className="p-8 bg-gradient-to-br from-[#FF6F61]/10 via-[#6BA292]/10 to-[#7A4DA4]/10 border border-white/10 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
        <p className="text-gray-300 mb-6">
          We&apos;re here to help you get the most out of FourFlowOS. Don&apos;t hesitate to reach out!
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:fourflowos@gmail.com"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#0a0a0a] font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Us
          </a>
          <a
            href="/privacy"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-colors"
          >
            View Privacy Policy
          </a>
        </div>
      </section>
    </LegalPageLayout>
  );
}
