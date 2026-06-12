'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Assessment } from '@/lib/supabase';
import BentoGrid from '@/components/me/BentoGrid';

export default function AdminProfilePreview() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>('');

  const adminKey =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('profile_admin_key') || ''
      : '';

  const fetchAssessments = useCallback(async () => {
    try {
      const res = await fetch('/api/profile/admin', {
        headers: { 'x-admin-key': adminKey },
      });
      const data = await res.json();
      if (data.success) {
        const filtered = (data.assessments as Assessment[]).filter(
          (a) => a.flow_profile_json !== null && a.status === 'delivered'
        );
        setAssessments(filtered);

        // Pre-select from URL param, or default to first
        const paramId = searchParams.get('id');
        if (paramId && filtered.some((a) => a.id === paramId)) {
          setSelectedId(paramId);
        } else if (filtered.length > 0) {
          setSelectedId(filtered[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch assessments:', err);
    } finally {
      setLoading(false);
    }
  }, [adminKey, searchParams]);

  useEffect(() => {
    fetchAssessments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    router.push(`/profile/admin/preview?id=${id}`);
  };

  const selected = assessments.find((a) => a.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-ground p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Profile Preview</h1>
            <Link
              href="/profile/admin"
              className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/30 rounded-lg transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
          <p className="text-gray-500">
            View any delivered profile as seen on /me
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        ) : assessments.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No delivered profiles with structured JSON found.
          </div>
        ) : (
          <>
            {/* Selector */}
            <div className="mb-8">
              <label className="block text-xs text-gray-500 mb-2">Select profile</label>
              <select
                value={selectedId}
                onChange={(e) => handleSelect(e.target.value)}
                className="w-full max-w-md px-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 appearance-none"
              >
                {assessments.map((a) => (
                  <option key={a.id} value={a.id} className="bg-[#1a1a1a]">
                    {a.name} — {a.email}
                  </option>
                ))}
              </select>
            </div>

            {/* BentoGrid */}
            {selected && selected.flow_profile_json && (
              <BentoGrid
                profile={selected.flow_profile_json}
                sessions={[]}
                curiosity={null}
                assessment={{
                  status: selected.status,
                  created_at: selected.created_at,
                  view_token: selected.view_token,
                  flow_profile_final: selected.flow_profile_final,
                  flow_profile_json: selected.flow_profile_json,
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
