'use client';

import { useState } from 'react';
import {
  KEY_CARDS,
  KEY_TECHNIQUES,
  PRESCRIBABLE_TOOLS,
  VOICE_RULES,
  PSYCHOLINGUISTIC_INSTRUCTIONS,
  type Pillar,
} from '@/data/flow-unlock-config';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';

const PILLARS: Pillar[] = ['self', 'space', 'story', 'spirit'];
const PC: Record<Pillar, string> = { self: CORAL, space: SAGE, story: STEEL, spirit: AMETHYST };
const PL: Record<Pillar, string> = { self: 'SELF', space: 'SPACE', story: 'STORY', spirit: 'SPIRIT' };
const PS: Record<Pillar, string> = {
  self:   'Body · Emotions · Mind',
  space:  'Environment · Tools · Systems',
  story:  'Direction · Mission · Narrative',
  spirit: 'Values · Curiosity · Vision',
};

type Tab = 'keys' | 'voice' | 'analysis';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button
      onClick={copy}
      className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded transition-colors"
      style={{
        background: copied ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
        color: copied ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function Section({ title, children, copyText }: { title: string; children: React.ReactNode; copyText?: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
        <p className="text-[10px] font-bold tracking-widest uppercase text-white/40">{title}</p>
        {copyText && <CopyButton text={copyText} />}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function FlowUnlockPromptInspector() {
  const [tab, setTab] = useState<Tab>('keys');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'keys',     label: 'Keys & Techniques' },
    { id: 'analysis', label: 'Analysis Instructions' },
    { id: 'voice',    label: 'Voice Rules' },
  ];

  return (
    <div className="min-h-screen bg-ground text-white">
      {/* Header */}
      <div className="border-b border-white/[0.07] px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Flow Unlock — Prompt Inspector</h1>
            <p className="text-xs text-white/30 mt-0.5">Live view of generation config (V5, Key-level) · Edit in <code className="text-white/40">src/data/flow-unlock-config.ts</code></p>
          </div>
          <a href="/practice/admin" className="text-xs text-white/25 hover:text-white/50 transition-colors">← Admin</a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl mb-6 w-fit">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: tab === t.id ? 'rgba(255,255,255,0.07)' : 'transparent',
                color: tab === t.id ? '#fff' : 'rgba(255,255,255,0.35)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Keys & Techniques ── */}
        {tab === 'keys' && (
          <div className="space-y-6">
            {PILLARS.map(pillar => {
              const color = PC[pillar];
              const cards = KEY_CARDS.filter(k => k.dimension === pillar);
              return (
                <div key={pillar} className="rounded-xl border overflow-hidden" style={{ borderColor: `${color}25` }}>
                  {/* Dimension header */}
                  <div className="px-4 py-3 flex items-baseline gap-2" style={{ background: `${color}0d` }}>
                    <span className="text-xs font-bold tracking-widest" style={{ color }}>{PL[pillar]}</span>
                    <span className="text-[10px] text-white/30">{PS[pillar]}</span>
                  </div>

                  <div className="p-4 space-y-4">
                    {cards.map(card => {
                      const techniques = KEY_TECHNIQUES[card.id];
                      return (
                        <div key={card.id} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-sm font-semibold" style={{ color }}>{card.name}</span>
                            <code className="text-[9px] text-white/20">{card.id}</code>
                          </div>

                          <div className="space-y-1.5 text-xs leading-relaxed mb-3">
                            <p><span className="text-white/30 uppercase text-[9px] tracking-wider mr-1.5">governs</span><span className="text-white/60">{card.governs}</span></p>
                            <p><span className="uppercase text-[9px] tracking-wider mr-1.5" style={{ color: `${color}90` }}>overexposed</span><span className="text-white/55">{card.overexposed}</span></p>
                            <p><span className="text-white/30 uppercase text-[9px] tracking-wider mr-1.5">starved</span><span className="text-white/55">{card.starved}</span></p>
                            <p><span className="text-white/30 uppercase text-[9px] tracking-wider mr-1.5">next step</span><span className="text-white/45 italic">{card.nextStep}</span></p>
                          </div>

                          <div className="space-y-1.5">
                            {techniques.map(t => (
                              <div key={t.title} className="flex items-start gap-2.5 rounded-md border border-white/[0.05] bg-white/[0.01] px-3 py-2">
                                <span className="flex-shrink-0 mt-[6px] w-1 h-1 rounded-full" style={{ background: `${color}70` }} />
                                <div className="min-w-0 flex-1">
                                  <span className="text-xs text-white/75 font-medium">{t.title}</span>
                                  <p className="text-[11px] text-white/35 leading-snug">{t.description}</p>
                                  <code className="text-[8px] text-white/15 mt-0.5 block">{t.path}</code>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Prescribable tool menu — optional, need-matched, at most one per unlock */}
            <div className="rounded-xl border border-white/[0.12] overflow-hidden">
              <div className="px-4 py-3 flex items-baseline gap-2 bg-white/[0.03]">
                <span className="text-xs font-bold tracking-widest text-white/70">PRACTICE TOOLS</span>
                <span className="text-[10px] text-white/30">optional — at most one per unlock, only on a clear match</span>
              </div>
              <div className="p-4 space-y-1.5">
                {PRESCRIBABLE_TOOLS.map(t => (
                  <div key={t.id} className="flex items-start gap-2.5 rounded-md border border-white/[0.05] bg-white/[0.01] px-3 py-2">
                    <span className="flex-shrink-0 mt-[6px] w-1 h-1 rounded-full bg-white/40" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-white/75 font-medium">{t.title}</span>
                      <p className="text-[11px] text-white/35 leading-snug">prescribe when {t.prescribeWhen}</p>
                      <code className="text-[8px] text-white/15 mt-0.5 block">{t.route}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Analysis Instructions ── */}
        {tab === 'analysis' && (
          <Section title="Cross-Pattern Analysis Instructions" copyText={PSYCHOLINGUISTIC_INSTRUCTIONS}>
            <pre className="text-xs text-white/55 leading-relaxed whitespace-pre-wrap font-mono">
              {PSYCHOLINGUISTIC_INSTRUCTIONS}
            </pre>
          </Section>
        )}

        {/* ── Voice Rules ── */}
        {tab === 'voice' && (
          <Section title="Voice Rules (injected into every generation)" copyText={VOICE_RULES}>
            <pre className="text-xs text-white/55 leading-relaxed whitespace-pre-wrap font-mono">
              {VOICE_RULES}
            </pre>
          </Section>
        )}
      </div>
    </div>
  );
}
