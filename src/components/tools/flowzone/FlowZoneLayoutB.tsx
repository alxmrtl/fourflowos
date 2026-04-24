'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayoutProps } from './types';
import { SAGE, CORAL, STEEL, AMETHYST, TIMER_OPTIONS, BREATHWORK_PATTERNS, AUDIO_OPTIONS } from './constants';
import { AudioIcons } from './icons';

// SELF=Coral, SPACE=Sage, STORY=Steel, SPIRIT=Amethyst
const BREATH_CYCLE_OPTIONS = [3, 5, 10, 15] as const;

const GRID_AUDIO = [
  { id: 'none', title: 'Silence', subtitle: 'No audio' },
  ...AUDIO_OPTIONS.filter(o => ['binaural', 'white-noise', 'lofi', 'rain', 'nature'].includes(o.id)),
];

// Card accent color per section — pillar-mapped
const ACCENTS = {
  focus:     CORAL,   // SELF
  session:   SAGE,    // SPACE
  done:      STEEL,   // STORY
  duration:  STEEL,   // STORY — timing / structured output
  breathwork: CORAL,  // SELF — body / reception
  audio:     SAGE,    // SPACE — environment / transmission
} as const;

function AccentCard({
  accent,
  children,
  className = '',
}: {
  accent: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl p-4 overflow-hidden ${className}`}
      style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div
        className="absolute top-0 left-3 right-3 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}80, transparent)` }}
      />
      {children}
    </div>
  );
}

function SectionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      <span className="text-gray-500" style={{ width: 12, height: 12 }}>{icon}</span>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{children}</p>
    </div>
  );
}

const Icons = {
  focus: (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2l2 6h6l-5 4 2 6-5-4-5 4 2-6L2 8h6z" />
    </svg>
  ),
  session: (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5,3 19,10 5,17" />
    </svg>
  ),
  done: (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10l5 5 7-8" />
    </svg>
  ),
  clock: (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 5v5l4 2" />
    </svg>
  ),
  breath: (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 10c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
    </svg>
  ),
  audio: (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 8v4h3l4 4V4L6 8H3z" />
      <path d="M14 7a4 4 0 010 6" />
    </svg>
  ),
};

function StrikethroughText({ text }: { text: string }) {
  return (
    <div className="relative flex-1 min-w-0">
      <span className="text-xs text-gray-500 leading-tight">{text}</span>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M 0 50 L 100 50"
          stroke={`${SAGE}80`}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>
    </div>
  );
}

export default function FlowZoneLayoutB(props: DashboardLayoutProps) {
  const {
    activePriorities, donePriorities, selectedPriorityId, selectedPriority,
    settings, sessionCount, totalMinutes, totalReps,
    onSelectPriority, onUpdateSettings, onAddPriority, onRemovePriority, onUpdatePriority,
    onStart, newPriority, setNewPriority, editingId, setEditingId,
  } = props;

  const editRef = useRef<HTMLInputElement>(null);

  const selectedDurationLabel = TIMER_OPTIONS.find(o => o.minutes === settings.timerMinutes)?.label ?? '—';
  const selectedBreathworkLabel = BREATHWORK_PATTERNS.find(p => p.id === settings.breathworkPatternId)?.benefit ?? '—';
  const selectedAudioLabel =
    settings.audioSource === 'none'
      ? 'Silence'
      : AUDIO_OPTIONS.find(o => o.id === settings.audioSource)?.title ?? 'Custom';

  return (
    <div className="space-y-4">

      {/* ── TOP ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* TODAY'S FOCUS — SELF / Coral */}
        <AccentCard accent={ACCENTS.focus} className="flex flex-col">
          <SectionLabel icon={Icons.focus}>Todays Focus</SectionLabel>

          <div className="space-y-2.5 flex-1 mb-3">
            {activePriorities.length === 0 && (
              <p className="text-gray-700 text-xs">Add a priority to get started.</p>
            )}
            {activePriorities.map(priority => (
              <div key={priority.id} className="flex items-center gap-2.5 group">
                <button
                  onClick={() => onSelectPriority(selectedPriorityId === priority.id ? null : priority.id)}
                  className="w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all flex items-center justify-center"
                  style={
                    selectedPriorityId === priority.id
                      ? { borderColor: CORAL, background: `${CORAL}20`, boxShadow: `0 0 8px ${CORAL}40` }
                      : { borderColor: '#444' }
                  }
                >
                  {selectedPriorityId === priority.id && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: CORAL }} />
                  )}
                </button>

                {editingId === priority.id ? (
                  <input
                    ref={editRef}
                    type="text"
                    defaultValue={priority.text}
                    autoFocus
                    className="flex-1 bg-transparent text-white text-[13px] outline-none border-b border-white/20 py-0.5"
                    onBlur={e => {
                      const val = e.target.value.trim();
                      if (val) onUpdatePriority(priority.id, val);
                      else onRemovePriority(priority.id);
                      setEditingId(null);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                ) : (
                  <span
                    className="flex-1 text-[13px] text-gray-300 cursor-pointer hover:text-white transition-colors leading-tight"
                    onClick={() => setEditingId(priority.id)}
                  >
                    {priority.text}
                  </span>
                )}

                <button
                  onClick={() => onRemovePriority(priority.id)}
                  className="text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xs flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {activePriorities.length < 5 && (
            <div className="flex items-center gap-2 border-t border-white/[0.05] pt-3">
              <span className="text-gray-600 text-sm flex-shrink-0">+</span>
              <input
                type="text"
                value={newPriority}
                onChange={e => setNewPriority(e.target.value)}
                placeholder="Add Priority"
                className="flex-1 bg-transparent text-[13px] text-gray-300 placeholder-gray-700 outline-none"
                onKeyDown={e => {
                  if (e.key === 'Enter' && newPriority.trim()) {
                    onAddPriority(newPriority);
                    setNewPriority('');
                  }
                }}
              />
            </div>
          )}
        </AccentCard>

        {/* NEXT SESSION — SPACE / Sage */}
        <AccentCard accent={ACCENTS.session} className="flex flex-col">
          <SectionLabel icon={Icons.session}>Next Session</SectionLabel>

          <div className="flex-1 mb-4">
            {selectedPriority ? (
              <p
                className="text-xl font-bold leading-tight mb-4"
                style={{
                  background: `linear-gradient(135deg, ${SAGE}, ${STEEL})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {selectedPriority.text}
              </p>
            ) : (
              <p className="text-base text-gray-700 mb-4">Select a priority to begin.</p>
            )}

            <div className="space-y-2">
              {[
                { label: 'Duration',   value: selectedDurationLabel,  color: STEEL },
                { label: 'Breathwork', value: selectedBreathworkLabel, color: CORAL },
                { label: 'Audio',      value: selectedAudioLabel,      color: SAGE },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-1 h-3 rounded-full" style={{ background: row.color }} />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">
                      {row.label}
                    </span>
                  </div>
                  <span
                    className="text-xs text-gray-200 font-medium px-3 py-1 rounded-full flex-shrink-0 max-w-[60%] truncate"
                    style={{ background: `${row.color}12`, border: `1px solid ${row.color}25` }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={selectedPriority ? onStart : undefined}
            disabled={!selectedPriority}
            className="relative w-full py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all overflow-hidden group"
            style={
              selectedPriority
                ? { background: SAGE, color: 'white', boxShadow: `0 4px 16px ${SAGE}30` }
                : { background: 'rgba(255,255,255,0.04)', color: '#444', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.06)' }
            }
          >
            {selectedPriority && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            )}
            Begin
          </button>
        </AccentCard>

        {/* DONE — STORY / Steel */}
        <AccentCard accent={ACCENTS.done} className="flex flex-col">
          <SectionLabel icon={Icons.done}>Done</SectionLabel>

          <div className="flex-1 space-y-1.5 mb-4 min-h-[60px]">
            <AnimatePresence initial={false}>
              {donePriorities.length === 0 && (
                <p className="text-gray-700 text-xs">Nothing done yet.</p>
              )}
              {donePriorities.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: `${SAGE}15`, border: `1.5px solid ${SAGE}45` }}
                  >
                    <svg width="7" height="6" viewBox="0 0 10 8" fill="none" stroke={SAGE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 4l3 3 5-6" />
                    </svg>
                  </div>
                  <StrikethroughText text={p.text} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="border-t border-white/[0.05] pt-3 flex items-center justify-around">
            {[
              { value: sessionCount, label: 'Sessions',   color: CORAL },
              { value: totalMinutes, label: 'Minutes',    color: SAGE },
              { value: totalReps,    label: 'Focus Reps', color: AMETHYST },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: stat.value > 0 ? stat.color : '#333' }} />
                <span className="text-base font-bold text-white leading-none">{stat.value}</span>
                <span className="text-[8px] uppercase tracking-wide text-gray-600">{stat.label}</span>
              </div>
            ))}
          </div>
        </AccentCard>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* DURATION — STORY / Steel */}
        <AccentCard accent={ACCENTS.duration}>
          <SectionLabel icon={Icons.clock}>Duration</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {TIMER_OPTIONS.map(opt => {
              const isSelected = settings.timerMinutes === opt.minutes;
              return (
                <button
                  key={opt.minutes}
                  onClick={() => onUpdateSettings({ timerMinutes: opt.minutes })}
                  className="py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={
                    isSelected
                      ? {
                          background: `${STEEL}20`,
                          color: STEEL,
                          border: `1px solid ${STEEL}50`,
                          boxShadow: `0 0 12px ${STEEL}25`,
                        }
                      : {
                          background: 'rgba(255,255,255,0.04)',
                          color: '#666',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }
                  }
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </AccentCard>

        {/* BREATHWORK — SELF / Coral */}
        <AccentCard accent={ACCENTS.breathwork}>
          <SectionLabel icon={Icons.breath}>Breathwork</SectionLabel>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {BREATHWORK_PATTERNS.map(pattern => {
              const isSelected = settings.breathworkPatternId === pattern.id;
              return (
                <button
                  key={pattern.id}
                  onClick={() => onUpdateSettings({ breathworkPatternId: pattern.id })}
                  className="p-2.5 rounded-xl text-left transition-all relative"
                  style={
                    isSelected
                      ? { background: `${CORAL}12`, border: `1px solid ${CORAL}40` }
                      : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }
                  }
                >
                  {isSelected && (
                    <motion.div
                      className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                      style={{ background: CORAL }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  <p className={`text-[11px] font-semibold leading-tight ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                    {pattern.benefit}
                  </p>
                  <p className="text-[9px] mt-0.5 leading-tight text-gray-700">{pattern.name}</p>
                </button>
              );
            })}
          </div>

          {/* Breath Cycles */}
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Breath Cycles</span>
            <div className="flex gap-1.5">
              {BREATH_CYCLE_OPTIONS.map(n => {
                const isSelected = settings.breathworkCycles === n;
                return (
                  <button
                    key={n}
                    onClick={() => onUpdateSettings({ breathworkCycles: n })}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={
                      isSelected
                        ? { background: `${CORAL}20`, color: CORAL, border: `1px solid ${CORAL}50`, boxShadow: `0 0 8px ${CORAL}25` }
                        : { background: 'rgba(255,255,255,0.04)', color: '#555', border: '1px solid rgba(255,255,255,0.08)' }
                    }
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active: Before / After */}
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Active</span>
            <div className="flex gap-1">
              {[
                { label: 'Before', key: 'breathworkPre'  as const, value: settings.breathworkPre },
                { label: 'After',  key: 'breathworkPost' as const, value: settings.breathworkPost },
              ].map(toggle => (
                <button
                  key={toggle.key}
                  onClick={() => onUpdateSettings({ [toggle.key]: !toggle.value })}
                  className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide transition-all"
                  style={
                    toggle.value
                      ? { background: `${CORAL}20`, color: CORAL, border: `1px solid ${CORAL}50` }
                      : { background: 'rgba(255,255,255,0.04)', color: '#555', border: '1px solid rgba(255,255,255,0.08)' }
                  }
                >
                  {toggle.label}
                </button>
              ))}
            </div>
          </div>
        </AccentCard>

        {/* AUDIO — SPACE / Sage */}
        <AccentCard accent={ACCENTS.audio}>
          <div className="flex items-center justify-between mb-3">
            <SectionLabel icon={Icons.audio}>Audio</SectionLabel>
            <div className="flex items-center gap-1.5 mb-3">
              <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-600 flex-shrink-0">
                <path d="M3 8v4h3l4 4V4L6 8H3z" />
                <path d="M14 7a4 4 0 010 6" />
              </svg>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={settings.audioVolume}
                onChange={e => onUpdateSettings({ audioVolume: parseFloat(e.target.value) })}
                className="w-20 accent-[#4E8C73]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {GRID_AUDIO.map(opt => {
              const isSelected = settings.audioSource === opt.id;
              const icon = AudioIcons[opt.id];
              return (
                <button
                  key={opt.id}
                  onClick={() => onUpdateSettings({ audioSource: opt.id })}
                  className="flex items-start gap-2 p-2.5 rounded-xl text-left transition-all"
                  style={
                    isSelected
                      ? { background: `${SAGE}12`, border: `1px solid ${SAGE}40`, borderLeft: `2px solid ${SAGE}` }
                      : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }
                  }
                >
                  {icon && (
                    <span
                      className="flex-shrink-0 mt-0.5"
                      style={{ width: 14, height: 14, color: isSelected ? SAGE : '#555' }}
                    >
                      {icon}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className={`text-[11px] font-semibold leading-tight ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                      {opt.title}
                    </p>
                    <p className="text-[9px] mt-0.5 leading-tight text-gray-700">{opt.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </AccentCard>
      </div>
    </div>
  );
}
