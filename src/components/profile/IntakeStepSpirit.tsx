'use client';

import { motion } from 'framer-motion';
import KeywordPicker from './intake-ui/KeywordPicker';
import type { IntakeFormData } from '@/types/intake';

const ACCENT = '#6330A0';

const VALUES_WORDS = [
  // Aspirational
  'Freedom', 'Truth', 'Beauty', 'Service', 'Mastery', 'Connection',
  'Courage', 'Integrity', 'Love', 'Wisdom', 'Creativity', 'Peace',
  'Excellence', 'Impact', 'Devotion', 'Authenticity', 'Joy', 'Justice',
  'Presence', 'Mystery', 'Discipline', 'Play', 'Wholeness', 'Power',
  // More specific / grounded
  'Depth', 'Precision', 'Warmth', 'Wildness', 'Clarity', 'Sovereignty',
  'Loyalty', 'Curiosity', 'Directness', 'Gentleness', 'Rigor', 'Ease',
];

interface Props {
  data: Pick<IntakeFormData,
    | 'spirit_values_selected' | 'spirit_values_in_action'
    | 'spirit_curiosity_flow_memory' | 'spirit_curiosity_intersection' | 'spirit_curiosity_invisibility'
    | 'spirit_vision_image' | 'spirit_vision_peak' | 'spirit_vision_legacy'
  >;
  onChange: (field: string, value: string | string[]) => void;
}

const input = 'w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-200 text-sm';
const textarea = `${input} resize-none leading-relaxed`;

export default function IntakeStepSpirit({ data, onChange }: Props) {
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
          <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Spirit</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          What is always true for you?
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Beneath the changing circumstances — your values, your deepest curiosity,
          the vision you keep returning to even when you try to let it go.
        </p>
      </div>

      {/* ── Grounding Values ──────────────────────────────────────────────── */}
      <section className="space-y-5 pb-8 border-b border-white/5">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">What anchors you</h3>
          <p className="text-xs text-gray-500">
            Select 5-7 words that feel like <em>you</em> — not what you aspire to, but what you already are.
            If you&apos;re unsure, go with what you&apos;d feel most betrayed by losing.
          </p>
        </div>

        <KeywordPicker
          words={VALUES_WORDS}
          selected={data.spirit_values_selected}
          onChange={(v) => onChange('spirit_values_selected', v)}
          accent={ACCENT}
          max={9}
        />
        {data.spirit_values_selected.length > 0 && (
          <p className="text-xs text-gray-600">
            {data.spirit_values_selected.length} selected
            {data.spirit_values_selected.length < 5 ? ' — try to select at least 5' : ''}
          </p>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            Describe a recent moment when you were fully living one of those values.
          </label>
          <p className="text-xs text-gray-500">Something specific — even small.</p>
          <textarea
            rows={3}
            value={data.spirit_values_in_action}
            onChange={(e) => onChange('spirit_values_in_action', e.target.value)}
            placeholder="Last week I turned down something that looked good on paper because it didn't feel honest, and I felt..."
            className={textarea}
          />
        </div>
      </section>

      {/* ── Ignited Curiosity ─────────────────────────────────────────────── */}
      <section className="space-y-5 pb-8 border-b border-white/5">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">What lights you up</h3>
          <p className="text-xs text-gray-500">
            Not your productivity. The thing that makes you forget to eat.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            Tell me about a time you lost track of time completely — totally absorbed in something you love.
            What were you doing?
          </label>
          <p className="text-xs text-gray-500">
            3-5 sentences. Be specific. On mobile, try voice-to-text for this one — it tends to unlock more detail.
          </p>
          <textarea
            rows={4}
            value={data.spirit_curiosity_flow_memory}
            onChange={(e) => onChange('spirit_curiosity_flow_memory', e.target.value)}
            placeholder="I was deep in a conversation about how ancient trade routes shaped language, and suddenly four hours had passed..."
            className={textarea}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            The intersection I keep returning to:
          </label>
          <p className="text-xs text-gray-500">
            The place two or more of your interests meet. The thing only you seem to care about in quite this way.
          </p>
          <input
            type="text"
            value={data.spirit_curiosity_intersection}
            onChange={(e) => onChange('spirit_curiosity_intersection', e.target.value)}
            placeholder="e.g. &quot;consciousness and architecture&quot; / &quot;movement and meaning&quot; / &quot;language and power&quot;"
            className={input}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            What would you work on if no one would ever know you did it?
          </label>
          <p className="text-xs text-gray-500">No credit, no recognition, no proof it happened. What would still pull you?</p>
          <textarea
            rows={2}
            value={data.spirit_curiosity_invisibility}
            onChange={(e) => onChange('spirit_curiosity_invisibility', e.target.value)}
            placeholder="Honestly? I'd probably spend my time..."
            className={textarea}
          />
        </div>
      </section>

      {/* ── Visualized Vision ─────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">Where you&apos;re headed</h3>
          <p className="text-xs text-gray-500">
            The vision that persists — even when you try to be practical about it.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            Describe the moment you felt most yourself — most alive, most real, most clear.
          </label>
          <p className="text-xs text-gray-500">A peak experience. It could be recent or from years ago. What was happening?</p>
          <textarea
            rows={4}
            value={data.spirit_vision_peak}
            onChange={(e) => onChange('spirit_vision_peak', e.target.value)}
            placeholder="There was a moment standing at the edge of..."
            className={textarea}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            Give your most aligned future self a title or image.
          </label>
          <p className="text-xs text-gray-500">
            5 years from now — fully in flow, fully yourself. What do you see? A phrase, an image, a sentence.
          </p>
          <input
            type="text"
            value={data.spirit_vision_image}
            onChange={(e) => onChange('spirit_vision_image', e.target.value)}
            placeholder="e.g. &quot;The Quiet Authority&quot; / &quot;Standing in a room full of people who built something real&quot;"
            className={input}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            What do you want to be known for — in one sentence?
          </label>
          <input
            type="text"
            maxLength={120}
            value={data.spirit_vision_legacy}
            onChange={(e) => onChange('spirit_vision_legacy', e.target.value)}
            placeholder="She helped people see what they couldn't see on their own..."
            className={input}
          />
        </div>
      </section>
    </motion.div>
  );
}
