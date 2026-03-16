'use client';

import { motion } from 'framer-motion';
import type { IntakeFormData } from '@/types/intake';

interface Props {
  data: Pick<IntakeFormData,
    | 'soul_myth_character' | 'soul_myth_quality'
    | 'soul_fairy_tale_childhood' | 'soul_fairy_tale_now'
    | 'soul_shadow_projection'
    | 'soul_nadir_story' | 'soul_turning_point'
    | 'soul_gift' | 'soul_hidden_self' | 'soul_word'
    | 'soul_closing_stem'
  >;
  onChange: (field: string, value: string) => void;
}

const input = 'w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-200 text-sm';
const textarea = `${input} resize-none leading-relaxed`;

export default function IntakeStepSoulSignature({ data, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          One final layer.
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          These questions work differently from the ones before. They&apos;re not asking you to analyze yourself —
          just to respond. Trust the first thing that comes. There are no wrong answers here,
          only honest ones and cautious ones. Go with honest.
        </p>
      </div>

      {/* ── Myth resonance ────────────────────────────────────────────────── */}
      <section className="space-y-5 pb-8 border-b border-white/5">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">The story you live inside</h3>
          <p className="text-xs text-gray-500">
            Think of any character from a story — a novel, film, fairy tale, mythology, history.
            Someone you find yourself drawn to or who feels strangely familiar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm text-gray-300">The character you most identify with:</label>
            <input
              type="text"
              value={data.soul_myth_character}
              onChange={(e) => onChange('soul_myth_character', e.target.value)}
              placeholder="e.g. Frodo / Athena / Tesla / Elizabeth Bennet..."
              className={input}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-gray-300">The quality you most admire in them:</label>
            <input
              type="text"
              value={data.soul_myth_quality}
              onChange={(e) => onChange('soul_myth_quality', e.target.value)}
              placeholder="e.g. She keeps going when everyone else gives up..."
              className={input}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            A story — fairy tale, myth, film, novel — that felt most true to your life as a child:
          </label>
          <input
            type="text"
            value={data.soul_fairy_tale_childhood}
            onChange={(e) => onChange('soul_fairy_tale_childhood', e.target.value)}
            placeholder="e.g. The Ugly Duckling / The Little Prince / something else entirely..."
            className={input}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            Which story resonates most with you now?
          </label>
          <p className="text-xs text-gray-500">It might be different. It often is.</p>
          <input
            type="text"
            value={data.soul_fairy_tale_now}
            onChange={(e) => onChange('soul_fairy_tale_now', e.target.value)}
            placeholder="e.g. The Alchemist / Alchemy / something you can't quite name..."
            className={input}
          />
        </div>
      </section>

      {/* ── Shadow + Turning points ───────────────────────────────────────── */}
      <section className="space-y-5 pb-8 border-b border-white/5">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">The shadow and the turning</h3>
          <p className="text-xs text-gray-500">
            Research in depth psychology consistently shows: what irritates us most in others is often
            something we haven&apos;t yet owned in ourselves. Not a flaw — a disowned strength.
            Answer quickly, before your inner editor wakes up.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            The thing that frustrates you most in other people:
          </label>
          <input
            type="text"
            value={data.soul_shadow_projection}
            onChange={(e) => onChange('soul_shadow_projection', e.target.value)}
            placeholder="e.g. when people waste their gifts / when someone knows the truth and stays quiet..."
            className={input}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            Describe the moment that cost you the most — your darkest chapter.
          </label>
          <p className="text-xs text-gray-500">
            You don&apos;t need to explain or justify. Just describe what happened and what it felt like.
            This is confidential and handled with care. You can also skip this one if it doesn&apos;t feel right.
          </p>
          <textarea
            rows={4}
            value={data.soul_nadir_story}
            onChange={(e) => onChange('soul_nadir_story', e.target.value)}
            placeholder="There was a period when..."
            className={textarea}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            Describe a moment where your understanding of yourself fundamentally changed.
          </label>
          <p className="text-xs text-gray-500">A turning point. Before it, you were one person. After, someone slightly different.</p>
          <textarea
            rows={3}
            value={data.soul_turning_point}
            onChange={(e) => onChange('soul_turning_point', e.target.value)}
            placeholder="I realized something I couldn't unrealize when..."
            className={textarea}
          />
        </div>
      </section>

      {/* ── Gift + Hidden self + Soul word ────────────────────────────────── */}
      <section className="space-y-5 pb-8 border-b border-white/5">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">Your particular gift</h3>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            My deepest gift — the thing I give effortlessly that others struggle with:
          </label>
          <p className="text-xs text-gray-500">
            Not your credential. Not your job title. The thing people come to you for that you do naturally,
            sometimes without realizing it&apos;s rare.
          </p>
          <input
            type="text"
            value={data.soul_gift}
            onChange={(e) => onChange('soul_gift', e.target.value)}
            placeholder="e.g. translating what people feel into words they can use..."
            className={input}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            What most people don&apos;t see about me that I wish they did:
          </label>
          <textarea
            rows={2}
            value={data.soul_hidden_self}
            onChange={(e) => onChange('soul_hidden_self', e.target.value)}
            placeholder="That I'm actually..."
            className={textarea}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            If your soul had a sound, a color, or an element — what&apos;s the first thing that comes to mind?
          </label>
          <p className="text-xs text-gray-500">Don&apos;t think about this. Just answer.</p>
          <input
            type="text"
            value={data.soul_word}
            onChange={(e) => onChange('soul_word', e.target.value)}
            placeholder="e.g. deep blue / a cello held in a stone church / iron / the moment before lightning..."
            className={input}
          />
        </div>
      </section>

      {/* ── Closing stem ──────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
          <label className="block text-sm font-medium text-white mb-3">
            The thing I most want someone who truly understands me to know is:
          </label>
          <p className="text-xs text-gray-500 mb-3">
            This is the last question. Write what wants to come out — not what sounds good.
          </p>
          <textarea
            rows={4}
            value={data.soul_closing_stem}
            onChange={(e) => onChange('soul_closing_stem', e.target.value)}
            placeholder="..."
            className={textarea}
          />
        </div>
      </section>
    </motion.div>
  );
}
