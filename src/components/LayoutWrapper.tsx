'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Pages that use the landing/standalone layout (no bottom nav padding)
  const landingPages = ['/', '/privacy'];
  const isLandingPage = landingPages.includes(pathname);

  if (isLandingPage) {
    // Landing page layout - no extra wrapper styles
    return <>{children}</>;
  }

  // Framework app layout with bottom nav padding
  return (
    <div className="min-h-screen bg-gray-50 pb-40 safe-area-top no-scroll-bounce">
      {children}
    </div>
  );
}
