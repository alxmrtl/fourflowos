'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { GRADIENTS } from '@/styles/brand-colors';
import { INITIAL_INTAKE_DATA, toIntakeStructured } from '@/types/intake';
import type { IntakeFormData } from '@/types/intake';

// ── Slide components ──────────────────────────────────────────────────────────
import Slide01Personal from './intake-slides/Slide01Personal';
import Slide02Birth from './intake-slides/Slide02Birth';
import Slide03Season from './intake-slides/Slide03Season';
import Slide04Chapter from './intake-slides/Slide04Chapter';
import Slide05Emotions from './intake-slides/Slide05Emotions';
import Slide06Pressure from './intake-slides/Slide06Pressure';
import Slide07MentalMode from './intake-slides/Slide07MentalMode';
import Slide08Spaces from './intake-slides/Slide08Spaces';
import Slide09HowYouWork from './intake-slides/Slide09HowYouWork';
import Slide10HowYouKnow from './intake-slides/Slide10HowYouKnow';
import Slide11Arc from './intake-slides/Slide11Arc';
import Slide12Mission from './intake-slides/Slide12Mission';
import Slide13Wired from './intake-slides/Slide13Wired';
import Slide14MadeOf from './intake-slides/Slide14MadeOf';
import Slide15Pulls from './intake-slides/Slide15Pulls';
import Slide16AliveMovement from './intake-slides/Slide16AliveMovement';
import Slide17Myth from './intake-slides/Slide17Myth';
import Slide18Shadow from './intake-slides/Slide18Shadow';
import Slide19Gift from './intake-slides/Slide19Gift';
import Slide20Closing from './intake-slides/Slide20Closing';

const TOTAL_SLIDES = 20;

// Required fields per slide — minimal; most slides are encouraged, not blocked
const SLIDE_REQUIRED: Record<number, (keyof IntakeFormData)[]> = {
  1: ['name', 'email'],
  2: ['birth_date', 'birth_location'],
  3: ['opening_season'],
  4: ['opening_chapter_title'],
  // Slides 5–20: all encouraged but not required
};

// ─── Progress bar ─────────────────────────────────────────────────────────────

function IntakeProgress({ current, total }: { current: number; total: number }) {
  const pct = ((current - 1) / (total - 1)) * 100;
  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs text-gray-600 mb-2">
        <span>{current} of {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: GRADIENTS.tertiaryCta }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// ─── Gateway ──────────────────────────────────────────────────────────────────

function IntakeGateway({ onBegin }: { onBegin: () => void }) {
  return (
    <motion.div
      key="gateway"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto"
    >
      <div
        className="rounded-3xl p-8 md:p-10 text-center space-y-6"
        style={{
          border: '1px solid rgba(99,48,160,0.35)',
          boxShadow: '0 0 60px rgba(99,48,160,0.18), 0 0 120px rgba(99,48,160,0.08), inset 0 0 40px rgba(99,48,160,0.04)',
          background: 'rgba(99,48,160,0.04)',
        }}
      >
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold italic text-white leading-snug">
            Before you begin.
          </h2>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-3">
          <ul className="space-y-2.5 text-sm text-gray-300">
            <li className="flex items-start gap-2.5">
              <span className="text-gray-600 mt-0.5">—</span>
              <span>Don&apos;t overthink your answers. Rely on your first instinct.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-gray-600 mt-0.5">—</span>
              <span>There are no impressive answers here. Answer honestly.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-gray-600 mt-0.5">—</span>
              <span>Write like you&apos;re telling a trusted friend — not composing an essay.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-gray-600 mt-0.5">—</span>
              <span>On a phone? Try voice-to-text for longer answers — it&apos;s faster and usually more honest.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-gray-600">
            Takes about 10–12 minutes. Answer each question as it comes.
          </p>
          <button
            type="button"
            onClick={onBegin}
            className="px-8 py-3 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#6330A0]/20 transition-all duration-300 hover:scale-[1.02]"
            style={{ background: GRADIENTS.tertiaryCta }}
          >
            I&apos;m ready
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export default function IntakeForm() {
  const [hasStarted, setHasStarted] = useState(false);
  const [slide, setSlide] = useState(1);
  const [formData, setFormData] = useState<IntakeFormData>(INITIAL_INTAKE_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field: string, value: string | string[] | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isSlideValid = (slideNum: number): boolean => {
    const required = SLIDE_REQUIRED[slideNum] || [];
    return required.every((field) => {
      const value = formData[field];
      if (typeof value === 'boolean') return true;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'number') return true;
      return String(value).trim().length > 0;
    });
  };

  const handleNext = () => {
    if (slide < TOTAL_SLIDES && isSlideValid(slide)) {
      setSlide((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (slide > 1) {
      setSlide((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const { data: { session } } = await getSupabaseBrowser().auth.getSession();
      const payload = {
        ...formData,
        intake_structured: toIntakeStructured(formData),
        ...(session?.user ? { user_id: session.user.id } : {}),
      };

      const response = await fetch('/api/profile/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success ────────────────────────────────────────────────────────────────
  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center py-16"
      >
        <div className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center" style={{ background: GRADIENTS.tertiaryCta }}>
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Thank you, {formData.name.split(' ')[0]}.
        </h2>

        <p className="text-lg text-gray-400 mb-6 max-w-md mx-auto">
          Your responses have been received. Check your email for a confirmation —
          your Flow Profile will arrive once it&apos;s ready.
        </p>

        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 max-w-md mx-auto">
          <h3 className="text-sm font-medium text-gray-400 mb-3">What happens next</h3>
          <ol className="space-y-3 text-left">
            {[
              "You'll receive a confirmation email shortly.",
              'We review your responses and generate your personalized Flow Archetype.',
              "You'll get an email with a link to your profile.",
              'Want to go deeper? Book a live facilitated session for the full experience.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-gray-500">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </motion.div>
    );
  }

  // ── Gateway ────────────────────────────────────────────────────────────────
  if (!hasStarted) {
    return (
      <AnimatePresence mode="wait">
        <IntakeGateway key="gateway" onBegin={() => setHasStarted(true)} />
      </AnimatePresence>
    );
  }

  // ── Slide renderer ─────────────────────────────────────────────────────────
  const renderSlide = () => {
    const p = { data: formData, onChange: handleChange };
    switch (slide) {
      case 1:  return <Slide01Personal key="s1"  data={p.data} onChange={p.onChange} />;
      case 2:  return <Slide02Birth    key="s2"  data={p.data} onChange={p.onChange} />;
      case 3:  return <Slide03Season   key="s3"  data={p.data} onChange={p.onChange} />;
      case 4:  return <Slide04Chapter  key="s4"  data={p.data} onChange={p.onChange} />;
      case 5:  return <Slide05Emotions key="s5"  data={p.data} onChange={(f, v) => handleChange(f, v as string[])} />;
      case 6:  return <Slide06Pressure key="s6"  data={p.data} onChange={p.onChange} />;
      case 7:  return <Slide07MentalMode key="s7" data={p.data} onChange={(f, v) => handleChange(f, v as number)} />;
      case 8:  return <Slide08Spaces   key="s8"  data={p.data} onChange={p.onChange} />;
      case 9:  return <Slide09HowYouWork key="s9" data={p.data} onChange={(f, v) => handleChange(f, v as string[])} />;
      case 10: return <Slide10HowYouKnow key="s10" data={p.data} onChange={p.onChange} />;
      case 11: return <Slide11Arc      key="s11" data={p.data} onChange={p.onChange} />;
      case 12: return <Slide12Mission  key="s12" data={p.data} onChange={p.onChange} />;
      case 13: return <Slide13Wired    key="s13" data={p.data} onChange={p.onChange} />;
      case 14: return <Slide14MadeOf   key="s14" data={p.data} onChange={(f, v) => handleChange(f, v as string[])} />;
      case 15: return <Slide15Pulls    key="s15" data={p.data} onChange={p.onChange} />;
      case 16: return <Slide16AliveMovement key="s16" data={p.data} onChange={p.onChange} />;
      case 17: return <Slide17Myth     key="s17" data={p.data} onChange={p.onChange} />;
      case 18: return <Slide18Shadow   key="s18" data={p.data} onChange={p.onChange} />;
      case 19: return <Slide19Gift     key="s19" data={p.data} onChange={p.onChange} />;
      case 20: return <Slide20Closing  key="s20" data={p.data} onChange={p.onChange} />;
      default: return null;
    }
  };

  const isLast = slide === TOTAL_SLIDES;
  const canContinue = isSlideValid(slide);

  return (
    <div className="max-w-2xl mx-auto">
      <IntakeProgress current={slide} total={TOTAL_SLIDES} />

      <div className="p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/10">
        <AnimatePresence mode="wait">
          {renderSlide()}
        </AnimatePresence>

        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
          >
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </motion.div>
        )}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
          <button
            type="button"
            onClick={handleBack}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              slide === 1
                ? 'opacity-0 pointer-events-none'
                : 'text-gray-400 hover:text-white border border-white/10 hover:border-white/30'
            }`}
          >
            Back
          </button>

          {!isLast ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canContinue}
              className="px-6 py-2.5 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#6330A0]/20 transition-all duration-300 hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: GRADIENTS.tertiaryCta }}
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#6330A0]/20 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: GRADIENTS.tertiaryCta }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send my profile'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
