import { ReactNode } from 'react';

export const BreathworkIcons: Record<string, ReactNode> = {
  box: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <circle cx="10" cy="10" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),
  '478': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3C6 3 3 6 3 10s3 7 7 7" />
      <path d="M10 17c4 0 7-3 7-7S14 3 10 3" strokeOpacity="0.4" />
      <path d="M10 7v6l3 2" />
    </svg>
  ),
  coherent: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 10c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  energize: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" />
    </svg>
  ),
};

export const AudioIcons: Record<string, ReactNode> = {
  'white-noise': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 10h2M6 6h2v8H6zM10 4h2v12h-2zM14 7h2v6h-2zM18 9h-1v2h1" />
    </svg>
  ),
  binaural: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 8a6 6 0 0112 0" />
      <path d="M6 8a4 4 0 018 0" />
      <circle cx="7" cy="13" r="2" />
      <circle cx="13" cy="13" r="2" />
      <path d="M5 13V9M15 13V9" />
    </svg>
  ),
  rain: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M5 8a5 5 0 0110 0 3 3 0 01-1 6H6a3 3 0 01-1-6z" />
      <path d="M7 16l-1 2M10 16l-1 2M13 16l-1 2" />
    </svg>
  ),
  lofi: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="14" height="10" rx="2" />
      <circle cx="10" cy="11" r="3" />
      <circle cx="10" cy="11" r="1" fill="currentColor" stroke="none" />
      <path d="M6 6V4h8v2" />
    </svg>
  ),
  nature: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2l-5 8h3l-3 8h10l-3-8h3z" />
    </svg>
  ),
  classical: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M7 16V6l10-3v10" />
      <circle cx="5" cy="16" r="2" />
      <circle cx="15" cy="13" r="2" />
    </svg>
  ),
  none: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 3l14 14" />
      <path d="M10 4v5M10 14v2" />
      <path d="M6 8a4.5 4.5 0 015-3.5" />
      <path d="M14 12a4.5 4.5 0 01-5 3.5" />
    </svg>
  ),
  custom: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3v14M3 10h14" />
      <circle cx="10" cy="10" r="7" />
    </svg>
  ),
};

export function YTBadge() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" className="flex-shrink-0 opacity-50">
      <rect width="14" height="10" rx="2" fill="#FF0000" />
      <polygon points="5.5,2 5.5,8 10,5" fill="white" />
    </svg>
  );
}
