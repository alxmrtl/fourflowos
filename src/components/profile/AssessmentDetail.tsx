'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Assessment, AssessmentStatus } from '@/lib/supabase';

const STATUS_LABELS: Record<AssessmentStatus, string> = {
  intake_submitted: 'Intake Submitted',
  lite_generated: 'Lite Profile Ready',
  processing: 'Briefing Ready',
  session_1_scheduled: 'Session 1 Scheduled',
  session_1_complete: 'Session 1 Complete',
  synthesis: 'Profile Ready',
  session_2_scheduled: 'Session 2 Scheduled',
  delivered: 'Delivered',
};

const STATUS_COLORS: Record<AssessmentStatus, string> = {
  intake_submitted: '#3B82F6',
  lite_generated: '#8B5CF6',
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
  const [generating, setGenerating] = useState(false);
  const [delivering, setDelivering] = useState(false);
  const [draftProfile, setDraftProfile] = useState('');
  const [editingDraft, setEditingDraft] = useState(false);
  const [customNotes, setCustomNotes] = useState('');

  const adminKey = typeof window !== 'undefined' ? sessionStorage.getItem('profile_admin_key') || '' : '';

  const fetchAssessment = async () => {
    try {
      const res = await fetch(`/api/profile/${id}`, {
        headers: { 'x-admin-key': adminKey },
      });
      const data = await res.json();
      if (data.success) {
        setAssessment(data.assessment);
        setDraftProfile(data.assessment.flow_profile_draft || '');
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

  const generateProfile = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/profile/${id}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({}),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        alert(`Generation failed: ${(data as { error?: string }).error || res.statusText}`);
        return;
      }

      // Drain the SSE stream — heartbeat events flow every 5s during generation,
      // keeping the connection alive. We watch for 'done' or 'error' as the final signal.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let errorMessage: string | null = null;
      let gotDone = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE events (delimited by double newline)
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          const dataLine = part.split('\n').find(l => l.startsWith('data: '));
          if (!dataLine) continue;
          try {
            const event = JSON.parse(dataLine.slice(6)) as { type: string; message?: string };
            if (event.type === 'error') errorMessage = event.message ?? 'Generation failed';
            if (event.type === 'done') gotDone = true;
          } catch { /* ignore malformed events */ }
        }
      }

      if (errorMessage) {
        alert(`Generation failed: ${errorMessage}`);
        return;
      }

      if (!gotDone) {
        alert('Generation was interrupted before completing. Please try again.');
        return;
      }

      await fetchAssessment();
    } catch (err) {
      console.error('Generate failed:', err);
      alert('Generation failed. Check your connection and try again.');
    } finally {
      setGenerating(false);
    }
  };

  const deliverProfile = async () => {
    setDelivering(true);
    try {
      const res = await fetch(`/api/profile/${id}/deliver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          flow_profile_final: draftProfile || assessment?.flow_profile_draft,
          custom_notes: customNotes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAssessment();
      } else {
        alert(`Delivery failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Deliver failed:', err);
      alert('Delivery failed. Try again.');
    } finally {
      setDelivering(false);
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
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{assessment.name}</h1>
            <p className="text-gray-500">{assessment.email}</p>
          </div>
          <span
            className="px-3 py-1 text-xs rounded-full border"
            style={{ color: STATUS_COLORS[assessment.status], borderColor: `${STATUS_COLORS[assessment.status]}40`, backgroundColor: `${STATUS_COLORS[assessment.status]}15` }}
          >
            {STATUS_LABELS[assessment.status]}
          </span>
        </div>

        {/* Intake Data (collapsed view) */}
        <Section title="Intake" color="#ffffff">
          <InfoRow label="Date of birth" value={`${assessment.birth_date}${assessment.birth_time_known && assessment.birth_time ? ` at ${assessment.birth_time}` : ''}`} />
          <InfoRow label="Born in" value={assessment.birth_location} />
          <InfoRow
            label="Chart"
            value={
              assessment.natal_chart_data
                ? ((assessment.natal_chart_data as Record<string, string>).context || 'Calculated')
                : 'Pending generation'
            }
          />
          <div className="pt-2 border-t border-white/5 mt-2">
            <TextBlock label="What's working" text={assessment.context_working} />
            <TextBlock label="What's stuck" text={assessment.context_stuck} />
            <TextBlock label="Building toward" text={assessment.context_building} />
          </div>
          {PILLAR_SECTIONS.map(pillar => (
            <div key={pillar.title} className="pt-2 border-t border-white/5">
              <p className="text-xs font-medium mb-2" style={{ color: pillar.color }}>{pillar.title}</p>
              {pillar.fields.map(field => (
                <TextBlock
                  key={field.key}
                  label={field.label}
                  text={(assessment as unknown as Record<string, string>)[field.key]}
                />
              ))}
            </div>
          ))}
        </Section>

        {/* Step 1: Generate */}
        {assessment.status === 'intake_submitted' && (
          <motion.div
            className="p-6 rounded-xl bg-white/[0.03] border border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm font-medium text-gray-400 mb-1">Next step</p>
            <p className="text-white font-semibold mb-4">Generate Flow Profile</p>
            <p className="text-sm text-gray-500 mb-5">
              Combines their intake responses with natal chart data to generate a personalized Flow Profile. Takes 30–60 seconds.
            </p>
            <ActionButton
              label="Generate Flow Profile"
              loading={generating}
              disabled={generating}
              onClick={generateProfile}
              color="from-[#6BA292] to-[#7A4DA4]"
            />
          </motion.div>
        )}

        {/* Step 2: Review and deliver */}
        {assessment.status === 'synthesis' && assessment.flow_profile_draft && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Profile draft */}
            <Section title="Flow Profile — Ready to Review" color="#5B84B1">
              {editingDraft ? (
                <textarea
                  value={draftProfile}
                  onChange={(e) => setDraftProfile(e.target.value)}
                  rows={28}
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-white/30 resize-y"
                />
              ) : (
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {draftProfile || assessment.flow_profile_draft}
                </pre>
              )}
              <button
                type="button"
                onClick={() => setEditingDraft(!editingDraft)}
                className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                {editingDraft ? 'Preview' : 'Edit'}
              </button>
            </Section>

            {/* Deliver panel */}
            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/10">
              <p className="text-sm font-medium text-gray-400 mb-1">Deliver to client</p>
              <p className="text-xs text-gray-600 mb-4">Optional: add a personal note that will appear in the delivery email above the profile link.</p>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                rows={3}
                placeholder="Hi [name], really enjoyed reviewing this..."
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 resize-none text-sm mb-4"
              />
              <ActionButton
                label="Deliver to Client"
                loading={delivering}
                disabled={delivering}
                onClick={deliverProfile}
                color="from-[#22C55E] to-[#6BA292]"
              />
            </div>
          </motion.div>
        )}

        {/* Delivered */}
        {assessment.status === 'delivered' && (
          <Section title="Delivered" color="#22C55E">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
              {assessment.flow_profile_final}
            </pre>
            {assessment.view_token && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-1">Client view link:</p>
                <code className="text-xs text-[#6BA292] break-all">
                  {typeof window !== 'undefined'
                    ? `${window.location.origin}/profile/view/${assessment.view_token}`
                    : `/profile/view/${assessment.view_token}`}
                </code>
              </div>
            )}
          </Section>
        )}
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
  disabled,
  onClick,
  color = 'from-[#6BA292] to-[#7A4DA4]',
}: {
  label: string;
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled ?? loading}
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
