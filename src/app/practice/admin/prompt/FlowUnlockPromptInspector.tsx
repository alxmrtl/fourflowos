'use client';

import { useState } from 'react';
import {
  PILLAR_TECHNIQUES,
  PILLAR_CONCEPTS,
  PRACTICE_TOOLS,
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

type Tab = 'tools' | 'voice' | 'analysis';

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
  const [tab, setTab] = useState<Tab>('tools');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'tools',    label: 'Tools & Techniques' },
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
            <p className="text-xs text-white/30 mt-0.5">Live view of generation config · Edit in <code className="text-white/40">src/data/flow-unlock-config.ts</code></p>
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

        {/* ── Tools & Techniques ── */}
        {tab === 'tools' && (
          <div className="space-y-6">
            {PILLARS.map(pillar => {
              const color = PC[pillar];
              const tool = PRACTICE_TOOLS[pillar];
              const concept = PILLAR_CONCEPTS[pillar];
              const techniques = PILLAR_TECHNIQUES[pillar];
              return (
                <div key={pillar} className="rounded-xl border overflow-hidden" style={{ borderColor: `${color}25` }}>
                  {/* Pillar header */}
                  <div className="px-4 py-3 flex items-baseline gap-2" style={{ background: `${color}0d` }}>
                    <span className="text-xs font-bold tracking-widest" style={{ color }}>{PL[pillar]}</span>
                    <span className="text-[10px] text-white/30">{PS[pillar]}</span>
                    <span className="ml-auto text-[9px] text-white/20 uppercase tracking-wider">blind-side pillar</span>
                  </div>

                  <div className="p-4 space-y-5">
                    {/* Tool */}
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-white/20 mb-2">Practice Tool</p>
                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-white">{tool.title}</span>
                          <code className="text-[9px] text-white/25">{tool.route}</code>
                        </div>
                        <p className="text-xs text-white/50 leading-relaxed">{tool.description}</p>
                      </div>
                    </div>

                    {/* Concept */}
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-white/20 mb-2">Concept</p>
                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                        <span className="text-sm font-semibold text-white">{concept.name}</span>
                        <p className="text-xs text-white/45 mt-0.5">The science of {concept.domain}</p>
                      </div>
                    </div>

                    {/* Techniques */}
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-white/20 mb-2">
                        Techniques ({techniques.length} total · first 3 recommended)
                      </p>
                      <div className="space-y-1.5">
                        {techniques.map((t, i) => (
                          <div
                            key={t.title}
                            className="rounded-lg border p-3 flex items-start gap-3"
                            style={{
                              borderColor: i < 3 ? `${color}30` : 'rgba(255,255,255,0.05)',
                              background: i < 3 ? `${color}08` : 'rgba(255,255,255,0.01)',
                            }}
                          >
                            <span
                              className="flex-shrink-0 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                              style={{
                                background: i < 3 ? `${color}25` : 'rgba(255,255,255,0.06)',
                                color: i < 3 ? color : 'rgba(255,255,255,0.25)',
                              }}
                            >
                              {i + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-sm text-white/80 font-medium">{t.title}</span>
                                {i < 3 && (
                                  <span className="text-[8px] uppercase tracking-wider px-1.5 py-px rounded"
                                    style={{ background: `${color}20`, color }}>
                                    Active
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-white/40 leading-snug">{t.description}</p>
                              <code className="text-[8px] text-white/15 mt-1 block">{t.path}</code>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Analysis Instructions ── */}
        {tab === 'analysis' && (
          <Section title="Psycholinguistic Analysis Instructions" copyText={PSYCHOLINGUISTIC_INSTRUCTIONS}>
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
