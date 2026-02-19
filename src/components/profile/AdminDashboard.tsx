'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Assessment, AssessmentStatus } from '@/lib/supabase';

// Active statuses in the current 3-step flow.
// Legacy statuses (lite_generated, processing, session_*) kept in the type for
// backward compat with old records but not surfaced as active filters.
const STATUS_CONFIG: Record<AssessmentStatus, { label: string; color: string; bg: string }> = {
  intake_submitted: { label: 'Intake', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  lite_generated: { label: 'Intake', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  processing: { label: 'Intake', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  session_1_scheduled: { label: 'Intake', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  session_1_complete: { label: 'Intake', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  synthesis: { label: 'Profile Ready', color: 'text-[#5B84B1]', bg: 'bg-[#5B84B1]/10 border-[#5B84B1]/20' },
  session_2_scheduled: { label: 'Profile Ready', color: 'text-[#5B84B1]', bg: 'bg-[#5B84B1]/10 border-[#5B84B1]/20' },
  delivered: { label: 'Delivered', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
};

const FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'intake_submitted', label: 'Intake' },
  { value: 'synthesis', label: 'Profile Ready' },
  { value: 'delivered', label: 'Delivered' },
];

export default function AdminDashboard() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const adminKey = sessionStorage.getItem('profile_admin_key') || '';
      const res = await fetch('/api/profile/admin', {
        headers: { 'x-admin-key': adminKey },
      });
      const data = await res.json();
      if (data.success) {
        setAssessments(data.assessments);
      }
    } catch (err) {
      console.error('Failed to fetch assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const filtered = filter === 'all'
    ? assessments
    : assessments.filter(a => a.status === filter);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Flow Profile Dashboard</h1>
          <p className="text-gray-500">
            {assessments.length} assessment{assessments.length !== 1 ? 's' : ''} total
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                filter === opt.value
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-gray-500 hover:text-gray-300 border border-transparent'
              }`}
            >
              {opt.label}
              {opt.value !== 'all' && (
                <span className="ml-1.5 text-xs text-gray-600">
                  {assessments.filter(a => a.status === opt.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Assessment list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {filter === 'all' ? 'No assessments yet.' : `No assessments with status "${filter}".`}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((assessment, idx) => {
              const statusConfig = STATUS_CONFIG[assessment.status];
              return (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={`/profile/admin/${assessment.id}`}
                    className="block p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="text-white font-medium group-hover:text-white/90">
                            {assessment.name}
                          </h3>
                          <p className="text-sm text-gray-500">{assessment.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 text-xs rounded-full border ${statusConfig.bg} ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                        <span className="text-xs text-gray-600">
                          {formatDate(assessment.updated_at)}
                        </span>
                        <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
