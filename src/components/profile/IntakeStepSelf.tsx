'use client';

import { motion } from 'framer-motion';
import KeywordPicker from './intake-ui/KeywordPicker';
import PolaritySlider from './intake-ui/PolaritySlider';
import CardPicker from './intake-ui/CardPicker';
import type { IntakeFormData } from '@/types/intake';

const ACCENT = '#E84535';

const EMOTION_KEYWORDS = [
  // Light / active
  'electric', 'open', 'tender', 'steady', 'fluid', 'calibrated', 'present', 'alive',
  // Shadow / heavy
  'defended', 'stormy', 'flat', 'raw', 'reactive', 'numb', 'intense', 'disconnected',
];

const STRESS_PATTERNS = [
  {
    value: 'tightening',
    title: 'I hold tension',
    description: 'Shoulders, jaw, chest — the body grips.',
  },
  {
    value: 'collapse',
    title: 'I lose energy',
    description: 'I flatten out, go quiet, want to disappear.',
  },
  {
    value: 'restlessness',
    title: 'I can\'t stop moving',
    description: 'Pacing, scrolling, doing — anything to not sit still.',
  },
  {
    value: 'numbness',
    title: 'I disconnect',
    description: 'I go through motions but I\'m not really there.',
  },
];

interface Props {
  data: Pick<IntakeFormData,
    | 'self_emotions_keywords' | 'self_emotions_alive' | 'self_emotions_hard'
    | 'self_body_energy' | 'self_body_story' | 'self_body_stress'
    | 'self_mind_clarity' | 'self_mind_new_idea' | 'self_mind_drawn_toward'
  >;
  onChange: (field: string, value: string | string[] | number) => void;
}

const textarea = 'w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-200 resize-none text-sm leading-relaxed';

export default function IntakeStepSelf({ data, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      <div>
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT }} />
          <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Self</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          What&apos;s the state of your inner world?
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          This section is about your inner world — the state of your body, your emotions,
          and your mind. Answer from where you actually are, not where you want to be.
        </p>
      </div>

      {/* ── Tuned Emotions ─────────────────────────────────────────────────── */}
      <section className="space-y-5 pb-8 border-b border-white/5">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">Your emotional landscape</h3>
          <p className="text-xs text-gray-500">
            Select every word that tends to be true for you — don&apos;t overthink it.
            There are no good or bad words here.
          </p>
        </div>

        <KeywordPicker
          words={EMOTION_KEYWORDS}
          selected={data.self_emotions_keywords}
          onChange={(v) => onChange('self_emotions_keywords', v)}
          accent={ACCENT}
        />

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            Complete this sentence: <em>When I&apos;m most alive emotionally, I feel...</em>
          </label>
          <p className="text-xs text-gray-500">A sentence or two. Write like you&apos;re telling a friend.</p>
          <textarea
            rows={2}
            value={data.self_emotions_alive}
            onChange={(e) => onChange('self_emotions_alive', e.target.value)}
            placeholder="...a fierce kind of clarity, like I can see through everything"
            className={textarea}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            The emotion I have the hardest time sitting with:
          </label>
          <input
            type="text"
            value={data.self_emotions_hard}
            onChange={(e) => onChange('self_emotions_hard', e.target.value)}
            placeholder="e.g. shame, helplessness, grief, anger..."
            className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-200 text-sm"
          />
          <p className="text-xs text-gray-600">One word or a short phrase is enough.</p>
        </div>
      </section>

      {/* ── Focused Body ───────────────────────────────────────────────────── */}
      <section className="space-y-5 pb-8 border-b border-white/5">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">Your physical energy</h3>
          <p className="text-xs text-gray-500">How is your body showing up for you right now?</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-300">
            My physical energy, most days:
          </label>
          <PolaritySlider
            value={data.self_body_energy}
            onChange={(v) => onChange('self_body_energy', v)}
            labelLeft="Running on empty"
            labelRight="Fully charged"
            accent={ACCENT}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            Describe a recent moment when your body was completely awake — or completely depleted.
          </label>
          <p className="text-xs text-gray-500">
            A specific memory. 2-3 sentences. On mobile? Try dictating — it&apos;s faster and usually more honest.
          </p>
          <textarea
            rows={3}
            value={data.self_body_story}
            onChange={(e) => onChange('self_body_story', e.target.value)}
            placeholder="Yesterday during a three-hour work stretch I noticed..."
            className={textarea}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-300">
            When stress or pressure hits, my body&apos;s most reliable response:
          </label>
          <CardPicker
            options={STRESS_PATTERNS}
            selected={data.self_body_stress}
            onChange={(v) => onChange('self_body_stress', v)}
            accent={ACCENT}
            columns={2}
          />
        </div>
      </section>

      {/* ── Open Mind ──────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">Your mental state</h3>
          <p className="text-xs text-gray-500">How clear — or cluttered — is the channel?</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-300">
            My mental mode lately:
          </label>
          <PolaritySlider
            value={data.self_mind_clarity}
            onChange={(v) => onChange('self_mind_clarity', v)}
            labelLeft="Scattered and racing"
            labelRight="Clear and focused"
            accent={ACCENT}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            Tell me about the last time you had a genuinely new idea —
            or saw something you&apos;d seen a hundred times in a completely new way.
          </label>
          <p className="text-xs text-gray-500">2-3 sentences. What happened? What shifted?</p>
          <textarea
            rows={3}
            value={data.self_mind_new_idea}
            onChange={(e) => onChange('self_mind_new_idea', e.target.value)}
            placeholder="I was in the middle of a conversation when suddenly..."
            className={textarea}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            Right now, my mind keeps being pulled toward:
          </label>
          <input
            type="text"
            value={data.self_mind_drawn_toward}
            onChange={(e) => onChange('self_mind_drawn_toward', e.target.value)}
            placeholder="e.g. systems within systems, what makes people change, the relationship between silence and creativity..."
            className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-200 text-sm"
          />
        </div>
      </section>
    </motion.div>
  );
}
