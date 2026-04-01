'use client';

import { useFlowReadStore } from './useFlowReadStore';
import { Tab, TrainingMode } from './types';
import { SAGE, FOUR_PILLAR_GRADIENT } from './constants';
import TrainScreen from './TrainScreen';
import AboutScreen from './AboutScreen';

export default function FlowRead({ hideHeader }: { hideHeader?: boolean } = {}) {
  const store = useFlowReadStore();

  if (!store.mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header — title hidden when embedded in ActivityArea (which renders its own ToolHeader) */}
      <header className={`flex items-center justify-between px-6 ${hideHeader ? 'py-3 pt-4' : 'py-5 pl-[68px]'}`}>
        {!hideHeader && (
          <h1
            className="text-lg font-semibold tracking-tight"
            style={{
              background: `linear-gradient(135deg, ${SAGE}, #3E6FA3)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            FlowRead
          </h1>
        )}

        {/* Mode Toggle + About */}
        <div className="flex items-center gap-6">
          {/* Training Mode Toggle - only show when on train tab and not training */}
          {store.activeTab === 'train' && !store.isTraining && (
            <div className="flex items-center gap-1 text-sm">
              <button
                onClick={() => store.setTrainingMode('word')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  store.trainingMode === 'word'
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
                style={
                  store.trainingMode === 'word'
                    ? { background: `${SAGE}20` }
                    : {}
                }
              >
                Word
              </button>
              <span className="text-gray-600">·</span>
              <button
                onClick={() => store.setTrainingMode('phrases')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  store.trainingMode === 'phrases'
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
                style={
                  store.trainingMode === 'phrases'
                    ? { background: `${SAGE}20` }
                    : {}
                }
              >
                Phrases
              </button>
            </div>
          )}

          {/* About tab toggle */}
          <button
            onClick={() => store.setActiveTab(store.activeTab === 'about' ? 'train' : 'about')}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
              store.activeTab === 'about'
                ? 'text-white bg-white/10'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            ?
          </button>
        </div>
      </header>

      {/* Four-pillar gradient line — hidden when ActivityArea renders its own separator */}
      {!hideHeader && (
        <div
          className="h-px mx-6"
          style={{
            background: FOUR_PILLAR_GRADIENT,
            opacity: store.isTraining ? 0.15 : 0.4,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col px-6 pb-6 pt-6 max-w-3xl mx-auto w-full">
        {store.activeTab === 'train' && (
          <TrainScreen
            trainingMode={store.trainingMode}
            wpm={store.settings.wpm}
            setWpm={store.setWpm}
            fontSize={store.settings.fontSize}
            setFontSize={store.setFontSize}
            fontType={store.settings.fontType}
            setFontType={store.setFontType}
            textInput={store.textInput}
            setInputTitle={store.setInputTitle}
            setInputContent={store.setInputContent}
            clearTextInput={store.clearTextInput}
            inputWordCount={store.inputWordCount}
            isTraining={store.isTraining}
            isPaused={store.isPaused}
            setTrainingProgress={store.setTrainingProgress}
            setCurrentIndex={store.setCurrentIndex}
            startTraining={store.startTraining}
            pauseTraining={store.pauseTraining}
            resumeTraining={store.resumeTraining}
            stopTraining={store.stopTraining}
          />
        )}

        {store.activeTab === 'about' && <AboutScreen />}
      </main>
    </div>
  );
}
