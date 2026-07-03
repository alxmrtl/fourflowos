'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import { useLabState } from './useLabState';
import LandingNav from '@/components/landing/LandingNav';
import SectionBar from './SectionBar';
import ActivityArea from './ActivityArea';
import MobileNav from './MobileNav';
import PracticeExplainer from './PracticeExplainer';

const EXPLAINER_SEEN_KEY = 'ff_practice_intro_seen';

export default function FlowLab() {
  const { user, loading } = useAuth();
  const { activeTool, setActiveTool } = useLabState();
  const [explainerOpen, setExplainerOpen] = useState(false);

  // First visit: introduce the practice once, then stay out of the way.
  useEffect(() => {
    if (user && !localStorage.getItem(EXPLAINER_SEEN_KEY)) {
      setExplainerOpen(true);
    }
  }, [user]);

  const closeExplainer = () => {
    localStorage.setItem(EXPLAINER_SEEN_KEY, '1');
    setExplainerOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ground flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-ground flex items-center justify-center">
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ground flex flex-col">
      <LandingNav />
      {/* Spacer for fixed nav */}
      <div className="h-20 flex-shrink-0" />

      {/* Desktop: horizontal section bar */}
      <div className="hidden md:block">
        <SectionBar activeTool={activeTool} onSelectTool={setActiveTool} />
      </div>

      {/* Tool content — takes remaining space; pb-14 on mobile keeps content above fixed bottom nav */}
      <div className="flex-1 min-h-0 pb-[60px] md:pb-0">
        <ActivityArea
          activeTool={activeTool}
          onBack={() => setActiveTool('flow-lens')}
        />
      </div>

      {/* Mobile: fixed bottom nav + slide-up sheet — outside document flow */}
      <div className="md:hidden">
        <MobileNav activeTool={activeTool} onSelectTool={setActiveTool} />
      </div>

      {/* About your practice — reopens the intro */}
      <button
        onClick={() => setExplainerOpen(true)}
        className="fixed bottom-[76px] md:bottom-6 right-4 md:right-6 z-40 w-9 h-9 rounded-full border border-white/15 bg-ground-lift/80 backdrop-blur flex items-center justify-center text-gray-500 hover:text-gray-200 hover:border-white/30 transition-colors"
        aria-label="About your practice"
        title="About your practice"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <PracticeExplainer open={explainerOpen} onClose={closeExplainer} />
    </div>
  );
}
