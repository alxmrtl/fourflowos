'use client';

import { motion } from 'framer-motion';
import CardPicker from './intake-ui/CardPicker';
import ForcedChoicePair from './intake-ui/ForcedChoicePair';
import type { IntakeFormData } from '@/types/intake';

const ACCENT = '#3E6FA3';

const ARC_OPTIONS = [
  {
    value: 'heros-journey',
    title: 'The Hero\'s Journey',
    description: 'Called out, tested, transformed, returned.',
  },
  {
    value: 'return',
    title: 'The Return',
    description: 'I left something. Now I\'m finding my way back.',
  },
  {
    value: 'initiation',
    title: 'The Initiation',
    description: 'Something is breaking me open. I\'m changing in ways I can\'t yet name.',
  },
  {
    value: 'long-becoming',
    title: 'The Long Becoming',
    description: 'Slow, patient, underground. Something is growing that isn\'t visible yet.',
  },
  {
    value: 'fall-and-rise',
    title: 'The Fall and Rise',
    description: 'I lost something real. I\'m rebuilding from the foundation.',
  },
  {
    value: 'revolution',
    title: 'The Revolution',
    description: 'I\'m breaking away from what I was. The old story isn\'t mine anymore.',
  },
  {
    value: 'devotion',
    title: 'The Devotion',
    description: 'I found the thing I\'m for. Now it\'s about showing up, over and over.',
  },
  {
    value: 'witness',
    title: 'The Witness',
    description: 'I\'m watching, learning, gathering. Not yet ready to act — but paying attention.',
  },
];

const CLARITY_OPTIONS = [
  {
    value: 'clear',
    title: 'Crystal clear and energizing',
    description: 'I know what I\'m doing and why. It pulls me forward.',
  },
  {
    value: 'forming',
    title: 'Getting clearer — still forming',
    description: 'I have a sense of direction but it\'s still taking shape.',
  },
  {
    value: 'fuzzy',
    title: 'Fuzzy and a little draining',
    description: 'I\'m doing a lot but I\'m not sure it\'s adding up to something.',
  },
  {
    value: 'unarticulated',
    title: 'I haven\'t put it into words yet',
    description: 'Something pulls at me — but I haven\'t named it.',
  },
];

interface Props {
  data: Pick<IntakeFormData,
    | 'story_narrative_last5' | 'story_narrative_next5' | 'story_narrative_arc'
    | 'story_mission_completion' | 'story_mission_clarity' | 'story_mission_distraction'
    | 'story_role_pair1' | 'story_role_pair2' | 'story_role_pair3' | 'story_role_pair4'
    | 'story_role_story'
  >;
  onChange: (field: string, value: string) => void;
}

const input = 'w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-200 text-sm';
const textarea = `${input} resize-none leading-relaxed`;

export default function IntakeStepStory({ data, onChange }: Props) {
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
          <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Story</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Where are you in the arc?
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          The story you tell about your life shapes what&apos;s available to you.
          This section maps the narrative, the mission, and the role you naturally occupy.
        </p>
      </div>

      {/* ── Generative Story ──────────────────────────────────────────────── */}
      <section className="space-y-5 pb-8 border-b border-white/5">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">Your narrative arc</h3>
          <p className="text-xs text-gray-500">
            The titles you give things reveal more than the events themselves.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm text-gray-300">The last 5 years — give them a title:</label>
            <input
              type="text"
              maxLength={60}
              value={data.story_narrative_last5}
              onChange={(e) => onChange('story_narrative_last5', e.target.value)}
              placeholder="e.g. &quot;The Long Winter&quot;"
              className={input}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-gray-300">The next 5 years — title them too:</label>
            <input
              type="text"
              maxLength={60}
              value={data.story_narrative_next5}
              onChange={(e) => onChange('story_narrative_next5', e.target.value)}
              placeholder="e.g. &quot;Learning to Want Things Again&quot;"
              className={input}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-300">
            The arc of your life right now most closely resembles:
          </label>
          <p className="text-xs text-gray-500">Pick the one that feels most alive — not the most flattering.</p>
          <div className="grid grid-cols-2 gap-2">
            {ARC_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('story_narrative_arc', opt.value)}
                className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                  data.story_narrative_arc === opt.value
                    ? 'text-white'
                    : 'bg-white/[0.03] border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300'
                }`}
                style={
                  data.story_narrative_arc === opt.value
                    ? { backgroundColor: ACCENT + '1A', borderColor: ACCENT + '55' }
                    : {}
                }
              >
                <div className="text-xs font-semibold mb-0.5"
                  style={data.story_narrative_arc === opt.value ? { color: '#fff' } : {}}>
                  {opt.title}
                </div>
                <div className="text-xs text-gray-500 leading-snug">{opt.description}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clear Mission ─────────────────────────────────────────────────── */}
      <section className="space-y-5 pb-8 border-b border-white/5">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">Your mission</h3>
          <p className="text-xs text-gray-500">
            Not the polished version — the raw one. What actually pulls you?
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            Complete this sentence: <em>I exist to...</em>
          </label>
          <p className="text-xs text-gray-500">One sentence. 20 words or fewer. Don&apos;t try to make it sound impressive.</p>
          <input
            type="text"
            maxLength={120}
            value={data.story_mission_completion}
            onChange={(e) => onChange('story_mission_completion', e.target.value)}
            placeholder="...help people recognize what they already know..."
            className={input}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-300">
            How clear does your current mission feel?
          </label>
          <CardPicker
            options={CLARITY_OPTIONS}
            selected={data.story_mission_clarity}
            onChange={(v) => onChange('story_mission_clarity', v)}
            accent={ACCENT}
            columns={2}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            The thing that most consistently pulls me away from what matters:
          </label>
          <input
            type="text"
            value={data.story_mission_distraction}
            onChange={(e) => onChange('story_mission_distraction', e.target.value)}
            placeholder="e.g. other people's urgency / fear of being judged / not knowing where to start..."
            className={input}
          />
        </div>
      </section>

      {/* ── Empowered Role ────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">The role you naturally occupy</h3>
          <p className="text-xs text-gray-500">
            Four quick picks. Choose the one that feels more <em>like you</em> — not the better option.
            Both are equally valuable. These just reveal your natural tendency.
          </p>
        </div>

        <div className="space-y-3">
          <ForcedChoicePair
            optionA={{ value: 'architect', label: 'Architect', description: 'I design the system.' }}
            optionB={{ value: 'builder', label: 'Builder', description: 'I make it real.' }}
            selected={data.story_role_pair1}
            onChange={(v) => onChange('story_role_pair1', v)}
            accent={ACCENT}
          />
          <ForcedChoicePair
            optionA={{ value: 'pioneer', label: 'Pioneer', description: 'I go first.' }}
            optionB={{ value: 'integrator', label: 'Integrator', description: 'I bring it together.' }}
            selected={data.story_role_pair2}
            onChange={(v) => onChange('story_role_pair2', v)}
            accent={ACCENT}
          />
          <ForcedChoicePair
            optionA={{ value: 'independent', label: 'Independent', description: 'I need autonomy to do my best work.' }}
            optionB={{ value: 'collaborative', label: 'Collaborative', description: 'I need the energy of others.' }}
            selected={data.story_role_pair3}
            onChange={(v) => onChange('story_role_pair3', v)}
            accent={ACCENT}
          />
          <ForcedChoicePair
            optionA={{ value: 'teacher', label: 'Teacher', description: 'I transmit what I know.' }}
            optionB={{ value: 'student', label: 'Student', description: 'I absorb what I don\'t yet understand.' }}
            selected={data.story_role_pair4}
            onChange={(v) => onChange('story_role_pair4', v)}
            accent={ACCENT}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-gray-300">
            When do you feel most empowered in your work? What&apos;s actually happening in those moments?
          </label>
          <textarea
            rows={3}
            value={data.story_role_story}
            onChange={(e) => onChange('story_role_story', e.target.value)}
            placeholder="When I'm leading without a script, something just opens up..."
            className={textarea}
          />
        </div>
      </section>
    </motion.div>
  );
}
