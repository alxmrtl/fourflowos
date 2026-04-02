'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlowReadStore } from './useFlowReadStore';
import { SAGE, FOUR_PILLAR_GRADIENT } from './constants';
import TrainScreen from './TrainScreen';
import AboutScreen from './AboutScreen';

export default function FlowRead({ hideHeader }: { hideHeader?: boolean } = {}) {
  const store = useFlowReadStore();
  const [showModal, setShowModal] = useState(false);

  if (!store.mounted) return null;

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white flex flex-col">
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
          onShowMore={() => setShowModal(true)}
        />
      </main>

      {/* About modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-50 flex flex-col"
            style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(8px)' }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <span className="text-sm font-medium text-white/70">FlowRead</span>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="max-w-3xl mx-auto">
                <AboutScreen />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
