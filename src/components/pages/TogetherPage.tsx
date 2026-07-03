'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import { STEEL, AMETHYST } from '@/styles/brand-colors';

type Audience = 'individual' | 'team';

export default function TogetherPage() {
  const [audience, setAudience] = useState<Audience | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const contentInView = useInView(contentRef, { once: true, margin: '-50px' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          form: 'together',
          ...(audience ? { audience } : {}),
          website: honeypot,
        }),
      });

      const result = await response.json();
      setSubmitStatus(result.success ? 'success' : 'error');
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
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: STEEL }}
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Work Together
          </motion.p>

          <motion.h1
            className="font-display text-5xl md:text-6xl font-normal text-white mb-5 leading-[1.1]"
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            Some conditions open faster{' '}
            <span
              className="bg-gradient-to-r bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${STEEL}, ${AMETHYST})` }}
            >
              with a guide.
            </span>
          </motion.h1>

          <motion.p
            className="text-base text-gray-400 max-w-md mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            For your own practice, or your team&apos;s. Tell me where you&apos;re stuck
            and I&apos;ll reply personally.
          </motion.p>
        </div>
      </section>

      {/* The form */}
      <section ref={contentRef} className="relative pb-20">
        <div className="max-w-xl mx-auto px-6">
          <motion.div
            className="rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: 'rgba(20,20,20,0.95)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{ height: 3, background: `linear-gradient(90deg, ${STEEL}, ${AMETHYST})` }}
            />
            <div className="p-6 md:p-8">
              {submitStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-10 text-center"
                >
                  <p className="text-white font-medium mb-2">Sent.</p>
                  <p className="text-sm text-gray-500">
                    You&apos;ll hear from me within a couple of days. — Alex
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot — hidden from real users, catches bots */}
                  <div
                    aria-hidden="true"
                    style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
                  >
                    <label htmlFor="website">Website</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                    >
                      <p className="text-red-400 text-sm font-medium">
                        Something went wrong. Email fourflowos@gmail.com instead.
                      </p>
                    </motion.div>
                  )}

                  {/* Who it's for — one light touch, optional */}
                  <div className="flex gap-2">
                    {(['individual', 'team'] as Audience[]).map((a) => {
                      const active = audience === a;
                      const color = a === 'team' ? AMETHYST : STEEL;
                      return (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setAudience(active ? null : a)}
                          className="px-4 py-2 rounded-full text-xs transition-all duration-200"
                          style={{
                            color: active ? color : '#9CA3AF',
                            background: active ? `${color}15` : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${active ? `${color}50` : 'rgba(255,255,255,0.1)'}`,
                          }}
                        >
                          {a === 'team' ? 'For my team' : 'For me'}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-2">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClasses('email')}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-medium text-gray-400 mb-2">
                      What&apos;s going on?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      className={`${inputClasses('message')} resize-none`}
                      placeholder="Where you're at, what you're trying to move through..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3.5 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{ background: `linear-gradient(90deg, ${STEEL}, ${AMETHYST})` }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* One quiet footer line */}
          <motion.p
            className="mt-8 text-center text-xs text-gray-600"
            initial={{ opacity: 0 }}
            animate={contentInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            You&apos;d be writing to{' '}
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
              Alex
            </Link>
            {' '}· or email fourflowos@gmail.com
          </motion.p>
        </div>
      </section>
    </PageLayout>
  );
}
