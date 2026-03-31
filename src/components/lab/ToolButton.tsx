'use client';

import { motion } from 'framer-motion';

interface ToolButtonProps {
  label: string;
  description: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

export default function ToolButton({ label, description, color, isActive, onClick }: ToolButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full text-left px-3 py-2.5 rounded-xl border transition-colors duration-200"
      style={{
        background: isActive ? `${color}14` : 'transparent',
        borderColor: isActive ? `${color}50` : 'rgba(255,255,255,0.07)',
        boxShadow: isActive ? `0 0 12px ${color}18` : 'none',
      }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.975 }}
      transition={{ duration: 0.12 }}
    >
      <p
        className="text-xs font-semibold leading-tight"
        style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)' }}
      >
        {label}
      </p>
      <p className="text-[10px] leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>
        {description}
      </p>
    </motion.button>
  );
}
