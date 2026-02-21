'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Assessment, AssessmentStatus, PromptTemplate, ProfileGeneration } from '@/lib/supabase';

const STATUS_LABELS: Record<AssessmentStatus, string> = {
  intake_submitted: 'Intake',
  lite_generated: 'Intake',
  processing: 'Intake',
  session_1_scheduled: 'Intake',
  session_1_complete: 'Intake',
  synthesis: 'Profile Ready',
  session_2_scheduled: 'Profile Ready',
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
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState('');
  const [generations, setGenerations] = useState<ProfileGeneration[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [usingGenId, setUsingGenId] = useState<string | null>(null);

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

  const fetchPrompts = async () => {
    try {
      const res = await fetch('/api/profile/prompts', {
        headers: { 'x-admin-key': adminKey },
      });
      const data = await res.json();
      if (data.success && data.templates?.length) {
        const active = (data.templates as PromptTemplate[]).filter(t => t.is_active);
        setPromptTemplates(active);
        if (!selectedPromptId && active.length > 0) {
          setSelectedPromptId(active[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch prompts:', err);
    }
  };

  const fetchGenerations = async () => {
    try {
      const res = await fetch(`/api/profile/${id}/generations`, {
        headers: { 'x-admin-key': adminKey },
      });
      const data = await res.json();
      if (data.success) {
        setGenerations(data.generations);
      }
    } catch (err) {
      console.error('Failed to fetch generations:', err);
    }
  };

  useEffect(() => {
    fetchAssessment();
    fetchPrompts();
    fetchGenerations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const generateProfile = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/profile/${id}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ prompt_template_id: selectedPromptId || undefined }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        alert(`Generation failed: ${(data as { error?: string }).error || res.statusText}`);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let errorMessage: string | null = null;
      let gotDone = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

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

      await Promise.all([fetchAssessment(), fetchGenerations()]);
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
        await Promise.all([fetchAssessment(), fetchGenerations()]);
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

  const useGenerationAsDraft = async (gen: ProfileGeneration) => {
    setUsingGenId(gen.id);
    try {
      const res = await fetch(`/api/profile/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ flow_profile_draft: gen.content }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAssessment();
        // Scroll to draft section
        document.getElementById('draft-section')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        alert(`Failed to set draft: ${data.error}`);
      }
    } catch (err) {
      console.error('Use generation failed:', err);
    } finally {
      setUsingGenId(null);
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

  const hasNewDraft =
    assessment.status === 'delivered' &&
    assessment.flow_profile_draft &&
    assessment.flow_profile_draft !== assessment.flow_profile_final;

  const showGenerateSection =
    assessment.status === 'intake_submitted' ||
    assessment.status === 'synthesis' ||
    assessment.status === 'delivered';

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
            <p className="text-gray-500 mb-3">{assessment.email}</p>
            {/* Assessment ID — prominent for CLI use */}
            <div className="flex items-center gap-2">
              <code className="text-xs text-gray-500 font-mono bg-white/[0.04] px-2 py-1 rounded-md border border-white/10 select-all">
                {assessment.id}
              </code>
              <button
                type="button"
                onClick={copyId}
                className="text-xs text-gray-600 hover:text-gray-300 transition-colors px-2 py-1 rounded-md hover:bg-white/[0.06]"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-700 mt-1">
              npm run profile:generate {assessment.id}
            </p>
          </div>
          <span
            className="px-3 py-1 text-xs rounded-full border"
            style={{ color: STATUS_COLORS[assessment.status], borderColor: `${STATUS_COLORS[assessment.status]}40`, backgroundColor: `${STATUS_COLORS[assessment.status]}15` }}
          >
            {STATUS_LABELS[assessment.status]}
          </span>
        </div>

        {/* Intake Data */}
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

        {/* Generate section — primary for intake, secondary for synthesis/delivered */}
        {showGenerateSection && (
          <motion.div
            className="p-6 rounded-xl bg-white/[0.03] border border-white/10 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm font-medium text-gray-400 mb-1">
              {assessment.status === 'intake_submitted' ? 'Next step' : 'Run new generation'}
            </p>
            <p className="text-white font-semibold mb-1">
              {assessment.status === 'intake_submitted' ? 'Generate Flow Profile' : 'Generate with different prompt'}
            </p>
            {assessment.status === 'intake_submitted' && (
              <p className="text-sm text-gray-500 mb-4">
                Combines intake responses with natal chart data. Takes 30–90 seconds.
              </p>
            )}

            {/* Prompt picker */}
            {promptTemplates.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1.5">Prompt template</label>
                <select
                  value={selectedPromptId}
                  onChange={(e) => setSelectedPromptId(e.target.value)}
                  className="w-full max-w-xs px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30 appearance-none"
                >
                  {promptTemplates.map(t => (
                    <option key={t.id} value={t.id} className="bg-[#1a1a1a]">
                      {t.name} — {t.model.includes('haiku') ? 'Haiku' : t.model.includes('opus') ? 'Opus' : 'Sonnet'}
                    </option>
                  ))}
                </select>
                {promptTemplates.find(t => t.id === selectedPromptId)?.description && (
                  <p className="text-xs text-gray-600 mt-1">
                    {promptTemplates.find(t => t.id === selectedPromptId)?.description}
                  </p>
                )}
              </div>
            )}

            <ActionButton
              label={assessment.status === 'intake_submitted' ? 'Generate Flow Profile' : 'Run Generation'}
              loading={generating}
              disabled={generating}
              onClick={generateProfile}
              color={assessment.status === 'intake_submitted' ? 'from-[#6BA292] to-[#7A4DA4]' : 'from-[#5B84B1] to-[#7A4DA4]'}
            />

            {/* CLI equivalent — auto-updates with prompt selection */}
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <p className="text-xs text-gray-600 mb-2">or run in terminal (from <code className="text-gray-500">website/fourflowos-web</code>):</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-[#6BA292] font-mono bg-white/[0.04] px-3 py-2 rounded-lg border border-white/[0.07] select-all">
                  {`npm run profile:generate ${assessment.id}${promptTemplates.find(t => t.id === selectedPromptId)?.name ? ` "${promptTemplates.find(t => t.id === selectedPromptId)!.name}"` : ''}`}
                </code>
                <button
                  type="button"
                  onClick={async () => {
                    const promptName = promptTemplates.find(t => t.id === selectedPromptId)?.name;
                    const cmd = `npm run profile:generate ${assessment.id}${promptName ? ` "${promptName}"` : ''}`;
                    await navigator.clipboard.writeText(cmd).catch(() => {});
                    setCopiedCmd(true);
                    setTimeout(() => setCopiedCmd(false), 2000);
                  }}
                  className="text-xs text-gray-600 hover:text-gray-300 transition-colors px-2 py-2 rounded-lg hover:bg-white/[0.06] whitespace-nowrap flex-shrink-0"
                >
                  {copiedCmd ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Draft review — synthesis state, or delivered with new draft */}
        {(assessment.status === 'synthesis' && assessment.flow_profile_draft) && (
          <motion.div
            id="draft-section"
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
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

        {/* New draft panel — shown when delivered but a new draft exists */}
        {hasNewDraft && (
          <motion.div
            id="draft-section"
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Section title="New Draft — Ready to Review" color="#5B84B1">
              <p className="text-xs text-gray-600 mb-3">A new generation exists. Review and optionally re-deliver to the client.</p>
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

            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/10">
              <p className="text-sm font-medium text-gray-400 mb-1">Re-deliver to client</p>
              <p className="text-xs text-gray-600 mb-4">This will send a new delivery email and update the client view link.</p>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                rows={3}
                placeholder="Hi [name], updated your profile with a new lens..."
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 resize-none text-sm mb-4"
              />
              <ActionButton
                label="Re-deliver to Client"
                loading={delivering}
                disabled={delivering}
                onClick={deliverProfile}
                color="from-[#22C55E] to-[#6BA292]"
              />
            </div>
          </motion.div>
        )}

        {/* Generation History */}
        {generations.length > 0 && (
          <Section title={`Generation History (${generations.length})`} color="#555555">
            <div className="space-y-3">
              {generations.map(gen => {
                const isDelivered = assessment.flow_profile_final
                  ? gen.content === assessment.flow_profile_final
                  : gen.delivered;
                const isActiveDraft = gen.content === assessment.flow_profile_draft &&
                  gen.content !== assessment.flow_profile_final;
                const isUsing = usingGenId === gen.id;

                return (
                  <div
                    key={gen.id}
                    className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.07]"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-white">{gen.prompt_name}</span>
                        <span className="text-xs text-gray-600 bg-white/[0.04] px-1.5 py-0.5 rounded">
                          {gen.model.includes('haiku') ? 'Haiku' : gen.model.includes('opus') ? 'Opus' : 'Sonnet'}
                        </span>
                        {isDelivered && (
                          <span className="text-xs text-[#22C55E] bg-[#22C55E]/10 px-1.5 py-0.5 rounded border border-[#22C55E]/20">
                            Delivered
                          </span>
                        )}
                        {isActiveDraft && (
                          <span className="text-xs text-[#5B84B1] bg-[#5B84B1]/10 px-1.5 py-0.5 rounded border border-[#5B84B1]/20">
                            Active Draft
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 whitespace-nowrap flex-shrink-0">
                        {new Date(gen.generated_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                      {gen.content.slice(0, 160)}…
                    </p>
                    {!isDelivered && !isActiveDraft && (
                      <button
                        type="button"
                        onClick={() => useGenerationAsDraft(gen)}
                        disabled={isUsing}
                        className="text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                      >
                        {isUsing ? 'Setting as draft…' : 'Use as draft →'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
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
