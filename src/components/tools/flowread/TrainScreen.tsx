'use client';

import { useCallback } from 'react';
import { TrainingMode, FontType, SavedText } from './types';
import { SAGE, MIN_WPM, MAX_WPM, WPM_STEP, MIN_FONT_SIZE, MAX_FONT_SIZE, SAMPLE_TEXTS } from './constants';
import TrainingDisplay from './TrainingDisplay';
import TextManagerModal from './TextManagerModal';

interface TrainScreenProps {
  trainingMode: TrainingMode;
  setTrainingMode: (mode: TrainingMode) => void;
  wpm: number;
  setWpm: (wpm: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontType: FontType;
  setFontType: (type: FontType) => void;
  selectedTextId: string | null;
  selectText: (textId: string | null) => void;
  savedTexts: SavedText[];
  addSavedText: (title: string, content: string) => SavedText;
  deleteSavedText: (id: string) => void;
  isTraining: boolean;
  isPaused: boolean;
  trainingProgress: number;
  setTrainingProgress: (progress: number) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  startTraining: () => void;
  pauseTraining: () => void;
  resumeTraining: () => void;
  stopTraining: () => void;
  textModalOpen: boolean;
  setTextModalOpen: (open: boolean) => void;
}

const modeConfig = [
  { mode: 'word' as TrainingMode, label: 'Word', icon: '◈' },
  { mode: 'phrases' as TrainingMode, label: 'Phrases', icon: '◆' },
  { mode: 'line' as TrainingMode, label: 'Line', icon: '▣' },
];

export default function TrainScreen({
  trainingMode,
  setTrainingMode,
  wpm,
  setWpm,
  fontSize,
  setFontSize,
  fontType,
  setFontType,
  selectedTextId,
  selectText,
  savedTexts,
  addSavedText,
  deleteSavedText,
  isTraining,
  isPaused,
  startTraining,
  pauseTraining,
  resumeTraining,
  stopTraining,
  setTrainingProgress,
  setCurrentIndex,
  textModalOpen,
  setTextModalOpen,
}: TrainScreenProps) {
  // Get selected text content
  const getTextContent = useCallback(() => {
    if (!selectedTextId) return null;

    const sampleText = SAMPLE_TEXTS.find((t) => t.id === selectedTextId);
    if (sampleText) return sampleText;

    const savedText = savedTexts.find((t) => t.id === selectedTextId);
    if (savedText) return { title: savedText.title, content: savedText.content, wordCount: savedText.wordCount };

    return null;
  }, [selectedTextId, savedTexts]);

  const selectedText = getTextContent();

  const handleProgressUpdate = useCallback(
    (progress: number, index: number) => {
      setTrainingProgress(progress);
      setCurrentIndex(index);
    },
    [setTrainingProgress, setCurrentIndex]
  );

  const handleComplete = useCallback(() => {
    stopTraining();
  }, [stopTraining]);

  return (
    <div className="space-y-4">
      {/* Training Controls - only show when not training */}
      {!isTraining && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mode Selection */}
          <div
            className="relative rounded-2xl p-4"
            style={{
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="absolute top-0 left-4 right-4 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${SAGE}40, transparent)` }}
            />

            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Mode</h3>

            <div className="flex gap-2">
              {modeConfig.map(({ mode, label, icon }) => (
                <button
                  key={mode}
                  onClick={() => setTrainingMode(mode)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    trainingMode === mode
                      ? 'text-white'
                      : 'text-gray-500 hover:text-white bg-white/[0.03] border border-white/[0.06]'
                  }`}
                  style={
                    trainingMode === mode
                      ? { background: `${SAGE}20`, border: `1px solid ${SAGE}40` }
                      : {}
                  }
                >
                  <span className="mr-1">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Selection */}
          <div
            className="relative rounded-2xl p-4"
            style={{
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="absolute top-0 left-4 right-4 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${SAGE}40, transparent)` }}
            />

            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Text</h3>

            <button
              onClick={() => setTextModalOpen(true)}
              className="w-full py-2 px-3 rounded-lg text-sm font-medium text-white bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all text-left"
            >
              {selectedText ? (
                <div>
                  <p className="truncate">{selectedText.title}</p>
                  <p className="text-xs text-gray-500">{selectedText.wordCount} words</p>
                </div>
              ) : (
                <span className="text-gray-500">Choose Text</span>
              )}
            </button>
          </div>

          {/* Style Controls */}
          <div
            className="relative rounded-2xl p-4"
            style={{
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="absolute top-0 left-4 right-4 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${SAGE}40, transparent)` }}
            />

            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Style</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-8">{fontSize}px</span>
                <input
                  type="range"
                  min={MIN_FONT_SIZE}
                  max={MAX_FONT_SIZE}
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="flex-1"
                  style={{ accentColor: SAGE }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFontType('serif')}
                  className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-all ${
                    fontType === 'serif'
                      ? 'text-white'
                      : 'text-gray-500 hover:text-white bg-white/[0.03]'
                  }`}
                  style={
                    fontType === 'serif'
                      ? { background: `${SAGE}20`, border: `1px solid ${SAGE}40` }
                      : { border: '1px solid rgba(255,255,255,0.06)' }
                  }
                >
                  Serif
                </button>
                <button
                  onClick={() => setFontType('sans')}
                  className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-all ${
                    fontType === 'sans'
                      ? 'text-white'
                      : 'text-gray-500 hover:text-white bg-white/[0.03]'
                  }`}
                  style={
                    fontType === 'sans'
                      ? { background: `${SAGE}20`, border: `1px solid ${SAGE}40` }
                      : { border: '1px solid rgba(255,255,255,0.06)' }
                  }
                >
                  Sans
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Speed Control Bar */}
      <div
        className="relative rounded-2xl p-4"
        style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="absolute top-0 left-4 right-4 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${SAGE}40, transparent)` }}
        />

        <div className="flex items-center gap-4">
          {/* Control buttons */}
          <div className="flex gap-2">
            {!isTraining ? (
              <button
                onClick={startTraining}
                disabled={!selectedText}
                className="px-6 py-2 rounded-lg text-white font-medium transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: SAGE }}
              >
                ▶ Start
              </button>
            ) : (
              <>
                <button
                  onClick={isPaused ? resumeTraining : pauseTraining}
                  className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-[1.02]"
                  style={{ background: SAGE }}
                >
                  {isPaused ? '▶' : '⏸'}
                </button>
                <button
                  onClick={stopTraining}
                  className="px-4 py-2 rounded-lg text-white font-medium bg-white/10 hover:bg-white/20 transition-all"
                >
                  ⏹
                </button>
              </>
            )}
          </div>

          {/* Speed slider */}
          <div className="flex-1 flex items-center gap-3">
            <div className="text-sm font-bold text-white min-w-[60px]">
              {wpm} <span className="text-xs font-normal text-gray-500">WPM</span>
            </div>
            <input
              type="range"
              min={MIN_WPM}
              max={MAX_WPM}
              step={WPM_STEP}
              value={wpm}
              onChange={(e) => setWpm(parseInt(e.target.value))}
              className="flex-1"
              style={{ accentColor: SAGE }}
            />
          </div>
        </div>
      </div>

      {/* Training Display */}
      {selectedText && (
        <TrainingDisplay
          mode={trainingMode}
          text={selectedText.content}
          wpm={wpm}
          fontSize={fontSize}
          fontType={fontType}
          isTraining={isTraining}
          isPaused={isPaused}
          onProgressUpdate={handleProgressUpdate}
          onComplete={handleComplete}
        />
      )}

      {!selectedText && (
        <div
          className="relative rounded-2xl p-8 min-h-[300px] flex items-center justify-center"
          style={{
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p className="text-gray-600">Select a text to begin training</p>
        </div>
      )}

      {/* Text Manager Modal */}
      <TextManagerModal
        isOpen={textModalOpen}
        onClose={() => setTextModalOpen(false)}
        savedTexts={savedTexts}
        selectedTextId={selectedTextId}
        onSelectText={selectText}
        onAddText={addSavedText}
        onDeleteText={deleteSavedText}
      />
    </div>
  );
}
