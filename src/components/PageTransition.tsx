'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.95
    },
    in: {
      opacity: 1,
      scale: 1
    },
    out: {
      opacity: 0,
      scale: 1.02
    }
  };

  const pageTransition = {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
    mass: 0.8
  };

  return (
    <div className="relative w-full min-h-screen">
      <AnimatePresence initial={false}>
        <motion.div
          key={pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="absolute inset-0 w-full"
          style={{ backgroundColor: '#f9fafb' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}