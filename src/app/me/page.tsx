import type { Metadata } from 'next';
import { Suspense } from 'react';
import FlowLab from '@/components/lab/FlowLab';

export const metadata: Metadata = {
  title: 'FlowLab — FourFlow',
  description: 'Your flow entry point. Breathe, choose, move.',
};

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    }>
      <FlowLab />
    </Suspense>
  );
}
