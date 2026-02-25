import type { Metadata } from 'next';
import { Suspense } from 'react';
import MePage from '@/components/me/MePage';

export const metadata: Metadata = {
  title: 'Your Flow Profile — FourFlow',
  description: 'Your consciousness alignment profile and live signal dashboard.',
};

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white/70 animate-spin" />
      </div>
    }>
      <MePage />
    </Suspense>
  );
}
