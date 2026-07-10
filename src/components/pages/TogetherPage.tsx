'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import { CORAL, SAGE, STEEL, AMETHYST, GRADIENTS } from '@/styles/brand-colors';
import { RELAY_LAYERS, StatusGlyph } from '@/components/pages/offers/ConditionsMap';

type Audience = 'individual' | 'team';

/** Miniature of the paper Flow Map — the Session tile's artifact preview. */
function WorksheetThumb() {
  const bands = [CORAL, SAGE, STEEL, AMETHYST];
  return (
    <div
      className="rounded-lg px-4 py-3.5 w-full max-w-[240px] shadow-2xl"
      style={{ background: '#F7F4EE', transform: 'rotate(-1.5deg)' }}
      aria-hidden
    >
      <p
        className="font-display text-[13px] tracking-[0.08em] text-center"
        style={{ color: '#333333' }}
      >
        THE FLOW MAP
      </p>
      <div className="h-[2px] rounded-full mx-auto my-1.5 w-20" style={{ background: GRADIENTS.fourPillar }} />
      {bands.map((color) => (
        <div key={color} className="pl-2 py-1" style={{ borderLeft: `2px solid ${color}` }}>
          {[0, 1].map((row) => (
            <div key={row} className="flex items-center gap-1.5 py-[3px]">
              <span className="h-px flex-1" style={{ background: 'rgba(51,51,51,0.3)' }} />
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="w-[7px] h-[7px] rounded-full"
                  style={{ border: '1px solid rgba(51,51,51,0.55)' }}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Miniature of the Team Conditions Map grid — the Diagnostic tile's artifact preview. */
function MapThumb() {
  return (
    <div className="w-full max-w-[240px]" aria-hidden>
      <div className="grid grid-cols-4 gap-2.5">
        {RELAY_LAYERS.map((layer) => (
          <div key={layer.label} className="pt-1.5" style={{ borderTop: `2.5px solid ${layer.color}` }}>
            <div className="flex flex-col gap-2 items-center pt-1.5">
              {layer.cells.map((cell) => (
                <span
                  key={cell.name}
                  className={cell.bottleneck ? 'rounded-full p-[3px]' : ''}
                  style={cell.bottleneck ? { border: `1px solid ${layer.color}` } : undefined}
                >
                  <StatusGlyph status={cell.status} ink="rgba(255,255,255,0.85)" />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2.5 text-[9px] uppercase tracking-[0.16em] text-gray-500 text-center">
        twelve conditions · one diagnosis
      </p>
    </div>
  );
}

function OfferTile({
  href,
  eyebrow,
  eyebrowColor,
  title,
  description,
  facts,
  thumb,
  cta,
  delay,
}: {
  href: string;
  eyebrow: string;
  eyebrowColor: string;
  title: string;
  description: string;
  facts: string[];
  thumb: React.ReactNode;
  cta: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay }}
      className="h-full"
    >
      <Link
        href={href}
        className="group flex flex-col h-full rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/25 hover:-translate-y-1"
        style={{ background: 'rgba(17,17,17,0.9)' }}
      >
        <div style={{ height: 3, background: GRADIENTS.fourPillar }} />
        <div className="flex flex-col flex-1 p-7 md:p-8">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2"
            style={{ color: eyebrowColor }}
          >
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl text-white mb-3">{title}</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">{description}</p>

          <div className="flex justify-center py-2 mb-6">{thumb}</div>

          <ul className="space-y-2 mb-7 mt-auto">
            {facts.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[13px] text-gray-300">
                <span
                  className="w-1 h-1 rounded-full mt-[7px] flex-shrink-0"
                  style={{ background: eyebrowColor }}
                />
                {f}
              </li>
            ))}
          </ul>

          <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
            {cta} <span aria-hidden>&rarr;</span>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

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
      <section ref={heroRef} className="relative py-16 md:py-20">
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
            className="text-base text-gray-400 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Two ways in — one gives each person their own diagnosis, one diagnoses
            the team as a system. Both start with a conversation, and both end with
            something you can act on.
          </motion.p>
        </div>
      </section>

      {/* The two offers */}
      <section className="relative pb-20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-6 items-stretch">
          <OfferTile
            href="/together/flow-map-session"
            eyebrow="For every person on the team"
            eyebrowColor={CORAL}
            title="The Flow Map Session"
            description="A 90–120 minute facilitated session. Each person walks the twelve conditions that shape how well they can work, fills in their own Flow Map, and leaves knowing which condition carries them — and which one is most in the way."
            facts={[
              'One session, teams of 5–20',
              'Everyone keeps their paper Flow Map, and receives a personal Flow Profile within 48 hours',
              'Answers stay with each person — no participant data to anyone, including whoever booked the room',
            ]}
            thumb={<WorksheetThumb />}
            cta="See how the session works"
            delay={0.05}
          />
          <OfferTile
            href="/together/team-diagnostic"
            eyebrow="For the team as a system"
            eyebrowColor={SAGE}
            title="Team Conditions Diagnostic"
            description="A two-to-four-week evidence engagement. Confidential interviews, real meeting transcripts, and a structured questionnaire converge on the specific condition constraining output — with the evidence behind it, and the first intervention worth running."
            facts={[
              'Two to four weeks, teams of 5–25',
              'Team Conditions Report, one-page Conditions Map, and a 90-minute team debrief',
              'A 30-day indicator and follow-through call — so you know whether it worked',
            ]}
            thumb={<MapThumb />}
            cta="See how the diagnostic works"
            delay={0.12}
          />
        </div>
        <motion.p
          className="mt-8 text-center text-sm text-gray-500 max-w-xl mx-auto px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Not sure which fits? The Session diagnoses individuals; the Diagnostic
          diagnoses the system. Say where you&apos;re stuck in the note below and
          we&apos;ll sort it on a short call.
        </motion.p>
      </section>

      {/* The form */}
      <section id="contact" ref={contentRef} className="relative pb-20 scroll-mt-28">
        <div className="max-w-xl mx-auto px-6">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl text-white mb-2">Start the conversation</h2>
            <p className="text-sm text-gray-500">
              Tell me where you&apos;re stuck and I&apos;ll reply personally.
            </p>
          </motion.div>

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
