'use client';
import { Suspense } from 'react';
import AdminAuth from '@/components/profile/AdminAuth';
import AdminProfilePreview from '@/components/profile/AdminProfilePreview';

export default function PreviewPage() {
  return (
    <AdminAuth>
      <Suspense
        fallback={
          <div className="min-h-screen bg-ground flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        }
      >
        <AdminProfilePreview />
      </Suspense>
    </AdminAuth>
  );
}
