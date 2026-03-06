'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAudience } from '@/context/AudienceContext';

export default function AudienceIndicator() {
  const { audience, setAudience, hasSelected } = useAudience();

  return (
    <AnimatePresence>
      {hasSelected && (
        <motion.div
          className="fixed bottom-8 left-1/2 z-40"
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
            <button
              onClick={() => setAudience('individual')}
              className={`p-2.5 rounded-full transition-all duration-300 ${
                audience === 'individual'
                  ? 'bg-gradient-to-r from-[#E84535] to-[#6330A0] text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              aria-label="Personal practice"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button
              onClick={() => setAudience('leader')}
              className={`p-2.5 rounded-full transition-all duration-300 ${
                audience === 'leader'
                  ? 'bg-gradient-to-r from-[#4E8C73] to-[#3E6FA3] text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              aria-label="Leadership framework"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
