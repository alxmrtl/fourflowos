'use client';

import { motion } from 'framer-motion';
import KeywordPicker from './intake-ui/KeywordPicker';
import CardPicker from './intake-ui/CardPicker';
import type { IntakeFormData } from '@/types/intake';

const ACCENT = '#4E8C73';

const ENVIRONMENT_OPTIONS = [
  {
    value: 'sanctuary',
    title: 'A sanctuary I\'ve designed',
    description: 'Intentional. Supports how I work and rest.',
  },
  {
    value: 'functional',
    title: 'Functional but not inspiring',
    description: 'Gets the job done — but it doesn\'t light anything up.',
  },
  {
    value: 'chaotic',
    title: 'Chaotic and depleting',
    description: 'I fight my environment more than I work with it.',
  },
  {
    value: 'unexamined',
    title: 'Works somehow — but unexamined',
    description: 'I\'ve never really thought about it. It just is what it is.',
  },
];

const FEEDBACK_OPTIONS = [
  {
    value: 'internal',
    title: 'Internal compass',
    description: 'Something shifts inside — I just know.',
  },
  {
    value: 'external',
    title: 'Others reflect it back',
    description: 'I need someone I respect to confirm it.',
  },
  {
    value: 'data',
    title: 'Data and metrics',
    description: 'Numbers or visible results tell me.',
  },
  {
    value: 'embodied',
    title: 'My body tells me',
    description: 'Something relaxes — or tightens — and that tells me everything.',
  },
];

const TOOLS_KEYWORDS = [
  'strategic', 'minimalist', 'ritualistic', 'adaptive', 'layered',
  'improvised', 'overwhelmed', 'scattered', 'resistant', 'reactive',
];

interface Props {
  data: Pick<IntakeFormData,
    | 'space_environment_feel' | 'space_environment_story' | 'space_environment_gap'
    | 'space_tools_keywords' | 'space_tools_story'
    | 'space_feedback_channel' | 'space_feedback_story'
  >;
  onChange: (field: string, value: string | string[]) => void;
}

const textarea = 'w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-200 resize-none text-sm leading-relaxed';

export default function IntakeStepSpace({ data, onChange }: Props) {
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
          <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Space</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Is your environment working with you?
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          The spaces we occupy, the systems we use, the way we get feedback —
          these either support your best work or quietly drain it.
        </p>
      </div>

      {/* ── Intentional Space ─────────────────────────────────────────────── */}
      <section className="space-y-5 pb-8 border-b border-white/5">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">Your physical spaces</h3>
          <p className="text-xs text-gray-500">
            Think about where you work, rest, and create.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-300">
            My physical spaces tend to feel like:
          </label>
          <CardPicker
            options={ENVIRONMENT_OPTIONS}
            selected={data.space_environment_feel}
            onChange={(v) => onChange('space_environment_feel', v)}
            accent={ACCENT}
            columns={2}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            Describe the physical place where you feel most fully yourself.
          </label>
          <p className="text-xs text-gray-500">
            It could be real or imagined. What&apos;s in it? What does it feel like?
          </p>
          <textarea
            rows={3}
            value={data.space_environment_story}
            onChange={(e) => onChange('space_environment_story', e.target.value)}
            placeholder="There's a corner of my apartment with a specific lamp..."
            className={textarea}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            The gap between the space I have and the space I want is:
          </label>
          <input
            type="text"
            value={data.space_environment_gap}
            onChange={(e) => onChange('space_environment_gap', e.target.value)}
            placeholder="e.g. mostly about noise / about ownership / about clarity of purpose..."
            className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-200 text-sm"
          />
        </div>
      </section>

      {/* ── Optimized Tools ───────────────────────────────────────────────── */}
      <section className="space-y-5 pb-8 border-b border-white/5">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">Your tools and systems</h3>
          <p className="text-xs text-gray-500">
            How you organize your work, your time, and your attention.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-300">
            My relationship to systems, tools, and routines (select all that feel true):
          </label>
          <KeywordPicker
            words={TOOLS_KEYWORDS}
            selected={data.space_tools_keywords}
            onChange={(v) => onChange('space_tools_keywords', v)}
            accent={ACCENT}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            Name the one system, habit, or tool you rely on most. What does it actually give you?
          </label>
          <p className="text-xs text-gray-500">Could be a morning walk, a notebook, a specific app, a ritual. What&apos;s the real payoff?</p>
          <textarea
            rows={3}
            value={data.space_tools_story}
            onChange={(e) => onChange('space_tools_story', e.target.value)}
            placeholder="My daily voice memo habit gives me..."
            className={textarea}
          />
        </div>
      </section>

      {/* ── Feedback Systems ──────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">How you know what&apos;s working</h3>
          <p className="text-xs text-gray-500">
            Feedback loops — how signal gets back to you.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-300">
            I know I&apos;m on the right track when:
          </label>
          <CardPicker
            options={FEEDBACK_OPTIONS}
            selected={data.space_feedback_channel}
            onChange={(v) => onChange('space_feedback_channel', v)}
            accent={ACCENT}
            columns={2}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            Tell me about a recent moment when you got clear feedback — from any source —
            that you were on the right path. Or the wrong one.
          </label>
          <p className="text-xs text-gray-500">2-3 sentences. What happened? What did you feel?</p>
          <textarea
            rows={3}
            value={data.space_feedback_story}
            onChange={(e) => onChange('space_feedback_story', e.target.value)}
            placeholder="A few weeks ago someone said something that made me realize..."
            className={textarea}
          />
        </div>
      </section>
    </motion.div>
  );
}
