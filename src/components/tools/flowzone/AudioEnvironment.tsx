'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SAGE, AMBIENT_SOUNDS, CURATED_PLAYLISTS } from './constants';

interface AudioEnvironmentProps {
  activeSounds: Set<string>;
  volume: number;
  youtubeVideoId: string | null;
  youtubeReady: boolean;
  onToggleSound: (id: string) => void;
  onSetVolume: (v: number) => void;
  onPlayYoutube: (input: string) => void;
  onStopYoutube: () => void;
}

export default function AudioEnvironment({
  activeSounds,
  volume,
  youtubeVideoId,
  youtubeReady,
  onToggleSound,
  onSetVolume,
  onPlayYoutube,
  onStopYoutube,
}: AudioEnvironmentProps) {
  const [youtubeInput, setYoutubeInput] = useState('');
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white text-xs transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        Audio {activeSounds.size > 0 || youtubeVideoId ? `(${activeSounds.size + (youtubeVideoId ? 1 : 0)} active)` : ''}
        <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/10"
        >
          {/* Ambient sounds */}
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Ambient Sounds</p>
          <div className="flex gap-2 mb-4">
            {AMBIENT_SOUNDS.map(sound => (
              <button
                key={sound.id}
                onClick={() => onToggleSound(sound.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeSounds.has(sound.id)
                    ? 'text-white'
                    : 'text-gray-500 bg-white/5 border border-white/10 hover:text-gray-300'
                }`}
                style={activeSounds.has(sound.id) ? { background: SAGE } : {}}
              >
                {sound.icon} {sound.name}
              </button>
            ))}
          </div>

          {/* Volume */}
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Volume</p>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={e => onSetVolume(parseFloat(e.target.value))}
            className="w-full mb-4 accent-[#6BA292]"
          />

          {/* YouTube */}
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">YouTube Audio</p>
          {youtubeVideoId ? (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-400 flex-1 truncate">
                {youtubeReady ? 'Playing' : 'Loading...'} — {youtubeVideoId}
              </span>
              <button
                onClick={onStopYoutube}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Stop
              </button>
            </div>
          ) : (
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={youtubeInput}
                onChange={e => setYoutubeInput(e.target.value)}
                placeholder="Paste YouTube URL..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#6BA292]/60"
                onKeyDown={e => {
                  if (e.key === 'Enter' && youtubeInput.trim()) {
                    onPlayYoutube(youtubeInput.trim());
                    setYoutubeInput('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (youtubeInput.trim()) {
                    onPlayYoutube(youtubeInput.trim());
                    setYoutubeInput('');
                  }
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all"
                style={{ background: SAGE }}
              >
                Play
              </button>
            </div>
          )}

          {/* Curated playlists */}
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Curated Playlists</p>
          <div className="flex flex-wrap gap-1.5">
            {CURATED_PLAYLISTS.map(pl => (
              <button
                key={pl.id}
                onClick={() => onPlayYoutube(pl.youtubeId)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  youtubeVideoId === pl.youtubeId
                    ? 'text-white bg-[#6BA292]'
                    : 'text-gray-500 bg-white/5 border border-white/10 hover:text-gray-300'
                }`}
              >
                {pl.title}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
