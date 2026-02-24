'use client';

import { useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  signIn: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    // Get initial session — .catch() ensures loading resolves even if getSession rejects
    // (can happen due to Navigator Lock timeout in React Strict Mode dev or network errors)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      setUser(null);
      setLoading(false);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);

        // Auto-link existing Flow Profile to this user on first sign-in
        if (event === 'SIGNED_IN' && currentUser?.email) {
          await getSupabaseBrowser()
            .from('assessments')
            .update({ user_id: currentUser.id })
            .eq('email', currentUser.email)
            .is('user_id', null);
        }
      }
    );

    return () => subscription.unsubscribe();
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

  const signOut = useCallback(async () => {
    await getSupabaseBrowser().auth.signOut();
  }, []);

  return { user, loading, signIn, signOut };
}
