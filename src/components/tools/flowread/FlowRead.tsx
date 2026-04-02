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
      {/* Header — only rendered on standalone route (not when embedded in ActivityArea) */}
      {!hideHeader && (
        <>
          <header className="flex items-center justify-between px-6 py-5 pl-[68px]">
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
          </header>
          <div
            className="h-px mx-6"
            style={{
              background: FOUR_PILLAR_GRADIENT,
              opacity: store.isTraining ? 0.15 : 0.4,
              transition: 'opacity 0.3s ease'
            }}
          />
        </>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col px-6 pb-6 pt-6 max-w-3xl mx-auto w-full">
        {store.activeTab === 'train' && (
          <TrainScreen
            trainingMode={store.trainingMode}
            setTrainingMode={store.setTrainingMode}
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
            onShowMore={() => store.setActiveTab('about')}
          />
        )}

        {store.activeTab === 'about' && <AboutScreen />}
      </main>
    </div>
  );
}
