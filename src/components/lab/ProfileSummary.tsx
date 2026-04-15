'use client';

import CoreSection from '@/components/core/CoreSection';

export default function ProfileSummary({ mode }: { mode?: 'lens' | 'esoteric' }) {
  return <CoreSection mode={mode} />;
}
