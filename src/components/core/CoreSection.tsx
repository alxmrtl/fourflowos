'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import FlowLensCard from './FlowLensCard';
import EsotericCard from './EsotericCard';

interface FlowLensProfile {
  id: string;
  gravity_pillar: string;
  blind_side_pillar: string;
  profile_text: string;
  profile_json: Record<string, unknown> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recommendations: any[] | null;
  generated_at: string;
}

interface EsotericProfile {
  id: string;
  profile_text: string;
  profile_json: Record<string, unknown> | null;
  generated_at: string;
}

export default function CoreSection() {
  const { user } = useAuth();
  const [flowLens, setFlowLens] = useState<FlowLensProfile | null>(null);
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
      <FlowLensCard initialProfile={flowLens} />
      <EsotericCard initialProfile={esoteric} />
    </div>
  );
}
