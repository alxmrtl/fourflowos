'use client';

import { useAuth } from '@/hooks/useAuth';
import AuthModal from './AuthModal';

interface AuthGateProps {
  children: React.ReactNode;
}

// Renders children normally when authenticated.
// Shows children dimmed + AuthModal overlay when not authenticated.
// During initial load, renders children normally (no flash of modal).
export default function AuthGate({ children }: AuthGateProps) {
  const { user, loading } = useAuth();

  if (loading || user) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Tool behind the gate — visible but non-interactive */}
      <div className="pointer-events-none select-none opacity-40">
        {children}
      </div>
      <AuthModal />
    </div>
  );
}
