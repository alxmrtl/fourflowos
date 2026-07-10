'use client';

import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import { CORAL, SAGE, STEEL, AMETHYST, GRADIENTS } from '@/styles/brand-colors';
import ConditionsMap, { StatusGlyph, CellStatus } from '@/components/pages/offers/ConditionsMap';

/**
 * The sample Team Conditions Report, rendered as the artifact itself:
 * ivory paper sheets on the dark ground. Content is the fictional "Relay"
 * engagement (OFFERS/team-conditions-diagnostic/sample-report.md) — the
 * FICTIONAL labeling is the honest-proof posture and must stay on every view.
 * Register: buyer, end to end.
 */

const INK = '#333333';
const INK_SOFT = 'rgba(51,51,51,0.72)';
const PAPER = '#F7F4EE';

function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl shadow-2xl px-6 py-8 md:px-12 md:py-10"
      style={{ background: PAPER, color: INK }}
    >
      {children}
    </div>
  );
}

function SheetHeading({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: INK_SOFT }}>
        {kicker}
      </p>
      <h2 className="font-display text-3xl md:text-4xl mt-1" style={{ color: INK }}>
        {title}
      </h2>
      {sub && (
        <p className="font-display italic text-base mt-1" style={{ color: INK_SOFT }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] leading-relaxed mb-4" style={{ color: INK }}>
      {children}
    </p>
  );
}

function Q({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-display italic text-[16px]" style={{ color: INK }}>
      {children}
    </span>
  );
}

function ReadBlock({ label, children, soft }: { label: string; children: React.ReactNode; soft?: boolean }) {
  return (
    <div
      className="mb-5 pl-4 md:pl-5"
      style={{ borderLeft: `3px solid ${soft ? 'rgba(51,51,51,0.25)' : INK}` }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: INK_SOFT }}>
        {label}
      </p>
      <p className="text-[15px] leading-relaxed" style={{ color: INK }}>
        {children}
      </p>
    </div>
  );
}

function Cond({
  status,
  name,
  gloss,
  note,
  noteStrong,
  children,
}: {
  status: CellStatus;
  name: string;
  gloss: string;
  note: string;
  noteStrong?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <p className="text-[15px] leading-snug mb-1">
        <span className="inline-block align-[-1px] mr-2">
          <StatusGlyph status={status} ink={INK} />
        </span>
        <strong>{name}</strong>{' '}
        <span className="font-display italic" style={{ color: INK_SOFT }}>
          — i.e., {gloss}
        </span>{' '}
        <span
          className="text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ color: noteStrong ? INK : INK_SOFT }}
        >
          · {note}
        </span>
      </p>
      {children && (
        <p className="text-[14.5px] leading-relaxed" style={{ color: INK }}>
          {children}
        </p>
      )}
    </div>
  );
}

function LayerRule({ color, label, sub }: { color: string; label: string; sub: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-3 mt-7 first:mt-0 pt-2" style={{ borderTop: `3px solid ${color}` }}>
      <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color }}>
        {label}
      </span>
      <span className="font-display italic text-sm" style={{ color: INK_SOFT }}>
        {sub}
      </span>
    </div>
  );
}

export default function SampleReportPage() {
  return (
    <PageLayout accentColor={SAGE}>
      {/* ── Intro / the honesty banner ── */}
      <section className="pt-10 md:pt-14 pb-10">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            href="/together/team-diagnostic"
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            &larr; Team Conditions Diagnostic
          </Link>
          <h1 className="font-display text-4xl md:text-5xl text-white mt-5 mb-4">
            The sample report, in full
          </h1>
          <div className="rounded-xl border border-red-400/40 bg-red-500/[0.06] p-5 md:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-400/90 mb-2">
              ⚠ Fictional sample
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              &ldquo;Relay&rdquo; and &ldquo;Meridian Analytics&rdquo; do not exist.
              This report was produced by running the full diagnostic method on
              synthetic evidence, to show you exactly what you receive. No real
              client data appears here — we say so because we&apos;d rather show you
              a labeled sample than an invented case study.
            </p>
          </div>
        </div>
      </section>

      {/* ── The paper ── */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-8">
          {/* Cover sheet */}
          <Sheet>
            <div className="h-[3px] rounded-full w-24 mb-8" style={{ background: GRADIENTS.fourPillar }} />
            <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: INK }}>
              Team Conditions Report
            </h2>
            <p className="text-[15px] mt-4 leading-relaxed" style={{ color: INK_SOFT }}>
              <strong style={{ color: INK }}>Relay</strong> · Meridian Analytics
              <br />
              Engagement: four weeks · Prepared by Alex · FourFlowOS
            </p>
            <p className="font-display italic text-lg mt-5" style={{ color: INK }}>
              What we found, what it&apos;s costing, and the first thing worth changing.
            </p>
          </Sheet>

          {/* 1 — The Read */}
          <Sheet>
            <SheetHeading
              kicker="Section 1"
              title="The Read"
              sub="The whole diagnosis on one page. Everything after this is the evidence."
            />
            <ReadBlock label="The bottleneck — Feedback Systems, i.e., signal loops">
              Relay ships real work into silence. Features release and no adoption
              signal returns to the team; decisions leave the weekly meeting without
              an owner or a date and resurface weeks later as open questions. The
              team is talented, engaged, and likes its tools — and it is flying
              without instruments.
            </ReadBlock>
            <ReadBlock label="What it's costing">
              In one observed planning meeting, five decisions were raised and one
              closed. The team&apos;s strongest engineers spend roughly a day a month
              hand-building private usage reports the system should be producing. The
              same questions recur across meetings — &ldquo;third week running,&rdquo;
              in the team&apos;s own words. Effort that should compound is being
              spent on compensating.
            </ReadBlock>
            <ReadBlock label="The first intervention — the closing loop">
              Two habits, ~10 minutes a week, starting Monday: every decision in the
              weekly leaves with an owner and a date, in the meeting; every shipped
              feature gets one adoption number, reviewed the following week —
              starting from the tracking sheet one of your engineers already built.
            </ReadBlock>
            <ReadBlock label="The 30-day indicator">
              Decisions leaving the weekly with an owner and a date: from the
              observed baseline of <strong>1 in 5</strong> to <strong>4 in 5</strong>.
              Countable from your own meeting notes. No tooling required.
            </ReadBlock>
            <ReadBlock label="And honestly" soft>
              Eleven other conditions were read. Three are genuinely strong — this
              team is not broken, it is blocked, and the fix builds on what already
              works.
            </ReadBlock>
          </Sheet>

          {/* 2 — Evidence base */}
          <Sheet>
            <SheetHeading kicker="Section 2" title="What We Looked At" />
            <div className="overflow-x-auto">
              <table className="w-full text-[14px]" style={{ color: INK }}>
                <thead>
                  <tr>
                    {['Evidence stream', 'Volume'].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[10px] font-bold uppercase tracking-[0.16em] pb-2 pr-4"
                        style={{ color: INK_SOFT, borderBottom: '1.5px solid rgba(51,51,51,0.3)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Confidential interviews', '4 × 30 min'],
                    ['Meeting transcripts (recorded with consent, announced in advance)', '3 meetings — planning, standup, retro'],
                    ['Team questionnaire', '11 of 11 respondents + team lead (same instrument)'],
                    ['Leader intake', '1'],
                    ['Work artifacts', 'not collected this engagement'],
                  ].map(([a, b]) => (
                    <tr key={a}>
                      <td className="py-2.5 pr-4 align-top" style={{ borderBottom: '1px solid rgba(51,51,51,0.12)' }}>{a}</td>
                      <td className="py-2.5 align-top" style={{ borderBottom: '1px solid rgba(51,51,51,0.12)' }}>{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[14.5px] leading-relaxed mt-5" style={{ color: INK }}>
              All quotes are non-attributed and edited to remove identifying
              phrasing. No individual was scored. Six conditions produced too little
              evidence to read in this engagement — they&apos;re marked{' '}
              <strong>not read</strong> below rather than guessed at, with what would
              light them up.
            </p>
          </Sheet>

          {/* 3 — The twelve conditions */}
          <Sheet>
            <SheetHeading
              kicker="Section 3"
              title="The Twelve Conditions"
              sub="The full read — strengths get real ink; thin evidence gets named, not stretched."
            />

            <LayerRule color={CORAL} label="People" sub="how the humans are doing" />
            <Cond status="working" name="Tuned Emotions" gloss="emotional bandwidth" note="Working · Confirmed">
              Disagreement on this team surfaces and resolves without residue. Two
              technical disputes in one meeting ended in evidence, not politics — and
              the lead named it: <Q>&ldquo;I like hearing people actually fight about
              something technical instead of just agreeing to be polite.&rdquo;</Q>{' '}
              This is load-bearing: the intervention below assumes a team that can
              hear a bad number without flinching. Yours can.
            </Cond>
            <Cond status="notread" name="Focused Body" gloss="energy, recovery, sustained focus" note="Not read">
              No signal in any collected stream. Not &ldquo;fine&rdquo; — unread. One
              interview probe (&ldquo;what does the week look like by
              Thursday?&rdquo;) would light it up next time.
            </Cond>
            <Cond status="notread" name="Open Mind" gloss="cognitive load, mental flexibility" note="Not read">
              Recurring topics in meetings looked adjacent to this, but the evidence
              pattern belongs to the loop failure below; we didn&apos;t stretch it.
            </Cond>

            <LayerRule color={SAGE} label="Tools & Systems" sub="what the work runs on" />
            <Cond status="notread" name="Intentional Space" gloss="focus protection" note="Not read">
              One thin positive mention; too little to read either way.
            </Cond>
            <Cond status="working" name="Optimized Tools" gloss="tool fit & friction" note="Working · Confirmed">
              The day-to-day stack fits. Questionnaire item 5 is among your three
              strongest, and two respondents volunteered, unprompted, that the tools
              are genuinely fine. Whatever is wrong here, it is not the tools — which
              matters, because the tempting fix (a new platform) would treat the one
              thing that isn&apos;t broken.
            </Cond>
            <Cond status="blocked" name="Feedback Systems" gloss="signal loops" note="Blocked · Confirmed — the bottleneck" noteStrong>
              Argued in full in Section 4.
            </Cond>

            <LayerRule color={STEEL} label="Direction" sub="where the work is pointed" />
            <Cond status="strained" name="Generative Story" gloss="the team narrative" note="Strained · Indicated">
              A mild &ldquo;nothing we ship seems to matter&rdquo; note runs through
              the retro and one interview — though not uniformly (one member
              explicitly rejects the decline framing: growth outpacing
              infrastructure, not decay). We read this as downstream of the
              bottleneck: a team that cannot see what its shipments do will
              eventually narrate that they do nothing.
            </Cond>
            <Cond status="strained" name="Clear Mission" gloss="mission clarity" note="Strained · Indicated">
              The Northwind-vs-V2 ranking stalls in planning, and a March
              &ldquo;no&rdquo; has decayed into ambiguity. Also read as downstream:
              you can&apos;t rank what you can&apos;t score. Re-read at day 30 before
              treating separately.
            </Cond>
            <Cond status="notread" name="Empowered Role" gloss="role ownership" note="Not read">
              One ambiguous moment (a decision nobody owned) reads as a loop symptom,
              not an authority problem — we&apos;ll check that reading with you
              directly at the debrief.
            </Cond>

            <LayerRule color={AMETHYST} label="Values" sub="what's underneath" />
            <Cond status="notread" name="Grounding Values" gloss="values congruence" note="Not read" />
            <Cond status="working" name="Ignited Curiosity" gloss="real engagement" note="Working · Confirmed">
              Your highest questionnaire score of all twelve, visible live in the
              transcripts: an engineer&apos;s unprompted weekend spike met with{' '}
              <Q>&ldquo;send me what you&apos;ve got, I want to poke holes in
              it.&rdquo;</Q>{' '}
              The engagement your survey measured was real. It just isn&apos;t the
              problem — which is why the survey couldn&apos;t find the problem.
            </Cond>
            <Cond status="notread" name="Visualized Vision" gloss="shared vision" note="Not read" />
          </Sheet>

          {/* 4 — The bottleneck */}
          <Sheet>
            <SheetHeading
              kicker="Section 4"
              title="The Bottleneck"
              sub="Feedback Systems — i.e., signal loops · the argument, stream by stream"
            />
            <P>
              <strong>The evidence converges from every stream collected.</strong>{' '}
              Behaviorally: 1 of 5 decisions closed in the observed planning meeting;
              V2 shipped three weeks prior and its PM had no adoption number
              (<Q>&ldquo;I mean. Good question.&rdquo;</Q>); the team&apos;s own
              dashboard dismissed in a breath — <Q>&ldquo;Nobody opens
              Pulse&rdquo;</Q> — by the people it was built for; an item marked
              &ldquo;let&apos;s not let this one drift&rdquo; still not live two
              quarters later. In interviews, 4 of 4 described the same gap; the
              sharpest, from an engineer: <Q>&ldquo;The thing that actually eats time
              isn&apos;t building it, it&apos;s not knowing if I need to keep
              touching it.&rdquo;</Q> On the questionnaire, the lowest team mean of
              all twelve items (1.82 of 4) — and even the most positive respondent
              never rated it above &ldquo;Sometimes.&rdquo;
            </P>
            <P>
              <strong>How the team is compensating — the strongest proof.</strong>{' '}
              Two engineers run private adoption-tracking sheets off hand-written
              queries. Status moves by direct-message chase. The same questions recur
              week over week — recurrence is what an open loop looks like from inside
              a calendar. A team that lacked the capability wouldn&apos;t have built
              the workarounds; the workarounds are the diagnosis, and their cost is
              your original complaint.
            </P>
            <P>
              <strong>The perception gap.</strong> The widest leader-team divergence
              in the data sits on this exact condition: the lead rated it 4 of 4; the
              team mean is 1.82. The lead&apos;s own note explains it better than we
              could: <Q>&ldquo;we do have dashboards, so I landed on &lsquo;almost
              always.&rsquo; Rating it made me realize I&apos;m not sure the last
              time I actually used one myself to check something.&rdquo;</Q> The
              rating measured the system&apos;s existence; the team lives its use.
              That gap is itself a signal-loop finding.
            </P>
            <P>
              <strong>What it explains.</strong> Capable team, flat output: effort
              without return signal can&apos;t compound. Survey up, work unchanged:
              the survey measured sentiment — and sentiment here is genuinely good —
              while the block was structural. The strain on mission and narrative:
              downstream, both.
            </P>
            <P>
              <strong>The case against, taken seriously.</strong> &ldquo;This is
              really a prioritization problem.&rdquo; The stall is real — but the
              March decision <em>was made</em> and then decayed because nothing
              tracked it: a closure failure wearing a strategy costume. And your own
              team&apos;s &ldquo;change one thing&rdquo; answers asked for
              decision-closure and an adoption number — not for strategy. We diagnose
              the condition that&apos;s Confirmed in four streams before the one
              that&apos;s Indicated in two.
            </P>
          </Sheet>

          {/* 5 + 6 — What to do first / indicator */}
          <Sheet>
            <SheetHeading kicker="Section 5" title="What To Do First" />
            <div className="rounded-lg p-5 mb-5" style={{ border: '1px solid rgba(51,51,51,0.3)' }}>
              <p className="font-display text-xl mb-3" style={{ color: INK }}>
                The closing loop — two habits, one named owner, 30 days
              </p>
              <P>
                <strong>1 · Decisions close in the room.</strong> Every decision
                raised in the weekly leaves with an owner and a date, written where
                the team already takes notes. When it can&apos;t close, that&apos;s
                said explicitly — &ldquo;parked&rdquo; is a decision too.
              </P>
              <p className="text-[15px] leading-relaxed" style={{ color: INK }}>
                <strong>2 · Every shipment gets one number.</strong> One adoption
                metric per shipped feature, reviewed for two minutes the following
                week. Start from the tracking sheet that already exists on this
                team — make it shared, not private. Do not build anything new to do
                this.
              </p>
            </div>
            <P>
              Week-by-week, working looks like: week 1, awkward and slow; week 2, the
              number gets asked for before it&apos;s offered; week 4, the baseline
              has visibly moved. What it needs from the lead specifically: ask for
              the number, never shoot the messenger of a bad one, and let the owner
              own it.
            </P>
            <P>
              <strong>What NOT to do first.</strong> A new analytics platform — your
              tools scored among your best conditions; the last dashboard didn&apos;t
              fail for lack of features. And another survey or engagement
              initiative — sentiment here is strong and already measured. In your own
              team&apos;s words, from the questionnaire: <Q>&ldquo;Please don&apos;t
              recommend another survey. We just did that.&rdquo;</Q>
            </P>

            <div className="mt-8">
              <SheetHeading kicker="Section 6" title="The 30-Day Indicator" />
              <ReadBlock label="One observable signal — not a score">
                <strong>
                  Decisions leaving the weekly with an owner and a date: from 1 in 5
                  (observed baseline) to 4 in 5.
                </strong>{' '}
                Counted by the loop owner from the team&apos;s own notes; reviewed
                together at the day-30 call (booked at the debrief). Secondary check:
                an adoption number reviewed for every feature shipped in the window.
              </ReadBlock>
            </div>
          </Sheet>

          {/* 7 + appendices */}
          <Sheet>
            <SheetHeading kicker="Section 7" title="Where This Goes" />
            <P>
              Day 30, one of three honest recommendations: <strong>done</strong> —
              the indicator moved and the team runs with it (a real outcome;
              we&apos;ll say it plainly); <strong>adjust</strong> — right condition,
              wrong-sized habit; or <strong>next layer</strong> — the loop now
              produces signal, and ranking Northwind-vs-V2 with real numbers becomes
              the natural follow-on. If the team wants the individual-level picture
              behind the team-level fix, the Flow Map Session gives each person their
              own map in one session. No pressure attaches to any of these.
            </P>
            <div className="mt-8">
              <SheetHeading kicker="Appendix A" title="About the Method" />
              <P>
                The twelve conditions this report reads are the twelve Keys of the{' '}
                <strong>FourFlow framework</strong> — four dimensions of the
                conditions under which good work happens (appearing in this report as
                People, Tools &amp; Systems, Direction, Values), three Keys each —
                built and practiced at fourflowos.com. The diagnostic stance: the
                blocker is always a condition, never a character flaw; diagnosis
                precedes intervention; evidence precedes verdict. AI was used to read
                the evidence base at depth — every transcript, interview, and
                response, against all twelve conditions — and the diagnosis, the
                argument, and every sentence of this report are the
                practitioner&apos;s.
              </P>
            </div>
            <div className="mt-8">
              <SheetHeading kicker="Appendix B" title="Evidence Index" />
              <P>
                Per-finding pointers to stream and volume (never raw transcripts)
                available on request. Interviews confidential and non-attributed;
                recordings announced in advance; no individual scored. All engagement
                data is deleted 30 days after the follow-through call; deletion
                confirmed in writing.
              </P>
            </div>
          </Sheet>

          {/* The one-page Map, paper edition */}
          <Sheet>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: INK_SOFT }}>
                  The one-page companion artifact
                </p>
                <h2 className="font-display text-3xl md:text-4xl mt-1" style={{ color: INK }}>
                  Team Conditions Map
                </h2>
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.16em] px-2.5 py-1 rounded"
                style={{ border: '1px solid #a4453a', color: '#a4453a' }}
              >
                Fictional sample
              </span>
            </div>
            <ConditionsMap theme="paper" />
            <p className="text-[12px] mt-6 pt-4" style={{ color: INK_SOFT, borderTop: '1px solid rgba(51,51,51,0.15)' }}>
              Full evidence in the Team Conditions Report · 4 streams ·
              non-attributed · no individual scored
            </p>
          </Sheet>
        </div>
      </section>

      {/* ── Close ── */}
      <section className="pb-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-gray-400 leading-relaxed mb-8">
            This is the deliverable — with your team&apos;s name on it instead, and
            real evidence behind every line.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/together#contact"
              className="inline-block px-8 py-4 text-white rounded-full font-semibold transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-spirit/25"
              style={{ background: GRADIENTS.primaryCta }}
            >
              Start the conversation
            </Link>
            <Link
              href="/together/team-diagnostic"
              className="inline-block px-8 py-4 rounded-full font-semibold text-white border border-white/25 hover:border-white/50 hover:bg-white/5 transition-all duration-300"
            >
              Back to the Diagnostic
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
