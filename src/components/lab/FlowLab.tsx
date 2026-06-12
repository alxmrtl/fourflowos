'use client';

import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import { useLabState } from './useLabState';
import LandingNav from '@/components/landing/LandingNav';
import SectionBar from './SectionBar';
import ActivityArea from './ActivityArea';
import MobileNav from './MobileNav';

export default function FlowLab() {
  const { user, loading } = useAuth();
  const { activeTool, setActiveTool } = useLabState();

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
    </div>
  );
}
