'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const TOOLS = [
  {
    id: 'flowzone',
    name: 'FlowZone',
    description: 'Deep work companion',
    path: '/tools/flowzone',
    color: '#FF6F61',
    logo: '/assets/LOGOS/FOURFLOW - MAIN LOGO.png',
  },
  {
    id: 'curiosity-explorer',
    name: 'Curiosity Explorer',
    description: 'Map your curiosities',
    path: '/tools/curiosity-explorer',
    color: '#7A4DA4',
    logo: '/assets/LOGOS/IGNITED CURIOSITY.png',
  },
  {
    id: 'flowread',
    name: 'FlowRead',
    description: 'Speed reading trainer',
    path: '/tools/flowread',
    color: '#6BA292',
    logo: '/assets/apps/flowread-icon.png',
  },
];

const FOUR_PILLAR_GRADIENT = 'linear-gradient(135deg, #FF6F61, #6BA292, #5B84B1, #7A4DA4)';

export default function ToolsNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const activeTool = TOOLS.find((t) => pathname.startsWith(t.path));
  const buttonLogo = activeTool?.logo || '/assets/LOGOS/FOURFLOW - MAIN LOGO.png';

  return (
    <div className="fixed top-3 left-3 z-50">
      {/* Logo button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="relative w-11 h-11 rounded-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 group"
        style={{
          background: open ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Subtle gradient ring on hover */}
        <div
          className="absolute inset-[-1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: FOUR_PILLAR_GRADIENT,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1px',
          }}
        />
        <div className="relative w-6 h-6">
          <Image
            src={buttonLogo}
            alt="FourFlowOS Tools"
            fill
            className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </motion.button>

      {/* Expanded panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[-1]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute top-14 left-0 w-60 rounded-xl overflow-hidden shadow-2xl"
              style={{
                background: 'rgba(18,18,18,0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {/* Gradient top edge */}
              <div className="h-px" style={{ background: FOUR_PILLAR_GRADIENT, opacity: 0.5 }} />

              {/* Back to site */}
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>
                  FourFlow<span className="text-gray-500">OS</span>
                </span>
              </Link>

              <div className="h-px mx-3 bg-white/5" />

              {/* Label */}
              <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                Tools
              </p>

              {/* Tool list */}
              <div className="pb-2">
                {TOOLS.map((tool) => {
                  const isActive = pathname.startsWith(tool.path);
                  return (
                    <Link
                      key={tool.id}
                      href={tool.path}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 mx-1.5 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                      style={isActive ? { background: `${tool.color}12` } : undefined}
                    >
                      <div className="relative w-5 h-5 flex-shrink-0">
                        <Image
                          src={tool.logo}
                          alt={tool.name}
                          fill
                          className={`object-contain ${isActive ? 'opacity-100' : 'opacity-50'}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block font-medium">{tool.name}</span>
                        <span className="block text-xs text-gray-500 mt-0.5">{tool.description}</span>
                      </div>
                      {isActive && (
                        <span
                          className="flex-shrink-0 w-1.5 h-1.5 rounded-full"
                          style={{ background: tool.color }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
