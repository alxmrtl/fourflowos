'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import { SAGE, STEEL, AMETHYST, GRADIENTS } from '@/styles/brand-colors';
import ConditionsMap from '@/components/pages/offers/ConditionsMap';

/**
 * Team Conditions Diagnostic — offer page.
 * Register: buyer, throughout (OFFERS/team-conditions-diagnostic/OFFER.md).
 * Layers are People / Tools & Systems / Direction / Values; conditions carry
 * Key names with "i.e." glosses; the framework name stays backstage.
 * Never: flow state, consciousness, transform, untranslated Spirit.
 * Pricing: by conversation. Proof: the labeled fictional sample, shown as such.
 */

const STREAMS = [
  {
    n: '1',
    name: 'Leader intake',
    what: 'Context, symptoms, prior attempts, what "better" would look like.',
    weight: 'Frame, never finding',
  },
  {
    n: '2',
    name: 'Confidential interviews',
    what: '3–6 team members, 30 minutes each. What people know but don’t say in meetings. Quoted without attribution only.',
    weight: 'High',
  },
  {
    n: '3',
    name: 'Meeting transcripts',
    what: '2–4 real meetings, recorded with the team’s consent and announced in advance. How decisions actually happen, what interrupts, which loops never close.',
    weight: 'High — the differentiator',
    featured: true,
  },
  {
    n: '4',
    name: 'Team questionnaire',
    what: 'All members, ~15 minutes, async. Whole-team coverage — including where the leader’s read and the team’s diverge.',
    weight: 'Triangulation',
  },
  {
    n: '5',
    name: 'Work artifacts',
    what: 'Optional: planning docs, dashboards, a channel sample — whether systems exist versus get used.',
    weight: 'Corroborating',
  },
];

const TIMELINE = [
  { when: 'Week 0', what: 'Scoping call · team and meeting selection · consent one-pager to every participant · questionnaire out' },
  { when: 'Week 1', what: 'Evidence: leader intake, interviews, meeting recordings collected, questionnaire closes' },
  { when: 'Week 2', what: 'Synthesis: each stream read separately, then triangulated · report drafted, every finding carrying its evidence' },
  { when: 'Week 3', what: 'The debrief — 90 minutes with the whole team. Findings pressure-tested together; the intervention chosen with the team, not handed down. The 30-day indicator is agreed in the room' },
  { when: 'Day 30', what: 'Follow-through call: did the indicator move, and what’s honestly next — including "done"' },
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

export default function TeamDiagnosticPage() {
  return (
    <PageLayout accentColor={SAGE}>
      {/* ── Hero ── */}
      <section className="relative pt-14 md:pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Eyebrow color={SAGE}>Team Conditions Diagnostic</Eyebrow>
          </motion.div>
          <motion.h1
            className="font-display text-5xl md:text-6xl text-white leading-[1.08] mb-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            The survey moved.{' '}
            <span
              className="bg-gradient-to-r bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${SAGE}, ${STEEL})` }}
            >
              The work didn&apos;t.
            </span>
          </motion.h1>
          <motion.p
            className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            A two-to-four-week evidence engagement for capable teams whose output
            doesn&apos;t match their talent. It names the specific condition
            constraining the work, shows you the evidence, and hands you the one
            intervention worth running first — with a 30-day check that it worked.
          </motion.p>
        </div>
      </section>

      {/* ── The stance ── */}
      <Section className="pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="border-l-2 pl-6 md:pl-8" style={{ borderColor: SAGE }}>
            <p className="font-display text-2xl md:text-[28px] text-white/90 leading-snug mb-5">
              Surveys measure sentiment. Your problem is a condition.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              Something structural in how the team&apos;s work actually happens —
              which is why a team can feel fine and still be blocked, and why the
              score can climb while output stays flat. Sentiment tools aren&apos;t
              wrong; they&apos;re usually deployed before anyone has diagnosed what
              the problem actually is.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Three commitments run through the whole engagement:{' '}
              <strong className="text-gray-200">conditions, not sentiment</strong> ·{' '}
              <strong className="text-gray-200">evidence before verdict</strong> —
              every finding traces to something you can inspect ·{' '}
              <strong className="text-gray-200">one bottleneck at a time</strong> —
              teams don&apos;t fail from twelve problems, they fail from one or two
              the other ten are compensating for.
            </p>
          </div>
        </div>
      </Section>

      {/* ── The evidence streams ── */}
      <Section className="pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <Eyebrow color={STEEL}>How it works</Eyebrow>
            <h2 className="font-display text-4xl text-white mb-3">The work itself testifies</h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Interviews and questionnaires report what people say. Real meeting
              transcripts show what the team does — how decisions close (or
              don&apos;t), who gets interrupted, which questions keep coming back.
              When what&apos;s said and what&apos;s shown disagree, that
              disagreement is usually the finding.
            </p>
          </div>

          <div className="space-y-3">
            {STREAMS.map((s) => (
              <div
                key={s.n}
                className="flex items-start gap-4 rounded-xl border p-5"
                style={{
                  borderColor: s.featured ? `${SAGE}66` : 'rgba(255,255,255,0.1)',
                  background: s.featured ? `${SAGE}0d` : 'rgba(17,17,17,0.85)',
                }}
              >
                <span
                  className="font-display text-2xl leading-none mt-0.5 w-6 text-center flex-shrink-0"
                  style={{ color: s.featured ? SAGE : 'rgba(255,255,255,0.3)' }}
                >
                  {s.n}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="text-white font-medium">{s.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: s.featured ? SAGE : 'rgba(255,255,255,0.35)' }}>
                      {s.weight}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mt-1">{s.what}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto text-center">
            AI reads the evidence base at depth — every transcript, interview, and
            response, against all twelve conditions — which is what makes this
            affordable for a team your size. The diagnosis, the argument, and every
            sentence of the report are the practitioner&apos;s.
          </p>
        </div>
      </Section>

      {/* ── Timeline ── */}
      <Section className="pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <Eyebrow color={SAGE}>The shape of the engagement</Eyebrow>
            <h2 className="font-display text-4xl text-white">Four weeks, then proof at day 30</h2>
          </div>
          <div className="space-y-0">
            {TIMELINE.map((t, i) => (
              <div key={t.when} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-[7px]" style={{ background: SAGE }} />
                  {i < TIMELINE.length - 1 && <span className="w-px flex-1 bg-white/10" />}
                </div>
                <div className="pb-7">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-1">{t.when}</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{t.what}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Consent posture ── */}
      <Section className="pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="rounded-2xl border border-white/15 p-8" style={{ background: 'rgba(17,17,17,0.9)' }}>
            <h2 className="font-display text-3xl text-white mb-4">The team knows everything that&apos;s collected</h2>
            <p className="text-gray-400 leading-relaxed mb-5">
              Before week one, every participant receives a plain-language consent
              one-pager. It isn&apos;t fine print — a team that trusts the process
              gives honest evidence, and honest evidence is the product.
            </p>
            <ul className="space-y-2.5 text-sm text-gray-300">
              {[
                'Interviews are confidential; quotes appear without attribution, edited to remove identifying phrasing',
                'No individual is scored, ranked, or named in any finding — the team is diagnosed, never its people',
                'Meetings selected for recording are announced in advance; nobody is recorded unaware',
                'Transcripts are processed on the practitioner’s own machine and deleted 30 days after the follow-through call — confirmed in writing',
                'Anyone can ask for their words to be excluded, no reason needed, up to report delivery',
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span className="w-1 h-1 rounded-full mt-[8px] flex-shrink-0" style={{ background: SAGE }} />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── What you receive ── */}
      <Section className="pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <Eyebrow color={AMETHYST}>What you receive</Eyebrow>
            <h2 className="font-display text-4xl text-white mb-3">The whole diagnosis, on one page</h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              The Team Conditions Map: all twelve conditions read under four plain
              layers, the bottleneck named, the first move and its 30-day indicator.
              This one below is from the sample engagement — fictional, and labeled
              that way on purpose.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 p-6 md:p-8" style={{ background: 'rgba(17,17,17,0.85)' }}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
              <p className="font-display text-xl text-white">Team Conditions Map</p>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] px-2.5 py-1 rounded border border-red-400/50 text-red-400/90">
                Fictional sample — &ldquo;Relay&rdquo;
              </span>
            </div>
            <ConditionsMap theme="dark" />
            <div className="mt-6 pt-5 border-t border-white/10 grid sm:grid-cols-2 gap-5 text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500 mb-1.5">The first intervention</p>
                <p className="text-gray-300 leading-relaxed">
                  The closing loop: every decision leaves the weekly with an owner and
                  a date; every shipment gets one adoption number, reviewed next week.
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500 mb-1.5">The 30-day indicator</p>
                <p className="text-gray-300 leading-relaxed">
                  Decisions closed in the room: from 1 in 5 to 4 in 5 — counted from
                  the team&apos;s own notes. No tooling required.
                </p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            {[
              { t: 'Team Conditions Report', d: 'The full read across all twelve conditions, the bottleneck argued with its evidence, what to do first — and what not to do first.' },
              { t: 'The debrief', d: '90 minutes with the whole team. A diagnosis the team helped confirm gets implemented; one handed down gets shelved.' },
              { t: '30-day follow-through', d: 'One observable indicator, agreed in the room, checked together at day 30. So the engagement ends in an answer, not a binder.' },
            ].map((card) => (
              <div key={card.t} className="rounded-xl border border-white/10 p-5" style={{ background: 'rgba(17,17,17,0.85)' }}>
                <p className="text-white font-medium mb-1.5">{card.t}</p>
                <p className="text-[13px] text-gray-500 leading-relaxed">{card.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Honest proof ── */}
      <Section className="pb-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="rounded-2xl border p-8" style={{ borderColor: 'rgba(248,113,113,0.35)', background: 'rgba(17,17,17,0.9)' }}>
            <h2 className="font-display text-3xl text-white mb-4">No case studies yet. Here&apos;s the sample instead.</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              This offer is new, and we&apos;d rather show you a labeled fictional
              sample than an invented success story. The full method was run on a
              synthetic engagement — a fictional 12-person product team called
              &ldquo;Relay&rdquo; — and the complete report is public: the evidence
              base, the twelve-condition read, the bottleneck argument, the
              intervention. Exactly what you&apos;d receive, honestly labeled.
            </p>
            <Link
              href="/together/team-diagnostic/sample-report"
              className="inline-block px-7 py-3.5 rounded-full font-semibold text-white border border-white/25 hover:border-white/50 hover:bg-white/5 transition-all duration-300"
            >
              Read the full sample report
            </Link>
          </div>
        </div>
      </Section>

      {/* ── Boundaries + the lighter rung ── */}
      <Section className="pb-20">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <div className="rounded-2xl border border-white/10 p-7" style={{ background: 'rgba(17,17,17,0.85)' }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">What this is not</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Not a performance review, not conflict mediation, not a reorg proposal,
              not a culture program. Individuals are never scored — if the evidence
              surfaces something outside diagnostic scope, it goes to you privately
              as a flag, never into the report.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 p-7" style={{ background: 'rgba(17,17,17,0.85)' }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">A lighter first step exists</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              The 90-minute <strong className="text-gray-200">Team Conditions Audit</strong> reads
              the same twelve conditions from your account of the team — one session,
              one most-likely condition, one first intervention. The Audit tells you
              what I can see from your description; the Diagnostic tells you what the
              team&apos;s own work says. Ask about either.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Details + CTA ── */}
      <Section className="pb-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8 text-sm text-gray-400">
            <span>Teams of 5–25</span>
            <span aria-hidden className="text-gray-700">·</span>
            <span>2–4 weeks, mostly async for the team</span>
            <span aria-hidden className="text-gray-700">·</span>
            <span>Remote or on-site debrief</span>
          </div>
          <p className="text-gray-400 leading-relaxed mb-8 max-w-xl mx-auto">
            Pricing is scoped on the first call — team size and evidence depth — and
            you&apos;ll get a plain number, not a proposal deck.
          </p>
          <Link
            href="/together#contact"
            className="inline-block px-8 py-4 text-white rounded-full font-semibold transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-spirit/25"
            style={{ background: GRADIENTS.primaryCta }}
          >
            Start the conversation
          </Link>
          <p className="mt-10 text-sm text-gray-600">
            Want the finding to land person by person afterward?{' '}
            <Link href="/together/flow-map-session" className="text-gray-400 hover:text-white transition-colors underline decoration-white/20 underline-offset-4">
              That&apos;s the Flow Map Session
            </Link>
            .
          </p>
        </div>
      </Section>
    </PageLayout>
  );
}
