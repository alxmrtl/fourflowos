'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    // onAuthStateChange is the single source of truth for session state.
    // It fires with INITIAL_SESSION on mount — immediately if no session exists,
    // or after a background token refresh if a session cookie is present.
    // We no longer race against getSession() which caused the 5s AuthModal flash:
    // the timeout would fire → user=null → AuthModal → then onAuthStateChange
    // would fire with valid session → profile. Users saw AuthModal and panicked,
    // requesting a new magic link and hitting email rate limits.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);

        // Link any pre-auth assessments to this user on first sign-in.
        // Fire-and-forget — MePage retries the assessment query after 2s
        // to handle the race between this update and the initial fetch.
        if (event === 'SIGNED_IN' && session?.user?.email) {
          getSupabaseBrowser()
            .from('assessments')
            .update({ user_id: session.user.id })
            .eq('email', session.user.email)
            .is('user_id', null)
            .then(() => {/* intentionally fire-and-forget */});
        }
      }
    );

    // Safety valve: if onAuthStateChange hasn't fired within 10 seconds
    // (catastrophic network failure), stop the loading spinner.
    // We don't call setUser(null) here — the initial state is already null,
    // so the component renders AuthModal correctly without an extra state set.
    const fallback = setTimeout(() => setLoading(false), 10000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallback);
    };
  }, []);

  const signIn = useCallback(async (email: string) => {
    const { error } = await getSupabaseBrowser().auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`
          : undefined,
      },
    });
    return { error: error?.message ?? null };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await getSupabaseBrowser().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`
          : undefined,
      },
    });
    return { error: error?.message ?? null };
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const { error } = await getSupabaseBrowser().auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await getSupabaseBrowser().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`
          : undefined,
      },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await getSupabaseBrowser().auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInWithGoogle, signInWithPassword, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
