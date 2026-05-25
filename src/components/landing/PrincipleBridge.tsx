'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function PrincipleBridge({ children, className = '' }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.p
      ref={ref}
      className={`font-display italic text-white/35 text-sm md:text-base text-center mt-10 md:mt-14 ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 }}
    >
      {children}
    </motion.p>
  );
}
