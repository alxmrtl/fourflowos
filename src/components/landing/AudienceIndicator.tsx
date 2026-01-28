'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAudience } from '@/context/AudienceContext';

export default function AudienceIndicator() {
  const { audience, setAudience, hasSelected } = useAudience();

  const labels = {
    individual: 'Personal practice',
    leader: 'Leadership framework',
  };

  const switchTo = audience === 'individual' ? 'leader' : 'individual';

  return (
    <AnimatePresence>
      {hasSelected && (
        <motion.div
          className="fixed top-20 left-1/2 z-40"
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
            <span className="text-sm text-gray-400">Viewing:</span>
            <span className="text-sm text-white font-medium">
              {audience && labels[audience]}
            </span>
            <span className="text-gray-600 mx-1">|</span>
            <button
              onClick={() => setAudience(switchTo)}
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Switch to {labels[switchTo]}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
