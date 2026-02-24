'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function TopBarUserButton() {
  const { user, loading } = useAuth();

  // Reserve space during load to prevent layout shift
  if (loading) return <div className="w-9 h-9" />;

  return (
    <Link
      href="/me"
      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
      aria-label={user ? 'Your Flow Profile' : 'Sign in'}
      title={user ? 'Your Flow Profile' : 'Sign in to FourFlow'}
    >
      <svg
        className="w-5 h-5 transition-colors"
        style={{ color: user ? '#6BA292' : '#555' }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </Link>
  );
}
