'use client';

// The Transfer — /profile/workshop
// The short intake participants complete on their phones in the final minutes
// of a Flow Map Session. Mirrors the paper worksheet section-for-section
// (OFFERS/flow-map-session/web-intake-spec.md): welcome → four dimension
// screens (dial + optional line per key) → Your Map synthesis → done.

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { GRADIENTS, getPillarColor } from '@/styles/tokens';
import KeyDial from './intake-ui/KeyDial';
import { WORKSHOP_DIMENSIONS, WORKSHOP_KEY_IDS } from '@/types/workshop-intake';
import type {
  WorkshopDial,
  WorkshopIntakeStructured,
  WorkshopKeyId,
} from '@/types/workshop-intake';

// ─── Local form state ─────────────────────────────────────────────────────────

interface KeyState {
  dial: WorkshopDial | '';
  line: string;
}

type KeysState = Record<WorkshopKeyId, KeyState>;

const INITIAL_KEYS: KeysState = Object.fromEntries(
  WORKSHOP_KEY_IDS.map((id) => [id, { dial: '', line: '' }])
) as KeysState;

// Screens: 0 welcome · 1–4 dimensions · 5 Your Map · 6 done
const SECTIONS = [
  { label: 'Start', color: '#9ca3af' },
  { label: 'SELF', color: getPillarColor('self') },
  { label: 'SPACE', color: getPillarColor('space') },
  { label: 'STORY', color: getPillarColor('story') },
  { label: 'SPIRIT', color: getPillarColor('spirit') },
  { label: 'Your Map', color: '#e5e7eb' },
];

const INPUT_CLASS =
  'w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/25 focus:bg-white/[0.08] transition-all duration-200';

// ─── Progress rail ────────────────────────────────────────────────────────────

function ProgressRail({ screen }: { screen: number }) {
  return (
    <div className="mb-6">
      <div className="flex gap-1.5 mb-2">
        {SECTIONS.map((section, i) => (
          <div key={section.label} className="flex-1 h-1 rounded-full overflow-hidden bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{ background: section.color }}
              initial={false}
              animate={{ width: i < screen ? '100%' : i === screen ? '50%' : '0%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-600 tracking-wide">
        {screen + 1} of {SECTIONS.length} · {SECTIONS[screen].label}
      </p>
    </div>
  );
}

// ─── 12-key picker (Your Map) ─────────────────────────────────────────────────

function KeyPicker({
  value,
  onChange,
}: {
  value: WorkshopKeyId | '';
  onChange: (key: WorkshopKeyId) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {WORKSHOP_DIMENSIONS.flatMap((dim) =>
        dim.keys.map((key) => {
          const selected = value === key.id;
          const accent = getPillarColor(dim.id);
          return (
            <button
              key={key.id}
              type="button"
              onClick={() => onChange(key.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left text-sm transition-all duration-base ${
                selected
                  ? 'text-white'
                  : 'border-white/10 bg-white/[0.03] text-gray-400 hover:text-gray-200 hover:border-white/20'
              }`}
              style={
                selected
                  ? { background: `${accent}26`, borderColor: `${accent}99` }
                  : undefined
              }
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: accent }}
              />
              {key.name}
            </button>
          );
        })
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function WorkshopIntake() {
  const searchParams = useSearchParams();

  const [screen, setScreen] = useState(0);
  const [cohort, setCohort] = useState(searchParams.get('c') ?? '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [keys, setKeys] = useState<KeysState>(INITIAL_KEYS);
  const [carryingKey, setCarryingKey] = useState<WorkshopKeyId | ''>('');
  const [stuckKey, setStuckKey] = useState<WorkshopKeyId | ''>('');
  const [cascadeLine, setCascadeLine] = useState('');
  const [freeText, setFreeText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const setKey = (id: WorkshopKeyId, patch: Partial<KeyState>) =>
    setKeys((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const isScreenValid = (): boolean => {
    if (screen === 0) {
      return (
        cohort.trim().length > 0 &&
        name.trim().length > 0 &&
        /^\S+@\S+\.\S+$/.test(email.trim())
      );
    }
    if (screen >= 1 && screen <= 4) {
      return WORKSHOP_DIMENSIONS[screen - 1].keys.every((key) => keys[key.id].dial !== '');
    }
    if (screen === 5) {
      return carryingKey !== '' && stuckKey !== '';
    }
    return true;
  };

  const goTo = (next: number) => {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // carryingKey/stuckKey are validated non-empty before submit is reachable
      const intake: WorkshopIntakeStructured = {
        version: 'workshop-v1',
        cohort: cohort.trim().toUpperCase(),
        keys: Object.fromEntries(
          WORKSHOP_KEY_IDS.map((id) => [
            id,
            { dial: keys[id].dial as WorkshopDial, line: keys[id].line.trim() },
          ])
        ) as WorkshopIntakeStructured['keys'],
        carrying_key: carryingKey as WorkshopKeyId,
        stuck_key: stuckKey as WorkshopKeyId,
        cascade_line: cascadeLine.trim(),
        free_text: freeText.trim(),
      };

      let userId: string | undefined;
      try {
        const { data: { session } } = await getSupabaseBrowser().auth.getSession();
        userId = session?.user?.id;
      } catch {
        // anonymous submission — the room's default
      }

      const response = await fetch('/api/profile/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'workshop',
          name: name.trim(),
          email: email.trim(),
          cohort: cohort.trim().toUpperCase(),
          intake_structured: intake,
          ...(userId ? { user_id: userId } : {}),
        }),
      });

      const result = await response.json();
      if (result.success) {
        goTo(6);
      } else {
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Screen renderers ────────────────────────────────────────────────────────

  const renderWelcome = () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.25em] text-gray-500 uppercase mb-3">The Flow Map</p>
        <h1 className="text-3xl font-display font-bold italic text-white mb-2">
          Feed your map to us.
        </h1>
        <p className="text-sm text-gray-400">
          Copy your sheet, screen by screen. Under ten minutes — your Flow Profile
          lands in your inbox within 48 hours.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="ws-cohort" className="text-sm text-gray-400">Cohort code</label>
          <input
            id="ws-cohort"
            type="text"
            autoCapitalize="characters"
            autoComplete="off"
            value={cohort}
            onChange={(e) => setCohort(e.target.value)}
            placeholder="On the whiteboard"
            className={`${INPUT_CLASS} uppercase tracking-wider`}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="ws-name" className="text-sm text-gray-400">First name</label>
          <input
            id="ws-name"
            type="text"
            autoComplete="given-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            className={INPUT_CLASS}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="ws-email" className="text-sm text-gray-400">Email</label>
          <input
            id="ws-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <p className="text-xs text-gray-600">
        Your profile goes to this email and nowhere else.
      </p>
    </div>
  );

  const renderDimension = (dimIndex: number) => {
    const dim = WORKSHOP_DIMENSIONS[dimIndex];
    const accent = getPillarColor(dim.id);
    return (
      <div className="space-y-6">
        <div>
          <p
            className="text-xs tracking-[0.25em] uppercase mb-2 font-medium"
            style={{ color: accent }}
          >
            {dim.name} — {dim.subhead}
          </p>
          <h2 className="text-2xl font-display font-bold italic text-white">
            {dim.question}
          </h2>
        </div>

        <div className="space-y-4">
          {dim.keys.map((key) => (
            <div
              key={key.id}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3"
              style={{ borderLeft: `2px solid ${accent}66` }}
            >
              <p className="text-sm font-medium text-white">{key.name}</p>
              <KeyDial
                value={keys[key.id].dial}
                onChange={(dial) => setKey(key.id, { dial })}
                accent={accent}
              />
              <textarea
                rows={2}
                value={keys[key.id].line}
                onChange={(e) => setKey(key.id, { line: e.target.value })}
                placeholder={key.prompt}
                className={`${INPUT_CLASS} text-sm resize-none`}
              />
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-600">
          Dials are required. Lines are optional — the honest half-answer counts.
        </p>
      </div>
    );
  };

  const renderYourMap = () => (
    <div className="space-y-7">
      <div>
        <p className="text-xs tracking-[0.25em] text-gray-500 uppercase mb-2">Your Map</p>
        <h2 className="text-2xl font-display font-bold italic text-white">
          What did your own hand tell you?
        </h2>
      </div>

      <div className="space-y-2.5">
        <p className="text-sm text-white font-medium">The key that&apos;s carrying me</p>
        <p className="text-xs text-gray-500">Your engine — the most open.</p>
        <KeyPicker value={carryingKey} onChange={setCarryingKey} />
      </div>

      <div className="space-y-2.5">
        <p className="text-sm text-white font-medium">The key that&apos;s stuck</p>
        <p className="text-xs text-gray-500">
          If torn, it&apos;s the one that made you wince — not the one that scored lowest.
        </p>
        <KeyPicker value={stuckKey} onChange={setStuckKey} />
      </div>

      <div className="space-y-2.5">
        <p className="text-sm text-white font-medium">
          If my stuck key turned, the first thing that would change is…
        </p>
        <textarea
          rows={2}
          value={cascadeLine}
          onChange={(e) => setCascadeLine(e.target.value)}
          placeholder="One honest line"
          className={`${INPUT_CLASS} text-sm resize-none`}
        />
      </div>

      <div className="space-y-2.5">
        <p className="text-sm text-white font-medium">Anything your sheet doesn&apos;t capture?</p>
        <textarea
          rows={3}
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="Optional — anything you want your profile to know"
          className={`${INPUT_CLASS} text-sm resize-none`}
        />
      </div>
    </div>
  );

  const renderDone = () => (
    <div className="text-center py-10 space-y-6">
      <div
        className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
        style={{ background: GRADIENTS.tertiaryCta }}
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="space-y-3">
        <h2 className="text-3xl font-display font-bold italic text-white">
          Your map is in, {name.trim().split(' ')[0]}.
        </h2>
        <p className="text-gray-400 max-w-xs mx-auto">
          Your Flow Profile lands in your inbox within 48 hours. It&apos;s yours
          alone — nobody here sees it.
        </p>
      </div>
      <p className="text-xs text-gray-600">
        Tonight: give your stuck key ten deliberate minutes.
      </p>
    </div>
  );

  const renderScreen = () => {
    if (screen === 0) return renderWelcome();
    if (screen >= 1 && screen <= 4) return renderDimension(screen - 1);
    if (screen === 5) return renderYourMap();
    return renderDone();
  };

  const isDone = screen === 6;
  const isLast = screen === 5;
  const canContinue = isScreenValid();

  return (
    <div className="min-h-screen bg-ground">
      <div className="max-w-md mx-auto px-5 py-8">
        {!isDone && <ProgressRail screen={screen} />}

        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        {errorMessage && !isDone && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
          >
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </motion.div>
        )}

        {!isDone && (
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={() => goTo(screen - 1)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                screen === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'text-gray-400 hover:text-white border border-white/10 hover:border-white/30'
              }`}
            >
              Back
            </button>

            {!isLast ? (
              <button
                type="button"
                onClick={() => canContinue && goTo(screen + 1)}
                disabled={!canContinue}
                className="px-6 py-2.5 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-spirit/20 transition-all duration-300 hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: GRADIENTS.tertiaryCta }}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canContinue || isSubmitting}
                className="px-8 py-3 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-spirit/20 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: GRADIENTS.tertiaryCta }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending…
                  </span>
                ) : (
                  'Send my map'
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
