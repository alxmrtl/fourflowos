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
      opacity: 0.8
    },
    in: {
      opacity: 1
    },
    out: {
      opacity: 0.8
    }
  };

  const pageTransition = {
    type: 'tween' as const,
    ease: 'easeOut' as const,
    duration: 0.15
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}