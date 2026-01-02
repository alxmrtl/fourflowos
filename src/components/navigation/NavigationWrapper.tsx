'use client';

import { usePathname } from 'next/navigation';
import BottomKeysNav from './BottomKeysNav';
import BottomNav from './BottomNav';
import { DimensionType, KeyType } from '@/types/framework';

export default function NavigationWrapper() {
  const pathname = usePathname();

  // Hide navigation on landing page, privacy page, and other non-framework pages
  const hideNavPages = ['/', '/privacy'];
  if (hideNavPages.includes(pathname)) {
    return null;
  }

  // Extract current dimension and key from pathname
  const getCurrentContext = () => {
    const pathParts = pathname.split('/');

    if (pathParts[1] === 'dimension' && pathParts[2]) {
      const dimension = pathParts[2] as DimensionType;

      if (pathParts[3] === 'key' && pathParts[4]) {
        const key = pathParts[4] as KeyType;
        return { dimension, key };
      }

      return { dimension, key: undefined };
    }

    return { dimension: undefined, key: undefined };
  };

  const { dimension, key } = getCurrentContext();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <BottomKeysNav currentDimension={dimension} currentKey={key} />
      <BottomNav />
    </div>
  );
}