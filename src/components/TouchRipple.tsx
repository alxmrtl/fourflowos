'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TouchRippleProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  disabled?: boolean;
}

interface RippleEffect {
  id: number;
  x: number;
  y: number;
  size: number;
}

export default function TouchRipple({ 
  children, 
  color = 'rgba(255, 255, 255, 0.3)', 
  className = '',
  disabled = false 
}: TouchRippleProps) {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const rippleIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const createRipple = (event: React.MouseEvent | React.TouchEvent) => {
    if (disabled || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Calculate size to cover the entire element
    const size = Math.max(rect.width, rect.height) * 2;
    
    const newRipple: RippleEffect = {
      id: rippleIdRef.current++,
      x: x - size / 2,
      y: y - size / 2,
      size
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseDown={createRipple}
      onTouchStart={createRipple}
      style={{ touchAction: 'manipulation' }}
    >
      {children}
      
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: color,
            }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}