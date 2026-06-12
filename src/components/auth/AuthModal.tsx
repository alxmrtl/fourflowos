'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { GRADIENTS } from '@/styles/brand-colors';

type ModalState = 'idle' | 'submitting' | 'sent' | 'reset-sent';
type AuthTab = 'magic' | 'password';
type PasswordMode = 'signin' | 'signup';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  expired: 'Your sign-in link expired. Request a new one below.',
  used: 'That sign-in link has already been used. Request a new one below.',
  failed: 'Sign-in failed. Please try again.',
};

// Friendly error mapping for Supabase password auth errors
function mapPasswordError(raw: string): string {
  if (raw.includes('Invalid login credentials')) return 'Wrong email or password.';
  if (raw.includes('Email not confirmed')) return 'Please confirm your email first. Check your inbox.';
  if (raw.includes('User already registered')) return 'An account with this email already exists. Sign in instead.';
  if (raw.includes('Password should be')) return 'Password must be at least 6 characters.';
  return raw;
}

export default function AuthModal({
  onClose,
  authError,
}: {
  onClose?: () => void;
  authError?: 'expired' | 'used' | 'failed' | null;
}) {
  const { signIn, signInWithGoogle, signInWithPassword, signUp } = useAuth();
  const [tab, setTab] = useState<AuthTab>('magic');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordMode, setPasswordMode] = useState<PasswordMode>('signin');
  const [forgotMode, setForgotMode] = useState(false);
  const [state, setState] = useState<ModalState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(
    authError ? (AUTH_ERROR_MESSAGES[authError] ?? AUTH_ERROR_MESSAGES.failed) : null
  );

  function resetForm() {
    setState('idle');
    setErrorMsg(null);
    setPassword('');
    setForgotMode(false);
  }

  function switchTab(next: AuthTab) {
    setTab(next);
    resetForm();
  }

  async function handleGoogleSignIn() {
    setState('submitting');
    setErrorMsg(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(error);
      setState('idle');
    }
    // On success, browser redirects — no state update needed
  }

  async function handleMagicLink(e: React.FormEvent) {
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

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setState('submitting');
    setErrorMsg(null);
    const fn = passwordMode === 'signin' ? signInWithPassword : signUp;
    const { error } = await fn(email.trim(), password);
    if (error) {
      setErrorMsg(mapPasswordError(error));
      setState('idle');
    } else if (passwordMode === 'signup') {
      setState('sent'); // confirm email notice
    }
    // signin success: onAuthStateChange fires → modal unmounts
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState('submitting');
    setErrorMsg(null);
    const { error } = await import('@/lib/supabase-browser').then(async ({ getSupabaseBrowser }) => {
      const res = await getSupabaseBrowser().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/me`,
      });
      return res;
    });
    if (error) {
      setErrorMsg(error.message);
      setState('idle');
    } else {
      setState('reset-sent');
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

        {state === 'sent' && tab === 'magic' ? (
          <SentState email={email} onResend={() => setState('idle')} />
        ) : state === 'sent' && tab === 'password' ? (
          <ConfirmEmailState email={email} onBack={resetForm} />
        ) : state === 'reset-sent' ? (
          <ResetSentState email={email} onBack={resetForm} />
        ) : (
          <>
            {/* Header */}
            <div className="mb-6 text-center">
              <div
                className="mx-auto mb-4 h-10 w-10 rounded-full"
                style={{ background: GRADIENTS.fourPillarV }}
              />
              <h2 className="text-xl font-semibold text-white">Sign in to continue</h2>
              <p className="mt-1 text-sm" style={{ color: '#888' }}>
                Your data syncs across sessions.
              </p>
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={state === 'submitting'}
              className="mb-4 flex w-full items-center justify-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40"
              style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <GoogleLogo />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <span className="text-xs" style={{ color: '#555' }}>or</span>
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Tab toggle */}
            <div className="mb-4 flex rounded-lg p-0.5" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
              {(['magic', 'password'] as AuthTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => switchTab(t)}
                  className="flex-1 rounded-md py-1.5 text-xs font-medium transition"
                  style={{
                    background: tab === t ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: tab === t ? '#fff' : '#666',
                  }}
                >
                  {t === 'magic' ? 'Magic link' : 'Password'}
                </button>
              ))}
            </div>

            {/* Forms */}
            {tab === 'magic' ? (
              <MagicLinkForm
                email={email}
                onEmailChange={setEmail}
                onSubmit={handleMagicLink}
                submitting={state === 'submitting'}
                error={errorMsg}
              />
            ) : forgotMode ? (
              <ForgotPasswordForm
                email={email}
                onEmailChange={setEmail}
                onSubmit={handleForgotPassword}
                submitting={state === 'submitting'}
                error={errorMsg}
                onBack={() => setForgotMode(false)}
              />
            ) : (
              <PasswordForm
                email={email}
                password={password}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={handlePasswordSubmit}
                submitting={state === 'submitting'}
                error={errorMsg}
                mode={passwordMode}
                onToggleMode={() => {
                  setPasswordMode((m) => m === 'signin' ? 'signup' : 'signin');
                  setErrorMsg(null);
                }}
                onForgotPassword={() => setForgotMode(true)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

function MagicLinkForm({
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
        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)' }}
        onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.3)')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
      />
      {error && <p className="text-xs" style={{ color: '#E84535' }}>{error}</p>}
      <button
        type="submit"
        disabled={submitting || !email.trim()}
        className="w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition disabled:opacity-40"
        style={{ background: GRADIENTS.primaryCta }}
      >
        {submitting ? 'Sending…' : 'Send magic link'}
      </button>
    </form>
  );
}

function PasswordForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  submitting,
  error,
  mode,
  onToggleMode,
  onForgotPassword,
}: {
  email: string;
  password: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error: string | null;
  mode: PasswordMode;
  onToggleMode: () => void;
  onForgotPassword: () => void;
}) {
  return (
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
        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)' }}
        onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.3)')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        placeholder="Password"
        required
        disabled={submitting}
        className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none transition"
        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)' }}
        onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.3)')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
      />
      {error && <p className="text-xs" style={{ color: '#E84535' }}>{error}</p>}
      <button
        type="submit"
        disabled={submitting || !email.trim() || !password}
        className="w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition disabled:opacity-40"
        style={{ background: GRADIENTS.primaryCta }}
      >
        {submitting ? (mode === 'signin' ? 'Signing in…' : 'Creating account…') : (mode === 'signin' ? 'Sign in' : 'Create account')}
      </button>
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-xs underline transition hover:text-white"
          style={{ color: '#666' }}
        >
          {mode === 'signin' ? 'No account? Sign up' : 'Have an account? Sign in'}
        </button>
        {mode === 'signin' && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs underline transition hover:text-white"
            style={{ color: '#666' }}
          >
            Forgot password?
          </button>
        )}
      </div>
    </form>
  );
}

function ForgotPasswordForm({
  email,
  onEmailChange,
  onSubmit,
  submitting,
  error,
  onBack,
}: {
  email: string;
  onEmailChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error: string | null;
  onBack: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="text-sm" style={{ color: '#888' }}>Enter your email and we'll send a reset link.</p>
      <input
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        placeholder="you@example.com"
        required
        autoFocus
        disabled={submitting}
        className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none transition"
        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)' }}
        onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.3)')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
      />
      {error && <p className="text-xs" style={{ color: '#E84535' }}>{error}</p>}
      <button
        type="submit"
        disabled={submitting || !email.trim()}
        className="w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition disabled:opacity-40"
        style={{ background: GRADIENTS.primaryCta }}
      >
        {submitting ? 'Sending…' : 'Send reset link'}
      </button>
      <button
        type="button"
        onClick={onBack}
        className="w-full text-xs underline transition hover:text-white"
        style={{ color: '#666' }}
      >
        Back to sign in
      </button>
    </form>
  );
}

function SentState({ email, onResend }: { email: string; onResend: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'rgba(78, 140, 115,0.15)' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#4E8C73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
        <button onClick={onResend} className="underline hover:text-white transition-colors">
          Send another
        </button>
      </p>
    </div>
  );
}

function ConfirmEmailState({ email, onBack }: { email: string; onBack: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'rgba(78, 140, 115,0.15)' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#4E8C73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10l5 5 9-9" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-white">Confirm your email</h2>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: '#888' }}>
        We sent a confirmation link to{' '}
        <span className="text-white">{email}</span>.
        <br />
        Click it to activate your account.
      </p>
      <button onClick={onBack} className="mt-4 text-xs underline hover:text-white transition-colors" style={{ color: '#555' }}>
        Back
      </button>
    </div>
  );
}

function ResetSentState({ email, onBack }: { email: string; onBack: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'rgba(78, 140, 115,0.15)' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#4E8C73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10l5 5 9-9" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-white">Reset link sent</h2>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: '#888' }}>
        Check <span className="text-white">{email}</span> for a password reset link.
      </p>
      <button onClick={onBack} className="mt-4 text-xs underline hover:text-white transition-colors" style={{ color: '#555' }}>
        Back to sign in
      </button>
    </div>
  );
}
