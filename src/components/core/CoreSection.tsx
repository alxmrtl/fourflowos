'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import FlowLensCard from './FlowLensCard';
import EsotericCard from './EsotericCard';
import {
  type FlowLensDisplayProfile,
  type FlowUnlockHistoryItem,
} from './flow-lens-demo-profile';

interface EsotericProfile {
  id: string;
  profile_text: string;
  profile_json: Record<string, unknown> | null;
  generated_at: string;
}

export default function CoreSection({ mode }: { mode?: 'lens' | 'esoteric' }) {
  const { user } = useAuth();
  const [flowLens, setFlowLens] = useState<FlowLensDisplayProfile | null>(null);
  const [history, setHistory] = useState<FlowUnlockHistoryItem[]>([]);
  const [esoteric, setEsoteric] = useState<EsotericProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    getSupabaseBrowser()
      .auth.getSession()
      .then(({ data: { session } }) => {
        if (!session?.access_token) {
          setLoading(false);
          return;
        }
        return fetch('/api/core/profiles', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
          .then(r => r.json())
          .then(data => {
            if (data.success) {
              setFlowLens(data.flow_lens ?? null);
              setHistory(data.flow_lens_history ?? []);
              setEsoteric(data.esoteric ?? null);
            }
          });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-5 h-5 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(!mode || mode === 'lens')     && <FlowLensCard initialProfile={flowLens} history={history} />}
      {(!mode || mode === 'esoteric') && <EsotericCard initialProfile={esoteric} />}
    </div>
  );
}
