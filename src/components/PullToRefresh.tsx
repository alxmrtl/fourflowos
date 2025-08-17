'use client';

import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';
import { useState, ReactNode } from 'react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh?: () => Promise<void> | void;
  threshold?: number;
}

export default function PullToRefresh({ 
  children, 
  onRefresh,
  threshold = 80 
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [{ y, rotate }, api] = useSpring(() => ({ 
    y: 0, 
    rotate: 0 
  }));

  const bind = useGesture({
    onDrag: async ({ active, movement: [, my], direction: [, yDir] }) => {
      // Only allow pull down from top
      if (my < 0 || yDir < 0) return;

      // Check if we're at the top of the page
      if (window.scrollY > 0) return;

      const progress = Math.min(my / threshold, 1);
      const shouldRefresh = !active && my > threshold;

      if (active) {
        api.start({ 
          y: my * 0.5, // Reduce the pull distance for elastic feel
          rotate: progress * 180,
          immediate: true 
        });
      } else {
        if (shouldRefresh && onRefresh && !isRefreshing) {
          setIsRefreshing(true);
          api.start({ y: 60, rotate: 180 });
          
          try {
            await onRefresh();
          } finally {
            setIsRefreshing(false);
            api.start({ y: 0, rotate: 0 });
          }
        } else {
          api.start({ y: 0, rotate: 0 });
        }
      }
    }
  }, {
    drag: {
      axis: 'y',
      bounds: { top: 0 },
      rubberband: true
    }
  });

  return (
    <animated.div
      {...bind()}
      style={{ y }}
      className="touch-pan-x"
    >
      {/* Pull to refresh indicator */}
      <animated.div 
        className="flex justify-center items-center h-16 text-gray-500"
        style={{
          opacity: y.to([0, threshold], [0, 1]),
          transform: rotate.to(r => `rotate(${r}deg)`)
        }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </animated.div>
      
      {children}
    </animated.div>
  );
}