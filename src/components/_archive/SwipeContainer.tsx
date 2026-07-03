'use client';

import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface SwipeContainerProps {
  children: ReactNode;
}

const DIMENSIONS = ['self', 'space', 'story', 'spirit'] as const;

export default function SwipeContainer({ children }: SwipeContainerProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Get current dimension index
  const getCurrentDimensionIndex = () => {
    if (pathname === '/') return -1; // Framework page
    
    const pathParts = pathname.split('/');
    if (pathParts[1] === 'dimension' && pathParts[2]) {
      const dimension = pathParts[2] as typeof DIMENSIONS[number];
      return DIMENSIONS.indexOf(dimension);
    }
    return -1;
  };

  const currentIndex = getCurrentDimensionIndex();

  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const bind = useGesture({
    onDrag: ({ active, movement: [mx, my], direction: [xDir], cancel, first }) => {
      // Only enable swipe on dimension pages, not framework page
      if (currentIndex === -1) return;

      // If this is the first movement and it's more vertical than horizontal, cancel
      if (first && Math.abs(my) > Math.abs(mx)) {
        cancel();
        return;
      }

      const trigger = Math.abs(mx) > 50;

      // Cancel drag if we're at the edges
      if ((currentIndex === 0 && xDir > 0) || (currentIndex === DIMENSIONS.length - 1 && xDir < 0)) {
        cancel();
        return;
      }

      if (active && !trigger) {
        api.start({ x: mx, immediate: true });
      } else {
        let newIndex = currentIndex;
        
        if (trigger) {
          newIndex = currentIndex + (xDir > 0 ? -1 : 1);
          newIndex = Math.max(0, Math.min(DIMENSIONS.length - 1, newIndex));
          
          if (newIndex !== currentIndex) {
            router.push(`/dimension/${DIMENSIONS[newIndex]}`);
          }
        }
        
        api.start({ x: 0, immediate: false });
      }
    }
  }, {
    drag: {
      axis: 'x',
      bounds: { left: -100, right: 100 },
      rubberband: true,
      threshold: 10,
      filterTaps: true
    }
  });

  return (
    <animated.div
      {...bind()}
      style={{ x }}
      className="touch-pan-y select-none"
    >
      {children}
    </animated.div>
  );
}