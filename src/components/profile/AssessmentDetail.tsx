'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Assessment, AssessmentStatus } from '@/lib/supabase';
import { ASSESSMENT_STATUSES } from '@/lib/supabase';

const STATUS_LABELS: Record<AssessmentStatus, string> = {
  intake_submitted: 'Intake Submitted',
  processing: 'Processing',
  session_1_scheduled: 'Session 1 Scheduled',
  session_1_complete: 'Session 1 Complete',
  synthesis: 'Synthesis',
  session_2_scheduled: 'Session 2 Scheduled',
  delivered: 'Delivered',
};

const STATUS_COLORS: Record<AssessmentStatus, string> = {
  intake_submitted: '#3B82F6',
  processing: '#EAB308',
  session_1_scheduled: '#F97316',
  session_1_complete: '#6BA292',
  synthesis: '#5B84B1',
  session_2_scheduled: '#7A4DA4',
  delivered: '#22C55E',
};

const PILLAR_SECTIONS = [
  {
    title: 'Self',
    color: '#FF6F61',
    fields: [
      { key: 'self_energy', label: 'Physical Energy (Focused Body)' },
      { key: 'self_emotions', label: 'Emotions (Tuned Emotions)' },
      { key: 'self_focus', label: 'Mental Clarity (Open Mind)' },
    ],
  },
  {
    title: 'Space',
    color: '#6BA292',
    fields: [
      { key: 'space_environment', label: 'Environment (Intentional Space)' },
      { key: 'space_tools', label: 'Tools & Systems (Optimized Tools)' },
      { key: 'space_feedback', label: 'Feedback Loops (Feedback Systems)' },
    ],
  },
  {
    title: 'Story',
    color: '#5B84B1',
    fields: [
      { key: 'story_narrative', label: 'Life Narrative (Generative Story)' },
      { key: 'story_mission', label: 'Mission (Clear Mission)' },
      { key: 'story_role', label: 'Role (Empowered Role)' },
    ],
  },
  {
    title: 'Spirit',
    color: '#7A4DA4',
    fields: [
      { key: 'spirit_values', label: 'Values (Grounding Values)' },
      { key: 'spirit_curiosity', label: 'Curiosity (Ignited Curiosity)' },
      { key: 'spirit_vision', label: 'Vision (Visualized Vision)' },
    ],
  },
];

interface AssessmentDetailProps {
  id: string;
}

export default function AssessmentDetail({ id }: AssessmentDetailProps) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [editingFinal, setEditingFinal] = useState(false);
  const [finalProfile, setFinalProfile] = useState('');

  const adminKey = typeof window !== 'undefined' ? sessionStorage.getItem('profile_admin_key') || '' : '';

  const fetchAssessment = async () => {
    try {
      const res = await fetch(`/api/profile/${id}`, {
        headers: { 'x-admin-key': adminKey },
      });
      const data = await res.json();
      if (data.success) {
        setAssessment(data.assessment);
        setSessionNotes(data.assessment.session_1_notes || '');
        setFinalProfile(data.assessment.flow_profile_final || data.assessment.flow_profile_draft || '');
      }
    } catch (err) {
      console.error('Failed to fetch assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateAssessment = async (updates: Record<string, unknown>) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/profile/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setAssessment(data.assessment);
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const runProcess = async (type: 'briefing' | 'synthesis') => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/profile/${id}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAssessment();
      } else {
        alert(`Processing failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Process failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-gray-500">
        Assessment not found.
      </div>
    );
  }

  const currentStatusIdx = ASSESSMENT_STATUSES.indexOf(assessment.status);

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link href="/profile/admin" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 mb-6 text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{assessment.name}</h1>
          <p className="text-gray-500">{assessment.email}</p>
        </div>

        {/* Status progression */}
        <div className="mb-8 p-5 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between mb-4">
            {ASSESSMENT_STATUSES.map((status, idx) => {
              const isComplete = idx < currentStatusIdx;
              const isCurrent = idx === currentStatusIdx;
              return (
                <div key={status} className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${
                      isCurrent ? 'ring-2 ring-offset-2 ring-offset-[#0a0a0a]' : ''
                    }`}
                    style={{
                      backgroundColor: isComplete || isCurrent ? STATUS_COLORS[status] : 'rgba(255,255,255,0.1)',
                      ...(isCurrent ? { '--tw-ring-color': STATUS_COLORS[status] } as React.CSSProperties : {}),
                    }}
                  />
                  {idx < ASSESSMENT_STATUSES.length - 1 && (
                    <div
                      className="w-8 md:w-16 h-px mx-1"
                      style={{
                        backgroundColor: isComplete ? STATUS_COLORS[status] : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-sm font-medium" style={{ color: STATUS_COLORS[assessment.status] }}>
            {STATUS_LABELS[assessment.status]}
          </p>
        </div>

        {/* Birth Data */}
        <Section title="Birth Data" color="#ffffff">
          <InfoRow label="Date" value={assessment.birth_date} />
          <InfoRow label="Time" value={assessment.birth_time_known && assessment.birth_time ? assessment.birth_time : 'Not provided'} />
          <InfoRow label="Location" value={assessment.birth_location} />
        </Section>

        {/* Natal Chart Data */}
        {assessment.natal_chart_data && (
          <Section title="Natal Chart" color="#ffffff">
            <pre className="text-xs text-gray-400 whitespace-pre-wrap overflow-x-auto bg-white/[0.02] rounded-lg p-4">
              {typeof assessment.natal_chart_data === 'string'
                ? assessment.natal_chart_data
                : JSON.stringify(assessment.natal_chart_data, null, 2)}
            </pre>
          </Section>
        )}

        {/* Life Context */}
        <Section title="Life Context" color="#ffffff">
          <TextBlock label="What's working" text={assessment.context_working} />
          <TextBlock label="What's stuck" text={assessment.context_stuck} />
          <TextBlock label="Building toward" text={assessment.context_building} />
        </Section>

        {/* Four Pillar Sections */}
        {PILLAR_SECTIONS.map(pillar => (
          <Section key={pillar.title} title={pillar.title} color={pillar.color}>
            {pillar.fields.map(field => (
              <TextBlock
                key={field.key}
                label={field.label}
                text={(assessment as unknown as Record<string, string>)[field.key]}
              />
            ))}
          </Section>
        ))}

        {/* Facilitator Briefing */}
        {assessment.facilitator_briefing && (
          <Section title="Facilitator Briefing" color="#EAB308">
            <div className="prose prose-invert prose-sm max-w-none">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                {assessment.facilitator_briefing}
              </pre>
            </div>
          </Section>
        )}

        {/* Session Notes */}
        {(assessment.status === 'session_1_scheduled' || assessment.status === 'session_1_complete') && (
          <Section title="Session 1 Notes" color="#F97316">
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 resize-none text-sm"
              placeholder="Enter session notes here..."
            />
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="mt-3 px-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm focus:outline-none [color-scheme:dark]"
            />
          </Section>
        )}

        {/* Flow Profile Draft / Final */}
        {(assessment.flow_profile_draft || assessment.flow_profile_final) && (
          <Section title="Flow Profile" color="#22C55E">
            {editingFinal ? (
              <textarea
                value={finalProfile}
                onChange={(e) => setFinalProfile(e.target.value)}
                rows={20}
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-white/30 resize-none"
              />
            ) : (
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                {assessment.flow_profile_final || assessment.flow_profile_draft}
              </pre>
            )}
            <button
              type="button"
              onClick={() => setEditingFinal(!editingFinal)}
              className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              {editingFinal ? 'Preview' : 'Edit Final Version'}
            </button>
          </Section>
        )}

        {/* Action Buttons */}
        <motion.div
          className="mt-8 p-6 rounded-xl bg-white/[0.03] border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-sm font-medium text-gray-400 mb-4">Actions</h3>
          <div className="flex flex-wrap gap-3">
            {assessment.status === 'intake_submitted' && (
              <ActionButton
                label="Generate Facilitator Briefing"
                loading={actionLoading}
                onClick={() => runProcess('briefing')}
                color="from-[#EAB308] to-[#F97316]"
              />
            )}

            {assessment.status === 'processing' && (
              <ActionButton
                label="Mark Session 1 Scheduled"
                loading={actionLoading}
                onClick={() => updateAssessment({ status: 'session_1_scheduled' })}
              />
            )}

            {assessment.status === 'session_1_scheduled' && (
              <ActionButton
                label="Complete Session 1"
                loading={actionLoading}
                onClick={() => updateAssessment({
                  status: 'session_1_complete',
                  session_1_notes: sessionNotes,
                  session_1_date: sessionDate || new Date().toISOString().split('T')[0],
                })}
                color="from-[#6BA292] to-[#5B84B1]"
              />
            )}

            {assessment.status === 'session_1_complete' && (
              <ActionButton
                label="Generate Flow Profile"
                loading={actionLoading}
                onClick={() => runProcess('synthesis')}
                color="from-[#5B84B1] to-[#7A4DA4]"
              />
            )}

            {assessment.status === 'synthesis' && (
              <>
                <ActionButton
                  label="Schedule Session 2"
                  loading={actionLoading}
                  onClick={() => updateAssessment({ status: 'session_2_scheduled' })}
                />
                <ActionButton
                  label="Approve & Deliver"
                  loading={actionLoading}
                  onClick={() => updateAssessment({
                    status: 'delivered',
                    flow_profile_final: finalProfile || assessment.flow_profile_draft,
                  })}
                  color="from-[#22C55E] to-[#6BA292]"
                />
              </>
            )}

            {assessment.status === 'session_2_scheduled' && (
              <ActionButton
                label="Deliver Final Profile"
                loading={actionLoading}
                onClick={() => updateAssessment({
                  status: 'delivered',
                  flow_profile_final: finalProfile || assessment.flow_profile_draft,
                  session_2_notes: sessionNotes,
                  session_2_date: sessionDate || new Date().toISOString().split('T')[0],
                })}
                color="from-[#22C55E] to-[#6BA292]"
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Helper components

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 p-5 rounded-xl bg-white/[0.03] border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color === '#ffffff' ? 'rgba(255,255,255,0.4)' : color }} />
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-xs text-gray-500 w-20 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-300">{value}</span>
    </div>
  );
}

function TextBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-300 whitespace-pre-wrap">{text}</p>
    </div>
  );
}

function ActionButton({
  label,
  loading,
  onClick,
  color = 'from-[#6BA292] to-[#7A4DA4]',
}: {
  label: string;
  loading: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`px-5 py-2.5 bg-gradient-to-r ${color} text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Working...
        </span>
      ) : (
        label
      )}
    </button>
  );
}
