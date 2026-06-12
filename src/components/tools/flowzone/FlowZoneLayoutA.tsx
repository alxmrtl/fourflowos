'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayoutProps } from './types';
import { SAGE, CORAL, TIMER_OPTIONS, BREATHWORK_PATTERNS, AUDIO_OPTIONS } from './constants';
import { AudioIcons } from './icons';

const C = {
  cardBg: '#1c1c1c',
  cardBorder: '1px solid #2e2e2e',
  btnBg: '#252525',
  btnBorder: '1px solid #333',
  btnText: '#888',
} as const;

const BREATH_CYCLE_OPTIONS = [3, 5, 10] as const;

// Audio options shown in the 3×2 grid
const GRID_AUDIO = [
  { id: 'none', title: 'Silence', subtitle: 'No audio' },
  ...AUDIO_OPTIONS.filter(o => ['binaural', 'white-noise', 'lofi', 'rain', 'nature'].includes(o.id)),
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
      {children}
    </p>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-4 overflow-hidden ${className}`}
      style={{ background: C.cardBg, border: C.cardBorder }}
    >
      {children}
    </div>
  );
}

function Pill({
  children,
  selected,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`transition-all rounded-full text-[10px] font-semibold uppercase tracking-wide ${className}`}
      style={
        selected
          ? { background: SAGE, color: 'white' }
          : { background: C.btnBg, color: C.btnText, border: C.btnBorder }
      }
    >
      {children}
    </button>
  );
}

function StrikethroughText({ text }: { text: string }) {
  return (
    <div className="relative flex-1 min-w-0">
      <span className="text-xs text-gray-500 leading-tight">{text}</span>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M 0 50 L 100 50"
          stroke={`${SAGE}70`}
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

export default function FlowZoneLayoutA(props: DashboardLayoutProps) {
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

        {/* TODAY'S FOCUS */}
        <Card className="flex flex-col">
          <Label>Todays Focus</Label>

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
                      ? { borderColor: SAGE, background: SAGE }
                      : { borderColor: '#555' }
                  }
                >
                  {selectedPriorityId === priority.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>

                {editingId === priority.id ? (
                  <input
                    ref={editRef}
                    type="text"
                    defaultValue={priority.text}
                    autoFocus
                    className="flex-1 bg-transparent text-white text-sm outline-none border-b border-white/20 py-0.5"
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
                    className="flex-1 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors leading-tight"
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
            <div className="flex items-center gap-2 border-t border-white/[0.06] pt-3">
              <span className="text-gray-600 text-sm flex-shrink-0">+</span>
              <input
                type="text"
                value={newPriority}
                onChange={e => setNewPriority(e.target.value)}
                placeholder="Add Priority"
                className="flex-1 bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none"
                onKeyDown={e => {
                  if (e.key === 'Enter' && newPriority.trim()) {
                    onAddPriority(newPriority);
                    setNewPriority('');
                  }
                }}
              />
            </div>
          )}
        </Card>

        {/* NEXT SESSION */}
        <Card className="flex flex-col">
          <Label>Next Session</Label>

          <div className="flex-1 mb-4">
            {selectedPriority ? (
              <p className="text-xl font-bold text-white leading-tight mb-4">
                {selectedPriority.text}
              </p>
            ) : (
              <p className="text-base text-gray-600 mb-4">
                Select a priority to begin.
              </p>
            )}

            <div className="space-y-2">
              {[
                { label: 'Duration',   value: selectedDurationLabel },
                { label: 'Breathwork', value: `${selectedBreathworkLabel} · ${settings.breathworkCycles}×` },
                { label: 'Audio',      value: selectedAudioLabel },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600 flex-shrink-0">
                    {row.label}
                  </span>
                  <span
                    className="text-xs text-white font-medium px-3 py-1 rounded-full flex-shrink-0 max-w-[60%] truncate"
                    style={{ background: '#2a2a2a', border: '1px solid #3a3a3a' }}
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
            className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all"
            style={
              selectedPriority
                ? { background: SAGE, color: 'white' }
                : { background: '#252525', color: '#444', cursor: 'not-allowed', border: '1px solid #333' }
            }
          >
            Begin
          </button>
        </Card>

        {/* DONE */}
        <Card className="flex flex-col">
          <Label>Done</Label>

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
                    style={{ border: `1.5px solid ${SAGE}50` }}
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

          {/* Day stats */}
          <div className="border-t border-white/[0.06] pt-3 flex items-center justify-around">
            {[
              { value: sessionCount, label: 'Sessions' },
              { value: totalMinutes, label: 'Minutes' },
              { value: totalReps, label: 'Focus Reps' },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: '#3a3a3a' }} />
                <span className="text-base font-bold text-white leading-none">{stat.value}</span>
                <span className="text-[8px] uppercase tracking-wide text-gray-600">{stat.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* DURATION */}
        <Card>
          <Label>Duration</Label>
          <div className="grid grid-cols-2 gap-2">
            {TIMER_OPTIONS.map(opt => (
              <button
                key={opt.minutes}
                onClick={() => onUpdateSettings({ timerMinutes: opt.minutes })}
                className="py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={
                  settings.timerMinutes === opt.minutes
                    ? { background: SAGE, color: 'white' }
                    : { background: C.btnBg, color: C.btnText, border: C.btnBorder }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Card>

        {/* BREATHWORK */}
        <Card>
          <Label>Breathwork</Label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {BREATHWORK_PATTERNS.map(pattern => {
              const isSelected = settings.breathworkPatternId === pattern.id;
              return (
                <button
                  key={pattern.id}
                  onClick={() => onUpdateSettings({ breathworkPatternId: pattern.id })}
                  className="p-2.5 rounded-xl text-left transition-all"
                  style={
                    isSelected
                      ? { background: SAGE, color: 'white' }
                      : { background: C.btnBg, color: C.btnText, border: C.btnBorder }
                  }
                >
                  <p className="text-[11px] font-semibold leading-tight">{pattern.benefit}</p>
                  <p className="text-[9px] mt-0.5 leading-tight opacity-60">{pattern.name}</p>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Breath Cycles</span>
            <div className="flex gap-1.5">
              {BREATH_CYCLE_OPTIONS.map(n => (
                <Pill
                  key={n}
                  selected={settings.breathworkCycles === n}
                  onClick={() => onUpdateSettings({ breathworkCycles: n })}
                  className="w-7 h-7 flex items-center justify-center text-xs"
                >
                  {n}
                </Pill>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Active</span>
            <div className="flex gap-1">
              <Pill
                selected={settings.breathworkPre}
                onClick={() => onUpdateSettings({ breathworkPre: !settings.breathworkPre })}
                className="px-3 py-1"
              >
                Before
              </Pill>
              <Pill
                selected={settings.breathworkPost}
                onClick={() => onUpdateSettings({ breathworkPost: !settings.breathworkPost })}
                className="px-3 py-1"
              >
                After
              </Pill>
            </div>
          </div>
        </Card>

        {/* AUDIO */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <Label>Audio</Label>
            <div className="flex items-center gap-1.5 mb-3">
              <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-600">
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
                className="w-20 accent-space"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
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
                      ? { background: SAGE, color: 'white' }
                      : { background: C.btnBg, color: C.btnText, border: C.btnBorder }
                  }
                >
                  {icon && (
                    <span className="flex-shrink-0 mt-0.5 opacity-80" style={{ width: 14, height: 14 }}>
                      {icon}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold leading-tight">{opt.title}</p>
                    <p className="text-[9px] mt-0.5 leading-tight opacity-60">{opt.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
