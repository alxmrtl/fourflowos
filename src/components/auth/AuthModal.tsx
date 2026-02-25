'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

type ModalState = 'idle' | 'submitting' | 'sent';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  expired: 'Your sign-in link expired. Request a new one below.',
  used: 'That sign-in link has already been used. Request a new one below.',
  failed: 'Sign-in failed. Please try again.',
};

export default function AuthModal({
  onClose,
  authError,
}: {
  onClose?: () => void;
  authError?: 'expired' | 'used' | 'failed' | null;
}) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<ModalState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(
    authError ? (AUTH_ERROR_MESSAGES[authError] ?? AUTH_ERROR_MESSAGES.failed) : null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setState('submitting');
    setErrorMsg(null);

    const { error } = await signIn(email.trim());

    if (error) {
      setErrorMsg(error);
      setState('idle');
    } else {
      setState('sent');
    }
  }

  return (
    /* Full-screen overlay */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — clickable to dismiss when onClose is provided */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className="relative w-full max-w-sm rounded-2xl p-8 shadow-2xl"
        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-gray-600 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {state === 'sent' ? (
          <SentState email={email} onResend={() => setState('idle')} />
        ) : (
          <IdleState
            email={email}
            onEmailChange={setEmail}
            onSubmit={handleSubmit}
            submitting={state === 'submitting'}
            error={errorMsg}
          />
        )}
      </div>
    </div>
  );
}

function IdleState({
  email,
  onEmailChange,
  onSubmit,
  submitting,
  error,
}: {
  email: string;
  onEmailChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error: string | null;
}) {
  return (
    <>
      <div className="mb-6 text-center">
        {/* Four pillar gradient dot */}
        <div
          className="mx-auto mb-4 h-10 w-10 rounded-full"
          style={{ background: 'linear-gradient(135deg, #FF6F61, #6BA292, #5B84B1, #7A4DA4)' }}
        />
        <h2 className="text-xl font-semibold text-white">Sign in to continue</h2>
        <p className="mt-1 text-sm" style={{ color: '#888' }}>
          Your data syncs across sessions. No password required.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="you@example.com"
          required
          autoFocus
          disabled={submitting}
          className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none transition"
          style={{
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.3)')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
        />

        {error && (
          <p className="text-xs" style={{ color: '#FF6F61' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !email.trim()}
          className="w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #5B84B1, #7A4DA4)' }}
        >
          {submitting ? 'Sending…' : 'Send magic link'}
        </button>
      </form>
    </>
  );
}

function SentState({ email, onResend }: { email: string; onResend: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'rgba(107,162,146,0.15)' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#6BA292" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10l5 5 9-9" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-white">Check your email</h2>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: '#888' }}>
        We sent a sign-in link to{' '}
        <span className="text-white">{email}</span>.
        <br />
        Click it to continue — no password needed.
      </p>
      <p className="mt-4 text-xs" style={{ color: '#555' }}>
        Link expires in 15 minutes.{' '}
        <button
          onClick={onResend}
          className="underline hover:text-white transition-colors"
        >
          Send another
        </button>
      </p>
    </div>
  );
}
