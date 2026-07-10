'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import { CORAL, SAGE, STEEL, AMETHYST, GRADIENTS } from '@/styles/brand-colors';

/**
 * The Flow Map Session — offer page.
 * Register: pitched buyer, flavored seeker (OFFERS/flow-map-session/OFFER.md).
 * Recognition before vocabulary; descriptive of value, never salesy.
 * Pricing: by conversation (ratified Jul 9, 2026 decision — no numbers on-page).
 */

const NEUTRAL = 'rgba(255,255,255,0.28)';

// The 120-minute arc, from session-design.md's timing map. Widths are real minutes.
const ARC: { label: string; min: number; color: string; note: string }[] = [
  { label: 'Opening', min: 12, color: NEUTRAL, note: 'The contract with the room: twelve conditions, one at a time. Write one honest line, mark one dial. Nobody reads your sheet.' },
  { label: 'Self', min: 17, color: CORAL, note: 'Your state — are you actually available for this work? Everything in this block is checkable from your chair.' },
  { label: 'Space', min: 16, color: SAGE, note: 'Your setup — is your environment working for you, or are you working around it?' },
  { label: 'Break', min: 5, color: 'rgba(255,255,255,0.12)', note: 'Five minutes. Stand up. Notice what your body does with them.' },
  { label: 'Story', min: 16, color: STEEL, note: 'Your arc — do you know where you’re going, and do you own the journey?' },
  { label: 'Spirit', min: 18, color: AMETHYST, note: 'Your why — the deepest questions land last, with room to breathe.' },
  { label: 'Your Map', min: 13, color: 'rgba(255,255,255,0.45)', note: 'Read your own sheet. Circle the condition carrying you, and the one that’s stuck — your bottleneck.' },
  { label: 'The Transfer', min: 13, color: 'rgba(255,255,255,0.35)', note: 'Phones out, ten minutes: your sheet goes in, and within 48 hours your Flow Profile comes back.' },
  { label: 'Close', min: 5, color: 'rgba(255,255,255,0.2)', note: 'One thing to try tonight: give your stuck condition ten deliberate minutes.' },
];
const ARC_TOTAL = ARC.reduce((s, b) => s + b.min, 0);

const DIMENSIONS = [
  {
    label: 'SELF', sub: 'Your State', color: CORAL,
    question: 'Are you actually available for this work?',
    keys: [
      { name: 'Tuned Emotions', icon: '/assets/LOGOS/TUNED EMOTIONS.png' },
      { name: 'Focused Body', icon: '/assets/LOGOS/FOCUSED BODY.png' },
      { name: 'Open Mind', icon: '/assets/LOGOS/OPEN MIND.png' },
    ],
    samplePrompt: '“When you’re stuck, what does your body do — move, tense up, reach for the phone?”',
  },
  {
    label: 'SPACE', sub: 'Your Setup', color: SAGE,
    question: 'Is your environment working for you, or are you working around it?',
    keys: [
      { name: 'Intentional Space', icon: '/assets/LOGOS/INTENTIONAL SPACE.png' },
      { name: 'Optimized Tools', icon: '/assets/LOGOS/OPTIMIZED TOOLS.png' },
      { name: 'Feedback Systems', icon: '/assets/LOGOS/FEEDBACK SYSTEMS.png' },
    ],
    samplePrompt: '“How do you know your work is working — same week, or same quarter?”',
  },
  {
    label: 'STORY', sub: 'Your Arc', color: STEEL,
    question: 'Do you know where you’re going, and do you own the journey?',
    keys: [
      { name: 'Generative Story', icon: '/assets/LOGOS/GENERATIVE STORY.png' },
      { name: 'Clear Mission', icon: '/assets/LOGOS/CLEAR MISSION.png' },
      { name: 'Empowered Role', icon: '/assets/LOGOS/EMPOWERED ROLE.png' },
    ],
    samplePrompt: '“What are you actually building right now — this month, not the dream?”',
  },
  {
    label: 'SPIRIT', sub: 'Your Why', color: AMETHYST,
    question: 'Is there something real beneath the arc that makes it worth doing?',
    keys: [
      { name: 'Grounding Values', icon: '/assets/LOGOS/GROUNDING VALUES.png' },
      { name: 'Ignited Curiosity', icon: '/assets/LOGOS/IGNITED CURIOSITY.png' },
      { name: 'Visualized Vision', icon: '/assets/LOGOS/VISUALIZED VISION.png' },
    ],
    samplePrompt: '“What do you lose track of time doing? When did that last happen at work?”',
  },
];

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function Eyebrow({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color }}>
      {children}
    </p>
  );
}

/** The dial — the worksheet's recurring mark, shown once. */
function Dial() {
  const positions = [
    { label: 'Stuck', gloss: 'it’s costing you', angle: 180 },
    { label: 'Turning', gloss: 'workable, in motion', angle: 240 },
    { label: 'Open', gloss: 'it carries you', angle: 300 },
  ];
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3">
      {positions.map((p) => (
        <div key={p.label} className="flex items-center gap-3">
          <span className="relative inline-block w-7 h-7 rounded-full border border-white/50">
            <span
              className="absolute left-1/2 top-1/2 w-[1.5px] h-[11px] bg-white/70 origin-top"
              style={{ transform: `translateX(-50%) rotate(${p.angle}deg)` }}
            />
          </span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-white">{p.label}</span>
            <span className="block font-display italic text-sm text-gray-400">{p.gloss}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/** The paper Flow Map, previewed: ivory artifact on the dark ground. */
function WorksheetPreview() {
  return (
    <div
      className="rounded-xl px-6 py-5 w-full max-w-[340px] shadow-2xl"
      style={{ background: '#F7F4EE', transform: 'rotate(-1.25deg)' }}
      aria-hidden
    >
      <p className="font-display text-[19px] tracking-[0.08em] text-center" style={{ color: '#333' }}>
        THE FLOW MAP
      </p>
      <div className="h-[2px] rounded-full mx-auto mt-1.5 mb-1 w-28" style={{ background: GRADIENTS.fourPillar }} />
      <p className="font-display italic text-[12px] text-center mb-3" style={{ color: 'rgba(51,51,51,0.65)' }}>
        Twelve conditions. One map. Yours.
      </p>
      {[
        { color: '#FF6F61', name: 'SELF · YOUR STATE' },
        { color: '#6BA292', name: 'SPACE · YOUR SETUP' },
        { color: '#5B84B1', name: 'STORY · YOUR ARC' },
        { color: '#7A4DA4', name: 'SPIRIT · YOUR WHY' },
      ].map((band) => (
        <div key={band.name} className="pl-2.5 py-1.5" style={{ borderLeft: `2.5px solid ${band.color}` }}>
          <p className="text-[7px] font-bold uppercase tracking-[0.18em]" style={{ color: band.color }}>
            {band.name}
          </p>
          {[0, 1].map((row) => (
            <div key={row} className="flex items-center gap-2 py-[4px]">
              <span className="h-px flex-1" style={{ background: 'rgba(51,51,51,0.3)' }} />
              {[0, 1, 2].map((d) => (
                <span key={d} className="w-2 h-2 rounded-full" style={{ border: '1px solid rgba(51,51,51,0.55)' }} />
              ))}
            </div>
          ))}
        </div>
      ))}
      <p className="mt-2 text-[7.5px] uppercase tracking-[0.16em] text-center" style={{ color: 'rgba(51,51,51,0.5)' }}>
        11&times;17 &middot; unfolds like a map &middot; yours to keep
      </p>
    </div>
  );
}

export default function FlowMapSessionPage() {
  return (
    <PageLayout accentColor={CORAL}>
      {/* ── Hero ── */}
      <section className="relative pt-14 md:pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Eyebrow color={CORAL}>The Flow Map Session</Eyebrow>
          </motion.div>
          <motion.h1
            className="font-display text-5xl md:text-6xl text-white leading-[1.08] mb-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            Everyone leaves with{' '}
            <span
              className="bg-gradient-to-r bg-clip-text text-transparent"
              style={{ backgroundImage: GRADIENTS.textWide }}
            >
              their own map.
            </span>
          </motion.h1>
          <motion.p
            className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            One facilitated session, 90–120 minutes, for teams of five to twenty.
            Each person finds the specific condition blocking their best work —
            not a personality type. A diagnosis they can act on Monday.
          </motion.p>
        </div>
      </section>

      {/* ── The problem (mirror) ── */}
      <Section className="pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="border-l-2 pl-6 md:pl-8" style={{ borderColor: CORAL }}>
            <p className="font-display text-2xl md:text-[28px] text-white/90 leading-snug mb-5">
              Most team investments treat the team as one thing.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              But the reason output is flat is different for each person. One is
              running on a setup that fights them. Another has lost the thread of
              what they&apos;re building toward. Another is simply never
              not-interrupted. A survey averages those people into a score; an
              offsite gives them one shared afternoon. Neither tells any of them
              what to change.
            </p>
            <p className="text-gray-400 leading-relaxed">
              The Flow Map Session gives each person their own diagnosis: the
              condition most blocking their best work, and the first thing to
              change — made with their own hand, on paper they keep.
            </p>
          </div>
        </div>
      </Section>

      {/* ── How it works: the arc ── */}
      <Section className="pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <Eyebrow color={SAGE}>What happens in the room</Eyebrow>
            <h2 className="font-display text-4xl text-white mb-3">One rhythm, twelve times</h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              The facilitator walks the twelve conditions in four blocks. Each one
              gets the same three beats: it&apos;s named, it&apos;s shown, and then —
              sixty seconds, pens down after — you mark where you stand. One honest
              written line, one dial. Nobody is ever asked to share what they wrote.
            </p>
          </div>

          {/* The 120-minute band — widths are the session's real minutes */}
          <div className="mb-2 flex h-9 rounded-lg overflow-hidden" role="img" aria-label="The session's 120-minute arc, block by block">
            {ARC.map((b) => (
              <div
                key={b.label}
                className="h-full transition-opacity duration-200 hover:opacity-80"
                style={{ width: `${(b.min / ARC_TOTAL) * 100}%`, background: b.color }}
                title={`${b.label} — ${b.min} min`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-[0.16em] text-gray-600 mb-8">
            <span>Minute 0</span>
            <span>Minute 120</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
            {ARC.map((b) => (
              <div key={b.label} className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full mt-[5px] flex-shrink-0" style={{ background: b.color }} />
                <div>
                  <p className="text-sm text-white font-medium">
                    {b.label} <span className="text-gray-600 font-normal">· {b.min} min</span>
                  </p>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{b.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── The twelve conditions ── */}
      <Section className="pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <Eyebrow color={STEEL}>The map itself</Eyebrow>
            <h2 className="font-display text-4xl text-white mb-3">Twelve conditions, four directions</h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              The prompts are concrete and story-shaped — never rate-yourself-1-to-10.
              You&apos;ll recognize yourself in some immediately. The one that makes
              you wince is usually the finding.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DIMENSIONS.map((dim) => (
              <div
                key={dim.label}
                className="rounded-2xl border border-white/10 p-5 flex flex-col"
                style={{ background: 'rgba(17,17,17,0.85)' }}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: dim.color }}>
                  {dim.label} · {dim.sub}
                </p>
                <p className="font-display italic text-sm text-gray-400 mt-1 mb-4 leading-snug">{dim.question}</p>
                <ul className="space-y-2.5 mb-4">
                  {dim.keys.map((k) => (
                    <li key={k.name} className="flex items-center gap-2.5">
                      <Image src={k.icon} alt="" width={22} height={22} className="opacity-90" />
                      <span className="text-[13px] text-gray-200">{k.name}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-display italic text-[13px] leading-snug mt-auto pt-3 border-t border-white/10 text-gray-500">
                  {dim.samplePrompt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── What you keep ── */}
      <Section className="pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <Eyebrow color={AMETHYST}>What each person keeps</Eyebrow>
            <h2 className="font-display text-4xl text-white">Two takeaways</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            <div className="rounded-2xl border border-white/10 p-7 flex flex-col items-center text-center" style={{ background: 'rgba(17,17,17,0.85)' }}>
              <WorksheetPreview />
              <h3 className="font-display text-2xl text-white mt-6 mb-2">The Flow Map</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                The paper map, filled in by hand during the session — twelve honest
                lines, twelve dials, two circles. It leaves the room with its author,
                immediately. Nobody argues with their own handwriting.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 p-7 flex flex-col" style={{ background: 'rgba(17,17,17,0.85)' }}>
              <div className="flex-1 flex flex-col justify-center rounded-xl border border-white/10 p-6 mb-6" style={{ background: 'rgba(10,10,10,0.6)' }}>
                <div className="h-[2px] rounded-full w-16 mb-4" style={{ background: GRADIENTS.fourPillar }} />
                <p className="font-display text-xl text-white mb-2">Your Flow Profile</p>
                <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                  A reading of all twelve conditions in your own terms · your pattern,
                  named · your bottleneck, argued · your first move · one free tool,
                  prescribed by name.
                </p>
                <div className="flex gap-1.5">
                  {[CORAL, SAGE, STEEL, AMETHYST].map((c) => (
                    <span key={c} className="h-1 flex-1 rounded-full" style={{ background: c, opacity: 0.7 }} />
                  ))}
                </div>
              </div>
              <h3 className="font-display text-2xl text-white mb-2 text-center">The Flow Profile</h3>
              <p className="text-sm text-gray-400 leading-relaxed text-center">
                In the last ten minutes, each person feeds their map into a short web
                intake. Within 48 hours, a personal profile page lands in their
                inbox — theirs alone, to keep or share.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 p-7" style={{ background: 'rgba(17,17,17,0.85)' }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">
              The dial, marked at every condition
            </p>
            <Dial />
          </div>
        </div>
      </Section>

      {/* ── Privacy & boundaries ── */}
      <Section className="pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="rounded-2xl border border-white/15 p-8" style={{ background: 'rgba(17,17,17,0.9)' }}>
            <h2 className="font-display text-3xl text-white mb-4">Whose data? Theirs.</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Each person&apos;s map and profile are theirs alone.{' '}
              <strong className="text-white">
                The person booking the session receives no participant data — individual
                or aggregate.
              </strong>{' '}
              This isn&apos;t fine print; it&apos;s why the session works. People are
              honest when it&apos;s safe to be, and honest maps are what you&apos;re
              actually paying for.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              What the buyer does get: a session their team will talk about afterward,
              and — if wanted — a short debrief on how the room works as a room
              (facilitation observations only, never anyone&apos;s answers).
            </p>
            <div className="border-t border-white/10 pt-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">Not included</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Individual coaching · a team-level diagnosis (that&apos;s the{' '}
                <Link href="/together/team-diagnostic" className="text-gray-200 underline decoration-white/30 underline-offset-4 hover:text-white transition-colors">
                  Team Conditions Diagnostic
                </Link>
                ) · implementation support. A Flow Map is a to-do, not a horoscope —
                and it stays a personal one.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Details + CTA ── */}
      <Section className="pb-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8 text-sm text-gray-400">
            <span>Teams of 5–20</span>
            <span aria-hidden className="text-gray-700">·</span>
            <span>90–120 minutes, in your space</span>
            <span aria-hidden className="text-gray-700">·</span>
            <span>No pre-work for participants</span>
          </div>
          <p className="text-gray-400 leading-relaxed mb-8 max-w-xl mx-auto">
            Pricing is a flat fee, scoped to team size — ask, and you&apos;ll get a
            plain number on the first call.
          </p>
          <Link
            href="/together#contact"
            className="inline-block px-8 py-4 text-white rounded-full font-semibold transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-spirit/25"
            style={{ background: GRADIENTS.primaryCta }}
          >
            Start the conversation
          </Link>
          <p className="mt-10 text-sm text-gray-600">
            Wondering what&apos;s behind the whole team&apos;s output, not each
            person&apos;s?{' '}
            <Link href="/together/team-diagnostic" className="text-gray-400 hover:text-white transition-colors underline decoration-white/20 underline-offset-4">
              That&apos;s the Team Conditions Diagnostic
            </Link>
            .
          </p>
        </div>
      </Section>
    </PageLayout>
  );
}
