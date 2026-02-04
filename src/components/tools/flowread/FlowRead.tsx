'use client';

import { useFlowReadStore } from './useFlowReadStore';
import { Tab } from './types';
import { SAGE, FOUR_PILLAR_GRADIENT } from './constants';
import TrainScreen from './TrainScreen';
import AboutScreen from './AboutScreen';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'train', label: 'Train', icon: '△' },
  { id: 'about', label: 'About', icon: '?' },
];

export default function FlowRead() {
  const store = useFlowReadStore();

  if (!store.mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 pl-[68px]">
        <h1
          className="text-lg font-bold tracking-tight"
          style={{
            background: `linear-gradient(135deg, ${SAGE}, #5B84B1)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          FlowRead
        </h1>

        {/* Tab Navigation */}
        <nav className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => store.setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                store.activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
              style={
                store.activeTab === tab.id
                  ? { background: `${SAGE}20`, border: `1px solid ${SAGE}30` }
                  : {}
              }
            >
              <span className="mr-1.5 opacity-60">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Four-pillar gradient line */}
      <div className="h-px mx-6" style={{ background: FOUR_PILLAR_GRADIENT, opacity: 0.4 }} />

      {/* Main content */}
      <main className="flex-1 px-6 pb-6 pt-6 max-w-4xl mx-auto w-full">
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
            selectedTextId={store.settings.selectedTextId}
            selectText={store.selectText}
            savedTexts={store.savedTexts}
            addSavedText={store.addSavedText}
            deleteSavedText={store.deleteSavedText}
            isTraining={store.isTraining}
            isPaused={store.isPaused}
            trainingProgress={store.trainingProgress}
            setTrainingProgress={store.setTrainingProgress}
            currentIndex={store.currentIndex}
            setCurrentIndex={store.setCurrentIndex}
            startTraining={store.startTraining}
            pauseTraining={store.pauseTraining}
            resumeTraining={store.resumeTraining}
            stopTraining={store.stopTraining}
            textModalOpen={store.textModalOpen}
            setTextModalOpen={store.setTextModalOpen}
          />
        )}

        {store.activeTab === 'about' && <AboutScreen />}
      </main>
    </div>
  );
}
