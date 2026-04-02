'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SAGE } from './constants';

const scienceItems = [
  {
    term: 'Default Mode Network (DMN) suppression',
    definition:
      'The brain has a background network that activates during rest — generating mind-wandering, self-referential thought, and inner monologue. Sustained focused reading suppresses it. This is the same mechanism responsible for deep flow states.',
  },
  {
    term: 'Transient hypofrontality',
    definition:
      'During intense engagement, blood flow and metabolic activity shift away from the prefrontal cortex — the brain\'s analytical, self-monitoring layer. At reading speeds above ~400 WPM, this shift becomes necessary. The inner critic simply can\'t keep up.',
  },
  {
    term: 'Attentional bottleneck',
    definition:
      'Conscious information processing has a single channel. Only one stream can pass through fully at a time. FlowRead trains the brain to hold that channel locked on one task without it wandering to other streams.',
  },
  {
    term: 'Challenge-skill ratio (Csikszentmihalyi)',
    definition:
      'Flow is only accessible when the task difficulty and your current skill are closely matched — roughly 4% above your current edge. Too easy and the mind wanders. Too hard and anxiety collapses focus. Variable speed lets you tune this in real time.',
  },
];

function ScienceAccordion() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="mt-4 border-t border-white/[0.06] pt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left text-[11px] text-white/30 hover:text-white/50 transition-colors"
      >
        <span>The science behind this</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-1">
              {scienceItems.map((item, index) => (
                <div key={index}>
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="w-full flex items-center justify-between py-2 text-left text-[11px] text-white/50 hover:text-white/70 transition-colors"
                  >
                    <span className="font-medium">{item.term}</span>
                    <span
                      className={`transform transition-transform text-white/20 flex-shrink-0 ml-2 ${
                        expandedIndex === index ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  <AnimatePresence>
                    {expandedIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-2 text-[11px] text-white/25 leading-relaxed">
                          {item.definition}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AboutScreen() {
  return (
    <div className="space-y-4">

      {/* What you're training */}
      <div
        className="relative rounded-2xl p-5"
        style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="absolute top-0 left-4 right-4 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${SAGE}60, transparent)` }}
        />

        <h2 className="text-sm font-semibold text-white mb-1">This isn't speed reading training.</h2>
        <p className="text-xs text-white/45 mb-4 leading-relaxed">
          FlowRead trains undivided attention and the ability to absorb information without consciously processing every word. Reading at speed is the mechanism — absorption is the goal.
        </p>

        <div className="space-y-2.5">
          <div className="flex gap-3">
            <span className="text-white/20 mt-0.5 flex-shrink-0 text-[11px]">—</span>
            <p className="text-xs text-white/55 leading-relaxed">
              At higher speeds, your analytical mind can't keep up word-by-word. It has to step back and let pattern recognition take over. That shift — from effortful processing to absorption — is what you're training toward.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-white/20 mt-0.5 flex-shrink-0 text-[11px]">—</span>
            <p className="text-xs text-white/55 leading-relaxed">
              Sustained reading quiets mental noise. The background layer that generates wandering thoughts and inner monologue can't compete with a visually demanding task. This is the same mechanism that deepens flow.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-white/20 mt-0.5 flex-shrink-0 text-[11px]">—</span>
            <p className="text-xs text-white/55 leading-relaxed">
              Variable speed keeps you in the zone — challenged enough to stay locked in, not so fast that comprehension collapses. That edge is where focused absorption becomes trainable.
            </p>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-white/25 italic">WPM is a proxy. The signal is absorption.</p>

        <ScienceAccordion />
      </div>

      {/* How to use it */}
      <div
        className="relative rounded-2xl p-5"
        style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="absolute top-0 left-4 right-4 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${SAGE}40, transparent)` }}
        />

        <h3 className="text-xs font-medium text-white mb-3 flex items-center gap-2">
          <span>🧭</span>
          How to use it
        </h3>

        <div className="space-y-3">
          {[
            {
              n: '1',
              title: 'Set speed at the edge of comprehension',
              body: 'Find where you can follow the meaning but can\'t analytically confirm each word. That tension is the challenge-skill sweet spot — where focused absorption becomes available.',
            },
            {
              n: '2',
              title: 'Let go of the comprehension check',
              body: 'The urge to verify understanding word-by-word is the analytical layer staying in control. The training is in releasing it. Trust that meaning is being absorbed even without conscious confirmation.',
            },
            {
              n: '3',
              title: 'Notice the release moment',
              body: 'Somewhere in most sessions, effortful tracking dissolves into absorption. That transition is the training signal. Each session, try to get there faster.',
            },
            {
              n: '4',
              title: 'Use it as a pre-work warm-up',
              body: '5–10 minutes of FlowRead before a deep work session suppresses mental chatter and primes single-channel focus. The state carries over when you switch to your real task.',
            },
            {
              n: '5',
              title: 'WPM gains are a side effect',
              body: 'If you read faster over time, that\'s fine. But if you stay at the same WPM and the absorption feeling becomes easier and faster to access — that\'s the actual win.',
            },
          ].map((item) => (
            <div key={item.n} className="flex gap-3">
              <span
                className="text-[11px] font-semibold mt-0.5 flex-shrink-0 w-3 text-right"
                style={{ color: SAGE }}
              >
                {item.n}
              </span>
              <div>
                <p className="text-xs font-medium text-white/80 mb-0.5">{item.title}</p>
                <p className="text-xs text-white/40 leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
