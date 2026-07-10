import { Suspense } from 'react';
import WorkshopIntake from '@/components/profile/WorkshopIntake';

export const metadata = {
  title: 'The Flow Map — FourFlowOS',
  description:
    'Feed your Flow Map to us — your Flow Profile, a full personal reading, lands in your inbox within 48 hours.',
  robots: { index: false, follow: false },
};

export default function WorkshopIntakePage() {
  return (
    // Suspense boundary required for useSearchParams (?c= cohort pre-fill)
    <Suspense fallback={<div className="min-h-screen bg-ground" />}>
      <WorkshopIntake />
    </Suspense>
  );
}
