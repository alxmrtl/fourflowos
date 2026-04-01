'use client';

import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import { useLabState } from './useLabState';
import LandingNav from '@/components/landing/LandingNav';
import SectionBar from './SectionBar';
import ActivityArea from './ActivityArea';

export default function FlowLab() {
  const { user, loading } = useAuth();
  const { activeTool, setActiveTool } = useLabState();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <LandingNav />
      {/* Spacer for fixed nav — matches py-5 + logo height */}
      <div className="h-20 flex-shrink-0" />
      <SectionBar activeTool={activeTool} onSelectTool={setActiveTool} />
      <ActivityArea
        activeTool={activeTool}
        onBack={() => setActiveTool('profile')}
      />
    </div>
  );
}
