'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  label: string;
  question: string;
  placeholder?: string;
  onSelect: (text: string) => void;
}

const MIN_CHARS = 20;

export default function TextReflection({ label, question, placeholder, onSelect }: Props) {
  const [text, setText] = useState('');
  const ready = text.trim().length >= MIN_CHARS;

  function handleSubmit() {
    if (!ready) return;
    onSelect(text.trim());
  }

  return (
    <div className="flex flex-col h-full">
      <p className="text-[9px] uppercase tracking-widest text-white/25 mb-1.5">{label}</p>
      <p className="text-white text-base font-medium leading-snug mb-5">{question}</p>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={placeholder ?? 'A few honest sentences is enough…'}
        rows={5}
        className="w-full resize-none rounded-xl px-3.5 py-3 text-sm leading-relaxed transition-all duration-200 outline-none"
        style={{
          background:   'rgba(255,255,255,0.035)',
          border:       '1px solid rgba(255,255,255,0.07)',
          color:        'rgba(255,255,255,0.85)',
          caretColor:   'rgba(255,255,255,0.6)',
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.background  = 'rgba(255,255,255,0.05)';
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
          e.currentTarget.style.background  = 'rgba(255,255,255,0.035)';
        }}
      />

      <div className="mt-5 flex justify-end">
        <motion.button
          onClick={handleSubmit}
          disabled={!ready}
          whileTap={ready ? { scale: 0.97 } : {}}
          animate={{ opacity: ready ? 1 : 0.3 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-medium tracking-wide transition-colors duration-200"
          style={{ color: 'rgba(255,255,255,0.75)' }}
          onMouseEnter={e => ready && ((e.currentTarget as HTMLButtonElement).style.color = '#fff')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.75)')}
        >
          Continue →
        </motion.button>
      </div>
    </div>
  );
}
