'use client';

import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';

const STEEL = '#5B84B1';
const AMETHYST = '#7A4DA4';

export default function TogetherPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const contentInView = useInView(contentRef, { once: true, margin: '-50px' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: '73d66ffb-9a88-4841-8f05-a48b0219288f',
          name: formData.name,
          email: formData.email,
          subject: 'FourFlow: Signal Session Request',
          message: formData.message,
          from_name: 'FourFlowOS Website',
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName: string) =>
    `w-full px-4 py-3 bg-white/[0.05] border rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none ${
      focusedField === fieldName
        ? 'border-white/30 bg-white/[0.08] ring-2 ring-white/10'
        : 'border-white/10 hover:border-white/20'
    }`;

  return (
    <PageLayout accentColor={STEEL}>
      {/* Hero */}
      <section ref={heroRef} className="relative py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: STEEL }}>
              Work Together
            </p>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            Your profile is the starting point.{' '}
            <span
              className="bg-gradient-to-r bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${STEEL}, ${AMETHYST})` }}
            >
              Not the whole story.
            </span>
          </motion.h1>

          <motion.p
            className="text-base text-gray-400 max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            A Signal Session is a 1:1 conversation to walk through what your Flow Archetype is actually pointing at — and what a concrete next move looks like for you.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section ref={contentRef} className="relative pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Signal Session card */}
            <motion.div
              className="rounded-2xl border border-white/10 overflow-hidden"
              style={{ background: 'rgba(20,20,20,0.95)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div style={{ height: 3, background: STEEL }} />
              <div className="p-6">
                <h2 className="text-base font-semibold text-white mb-2">Signal Session</h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  60 minutes. You bring your profile. We map the gap between where you are and where you want your energy to go. You leave with a clear first step.
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    'Profile walkthrough + interpretation',
                    'Identify the highest-leverage key to work on',
                    'Concrete practice or structural change',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-500">
                      <span style={{ color: STEEL }} className="mt-0.5 flex-shrink-0">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:fourflowos@gmail.com?subject=Signal Session Request"
                  className="inline-flex items-center gap-1 text-xs transition-colors"
                  style={{ color: STEEL }}
                >
                  Email to book <span>→</span>
                </a>
              </div>
            </motion.div>

            {/* Teams card */}
            <motion.div
              className="rounded-2xl border border-white/10 overflow-hidden"
              style={{ background: 'rgba(20,20,20,0.95)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div style={{ height: 3, background: AMETHYST }} />
              <div className="p-6">
                <h2 className="text-base font-semibold text-white mb-2">Teams</h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  Bring FourFlow into your team as a shared language for how people work. Group diagnostics, workshops, and practitioner-led facilitation available.
                </p>
                <p className="text-xs text-gray-600 mb-4">
                  Currently onboarding early teams. Reach out to start the conversation.
                </p>
                <a
                  href="mailto:fourflowos@gmail.com?subject=Teams Inquiry"
                  className="inline-flex items-center gap-1 text-xs transition-colors"
                  style={{ color: AMETHYST }}
                >
                  Get in touch <span>→</span>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Contact form */}
          <motion.div
            className="rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: 'rgba(20,20,20,0.95)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div
              style={{ height: 3, background: `linear-gradient(90deg, ${STEEL}, ${AMETHYST})` }}
            />
            <div className="p-6">
              <h2 className="text-base font-semibold text-white mb-1">Send a message</h2>
              <p className="text-xs text-gray-600 mb-5">Or email directly: fourflowos@gmail.com</p>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                >
                  <p className="text-green-400 text-sm font-medium">Message sent. We&apos;ll be in touch soon.</p>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <p className="text-red-400 text-sm font-medium">Something went wrong. Try emailing directly.</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className={inputClasses('name')}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={inputClasses('email')}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-gray-400 mb-2">
                    What are you looking for?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className={`${inputClasses('message')} resize-none`}
                    placeholder="Tell me where you're at and what you're trying to move through..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3.5 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ background: `linear-gradient(90deg, ${STEEL}, ${AMETHYST})` }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Already have profile CTA */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={contentInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-xs text-gray-600 mb-2">Don&apos;t have a profile yet?</p>
            <Link
              href="/map"
              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Map your signal first <span>→</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
