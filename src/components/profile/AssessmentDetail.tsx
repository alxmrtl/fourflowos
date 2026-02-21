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

// ─── Markdown renderer (same logic as profile view page) ─────────────────────

function markdownToHtml(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^---+$/gm, '<hr />')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^&gt; (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;
  let listType = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ulMatch = line.match(/^[-*] (.+)/);
    const olMatch = line.match(/^\d+\. (.+)/);

    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        if (inList) result.push(`</${listType}>`);
        result.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      result.push(`<li>${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (!inList || listType !== 'ol') {
        if (inList) result.push(`</${listType}>`);
        result.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      result.push(`<li>${olMatch[1]}</li>`);
    } else {
      if (inList) {
        result.push(`</${listType}>`);
        inList = false;
        listType = '';
      }
      if (line.trim() === '') {
        result.push('');
      } else if (line.startsWith('<h') || line.startsWith('<hr') || line.startsWith('<blockquote')) {
        result.push(line);
      } else {
        result.push(`<p>${line}</p>`);
      }
    }
  }
  if (inList) result.push(`</${listType}>`);
  return result.join('\n');
}

function ProfileMarkdown({ content }: { content: string }) {
  const html = markdownToHtml(content);
  return <div className="admin-profile-content" dangerouslySetInnerHTML={{ __html: html }} />;
}

// ─── Main component ───────────────────────────────────────────────────────────

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
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [usingGenId, setUsingGenId] = useState<string | null>(null);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPromptText, setCustomPromptText] = useState('');
  const [isCustomPromptActive, setIsCustomPromptActive] = useState(false);

  // Layout state
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [astroOpen, setAstroOpen] = useState(false);
  const [expandedGenIds, setExpandedGenIds] = useState<Set<string>>(new Set());

  const adminKey = typeof window !== 'undefined' ? sessionStorage.getItem('profile_admin_key') || '' : '';

  const toggleGen = (genId: string) => {
    setExpandedGenIds(prev => {
      const next = new Set(prev);
      if (next.has(genId)) next.delete(genId);
      else next.add(genId);
      return next;
    });
  };

  const buildPreviewPrompt = (templateText: string, a: Assessment): string => {
    const intakeData = `**Name**: ${a.name}
**Email**: ${a.email}

**Birth**: ${a.birth_date}${a.birth_time_known && a.birth_time ? `, ${a.birth_time}` : ' (time unknown)'}, ${a.birth_location}

---

### Life Context

**What's working:**
${a.context_working}

**What's stuck:**
${a.context_stuck}

**Building toward:**
${a.context_building}

---

### SELF (Reception)

**Physical Energy (Focused Body):**
${a.self_energy}

**Emotions (Tuned Emotions):**
${a.self_emotions}

**Mental Clarity (Open Mind):**
${a.self_focus}

---

### SPACE (Transmission)

**Environment (Intentional Space):**
${a.space_environment}

**Tools & Systems (Optimized Tools):**
${a.space_tools}

**Feedback Loops (Feedback Systems):**
${a.space_feedback}

---

### STORY (Direction)

**Life Narrative (Generative Story):**
${a.story_narrative}

**Mission (Clear Mission):**
${a.story_mission}

**Role (Empowered Role):**
${a.story_role}

---

### SPIRIT (Timeless)

**Values (Grounding Values):**
${a.spirit_values}

**Curiosity (Ignited Curiosity):**
${a.spirit_curiosity}

**Vision (Visualized Vision):**
${a.spirit_vision}`.trim();

    return templateText
      .replace('{INTAKE_DATA}', intakeData)
      .replace('{CHART_DATA}', '[Archetypal chart summary — generated from natal chart data at runtime]');
  };

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

  useEffect(() => {
    setIsCustomPromptActive(false);
    setShowCustomPrompt(false);
    setCustomPromptText('');
  }, [selectedPromptId]);

  const generateProfile = async () => {
    setGenerating(true);
    try {
      const body: Record<string, string> = {};
      if (isCustomPromptActive && customPromptText.trim()) {
        body.custom_prompt_text = customPromptText.trim();
      } else if (selectedPromptId) {
        body.prompt_template_id = selectedPromptId;
      }
      const res = await fetch(`/api/profile/${id}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify(body),
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

      if (errorMessage) { alert(`Generation failed: ${errorMessage}`); return; }
      if (!gotDone) { alert('Generation was interrupted before completing. Please try again.'); return; }

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
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
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
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ flow_profile_draft: gen.content }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAssessment();
        // Expand the card that just became the active draft
        setExpandedGenIds(prev => new Set(prev).add(gen.id));
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

  const selectedPrompt = promptTemplates.find(t => t.id === selectedPromptId);
  const cliCommand = `npm run profile:generate ${assessment.id}${selectedPrompt?.name ? ` "${selectedPrompt.name}"` : ''}`;
  const chartData = assessment.natal_chart_data as Record<string, string> | null;

  // If flow_profile_final exists but has no matching generation record (e.g. generated
  // before the profile_generations table existed), synthesize a virtual entry so it
  // still shows in the Outputs section.
  const deliveredOrphan =
    assessment.flow_profile_final &&
    !generations.some(g => g.content === assessment.flow_profile_final)
      ? ({
          id: '__delivered_orphan__',
          assessment_id: id,
          prompt_template_id: null,
          prompt_name: 'Delivered Profile',
          model: '',
          content: assessment.flow_profile_final,
          label: null,
          delivered: true,
          generated_at: assessment.updated_at || assessment.created_at,
        } as ProfileGeneration)
      : null;
  const allOutputs = deliveredOrphan ? [...generations, deliveredOrphan] : generations;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 md:p-10">
      {/* Scoped markdown styles */}
      <style jsx global>{`
        .admin-profile-content h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .admin-profile-content h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #fff;
          margin-top: 1.75rem;
          margin-bottom: 0.625rem;
        }
        .admin-profile-content h3 {
          font-size: 1.0625rem;
          font-weight: 600;
          color: #e5e5e5;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .admin-profile-content p {
          font-size: 0.9375rem;
          line-height: 1.75;
          color: #a1a1aa;
          margin-bottom: 0.875rem;
        }
        .admin-profile-content strong { color: #e5e5e5; font-weight: 600; }
        .admin-profile-content em { color: #c4c4c4; font-style: italic; }
        .admin-profile-content ul, .admin-profile-content ol {
          margin-bottom: 0.875rem;
          padding-left: 1.5rem;
        }
        .admin-profile-content li {
          font-size: 0.9375rem;
          line-height: 1.75;
          color: #a1a1aa;
          margin-bottom: 0.2rem;
        }
        .admin-profile-content hr {
          border: none;
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 1.5rem 0;
        }
        .admin-profile-content blockquote {
          border-left: 3px solid #6BA292;
          padding-left: 1rem;
          margin: 1.25rem 0;
          color: #a1a1aa;
          font-style: italic;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">

        {/* Back link */}
        <Link href="/profile/admin" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 mb-6 text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {/* ── Header ── */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{assessment.name}</h1>
            <p className="text-gray-500">{assessment.email}</p>
          </div>
          <span
            className="px-3 py-1 text-xs rounded-full border"
            style={{
              color: STATUS_COLORS[assessment.status],
              borderColor: `${STATUS_COLORS[assessment.status]}40`,
              backgroundColor: `${STATUS_COLORS[assessment.status]}15`,
            }}
          >
            {STATUS_LABELS[assessment.status]}
          </span>
        </div>

        {/* ── Run New Report (top of page) ── */}
        <motion.div
          className="p-6 rounded-xl bg-white/[0.03] border border-white/10 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm font-medium text-gray-400 mb-0.5">
            {assessment.status === 'intake_submitted' ? 'Next step' : 'Run new generation'}
          </p>
          <p className="text-white font-semibold mb-4">
            {assessment.status === 'intake_submitted' ? 'Generate Flow Profile' : 'Generate with different prompt'}
          </p>

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
              {selectedPrompt?.description && (
                <p className="text-xs text-gray-600 mt-1">{selectedPrompt.description}</p>
              )}
              <button
                type="button"
                onClick={() => {
                  if (!showCustomPrompt && assessment) {
                    const tpl = promptTemplates.find(t => t.id === selectedPromptId);
                    if (tpl) setCustomPromptText(buildPreviewPrompt(tpl.prompt_text, assessment));
                  }
                  setShowCustomPrompt(v => !v);
                }}
                className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
              >
                {showCustomPrompt ? '▲ Hide prompt' : '▼ Customize prompt'}
              </button>
            </div>
          )}

          {/* Custom prompt editor */}
          {showCustomPrompt && (
            <div className="mb-4 p-4 rounded-lg bg-white/[0.03] border border-white/[0.08]">
              <div className="flex items-start justify-between mb-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-400">Full prompt</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Intake data is pre-filled. <span className="text-[#6BA292]/70">{'{CHART_DATA}'}</span> is replaced at runtime with a Haiku-generated archetypal summary.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isCustomPromptActive && (
                    <span className="text-xs text-[#F97316] bg-[#F97316]/10 px-2 py-0.5 rounded border border-[#F97316]/20">
                      Custom active
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (assessment) {
                        const tpl = promptTemplates.find(t => t.id === selectedPromptId);
                        if (tpl) setCustomPromptText(buildPreviewPrompt(tpl.prompt_text, assessment));
                        setIsCustomPromptActive(false);
                      }
                    }}
                    className="text-xs text-gray-600 hover:text-gray-300 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <textarea
                value={customPromptText}
                onChange={(e) => { setCustomPromptText(e.target.value); setIsCustomPromptActive(true); }}
                rows={20}
                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-gray-300 font-mono text-xs focus:outline-none focus:border-white/25 resize-y leading-relaxed"
                spellCheck={false}
              />
              {!isCustomPromptActive && (
                <p className="text-xs text-gray-700 mt-1.5">Edit the prompt above to activate custom mode. Template settings (model, token limit) still apply.</p>
              )}
            </div>
          )}

          <ActionButton
            label={
              isCustomPromptActive
                ? 'Run with Custom Prompt'
                : assessment.status === 'intake_submitted'
                  ? 'Generate Flow Profile'
                  : 'Run Generation'
            }
            loading={generating}
            disabled={generating}
            onClick={generateProfile}
            color={isCustomPromptActive ? 'from-[#F97316] to-[#7A4DA4]' : assessment.status === 'intake_submitted' ? 'from-[#6BA292] to-[#7A4DA4]' : 'from-[#5B84B1] to-[#7A4DA4]'}
          />

          {/* Terminal command */}
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            {isCustomPromptActive ? (
              <p className="text-xs text-gray-600">
                Custom prompts run via UI only. To use this prompt in the CLI, save it as a template at{' '}
                <a href="/profile/admin/prompts" className="text-gray-500 hover:text-gray-300 underline">
                  /profile/admin/prompts
                </a>.
              </p>
            ) : (
              <>
                <p className="text-xs text-gray-600 mb-2">Copy to terminal (from <code className="text-gray-500">website/fourflowos-web</code>):</p>
                {promptTemplates.length > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-600 flex-shrink-0">Prompt:</span>
                    <select
                      value={selectedPromptId}
                      onChange={(e) => setSelectedPromptId(e.target.value)}
                      className="flex-1 max-w-xs px-2 py-1 bg-white/[0.05] border border-white/10 rounded-md text-white text-xs focus:outline-none focus:border-white/30 appearance-none"
                    >
                      {promptTemplates.map(t => (
                        <option key={t.id} value={t.id} className="bg-[#1a1a1a]">
                          {t.name} — {t.model.includes('haiku') ? 'Haiku' : t.model.includes('opus') ? 'Opus' : 'Sonnet'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-[#6BA292] font-mono bg-white/[0.04] px-3 py-2 rounded-lg border border-white/[0.07] select-all">
                    {cliCommand}
                  </code>
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(cliCommand).catch(() => {});
                      setCopiedCmd(true);
                      setTimeout(() => setCopiedCmd(false), 2000);
                    }}
                    className="text-xs text-gray-600 hover:text-gray-300 transition-colors px-2 py-2 rounded-lg hover:bg-white/[0.06] whitespace-nowrap flex-shrink-0"
                  >
                    {copiedCmd ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* ── Inputs ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <h2 className="text-lg font-semibold text-white">Inputs</h2>
          </div>
          <div className="space-y-2">

            {/* Intake */}
            <CollapsibleSection
              title="Intake"
              color="#ffffff"
              open={intakeOpen}
              onToggle={() => setIntakeOpen(v => !v)}
            >
              <InfoRow label="Date of birth" value={`${assessment.birth_date}${assessment.birth_time_known && assessment.birth_time ? ` at ${assessment.birth_time}` : ''}`} />
              <InfoRow label="Born in" value={assessment.birth_location} />
              <div className="pt-2 border-t border-white/5 mt-2 space-y-3">
                <TextBlock label="What's working" text={assessment.context_working} />
                <TextBlock label="What's stuck" text={assessment.context_stuck} />
                <TextBlock label="Building toward" text={assessment.context_building} />
              </div>
              {PILLAR_SECTIONS.map(pillar => (
                <div key={pillar.title} className="pt-3 border-t border-white/5 space-y-3">
                  <p className="text-xs font-medium" style={{ color: pillar.color }}>{pillar.title}</p>
                  {pillar.fields.map(field => (
                    <TextBlock
                      key={field.key}
                      label={field.label}
                      text={(assessment as unknown as Record<string, string>)[field.key]}
                    />
                  ))}
                </div>
              ))}
            </CollapsibleSection>

            {/* Astro Reading */}
            <CollapsibleSection
              title="Astro Reading"
              color="#7A4DA4"
              open={astroOpen}
              onToggle={() => setAstroOpen(v => !v)}
            >
              {chartData ? (
                <>
                  <InfoRow
                    label="Status"
                    value={chartData.context ? 'Chart calculated' : 'Data present — no summary'}
                  />
                  {chartData.context && (
                    <div className="pt-2 border-t border-white/5 mt-2">
                      <p className="text-xs text-gray-500 mb-1.5">Chart summary (used in generation)</p>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{chartData.context}</p>
                    </div>
                  )}
                  {Object.keys(chartData).filter(k => k !== 'context').length > 0 && (
                    <div className="pt-2 border-t border-white/5 mt-2">
                      <p className="text-xs text-gray-500 mb-1.5">Raw chart data</p>
                      <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                        {JSON.stringify(
                          Object.fromEntries(Object.entries(chartData).filter(([k]) => k !== 'context')),
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-600 italic">
                  Pending — natal chart data has not been generated yet.
                </p>
              )}
            </CollapsibleSection>

          </div>
        </div>

        {/* ── Outputs ── */}
        {allOutputs.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <h2 className="text-lg font-semibold text-white">Outputs</h2>
              <span className="text-xs text-gray-600 bg-white/[0.04] px-1.5 py-0.5 rounded ml-0.5">{allOutputs.length}</span>
            </div>
            <div className="space-y-2">
              {allOutputs.map(gen => {
                const isDelivered = assessment.flow_profile_final
                  ? gen.content === assessment.flow_profile_final
                  : gen.delivered;
                const isActiveDraft = gen.content === assessment.flow_profile_draft &&
                  gen.content !== assessment.flow_profile_final;
                const isExpanded = expandedGenIds.has(gen.id);
                const isUsing = usingGenId === gen.id;

                return (
                  <div
                    key={gen.id}
                    className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden"
                  >
                    {/* Card header — always visible, click to expand */}
                    <button
                      type="button"
                      onClick={() => toggleGen(gen.id)}
                      className="w-full px-5 py-4 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors text-left"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-white">{gen.prompt_name}</span>
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
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-gray-600 whitespace-nowrap">
                          {new Date(gen.generated_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="px-5 pb-6 border-t border-white/[0.06]">

                        {/* Rendered profile content */}
                        <div className="pt-5">
                          {isActiveDraft && editingDraft ? (
                            <textarea
                              value={draftProfile}
                              onChange={(e) => setDraftProfile(e.target.value)}
                              rows={28}
                              className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-white/30 resize-y"
                            />
                          ) : (
                            <ProfileMarkdown content={isActiveDraft ? (draftProfile || gen.content) : gen.content} />
                          )}

                          {/* Edit toggle for active draft */}
                          {isActiveDraft && (
                            <button
                              type="button"
                              onClick={() => setEditingDraft(!editingDraft)}
                              className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                            >
                              {editingDraft ? 'Preview' : 'Edit'}
                            </button>
                          )}

                          {/* Use as draft — for non-draft, non-delivered gens */}
                          {!isDelivered && !isActiveDraft && (
                            <button
                              type="button"
                              onClick={() => useGenerationAsDraft(gen)}
                              disabled={isUsing}
                              className="mt-4 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                            >
                              {isUsing ? 'Setting as draft…' : 'Use as draft →'}
                            </button>
                          )}
                        </div>

                        {/* Deliver section — shown for active draft */}
                        {isActiveDraft && (
                          <div className="mt-6 pt-5 border-t border-white/[0.06]">
                            <p className="text-sm font-medium text-gray-400 mb-1">
                              {assessment.status === 'delivered' ? 'Re-deliver to client' : 'Deliver to client'}
                            </p>
                            <p className="text-xs text-gray-600 mb-4">
                              {assessment.status === 'delivered'
                                ? 'This will send a new delivery email and update the client view link.'
                                : 'Optional: add a personal note that will appear in the delivery email above the profile link.'}
                            </p>
                            <textarea
                              value={customNotes}
                              onChange={(e) => setCustomNotes(e.target.value)}
                              rows={3}
                              placeholder={
                                assessment.status === 'delivered'
                                  ? 'Hi [name], updated your profile with a new lens...'
                                  : 'Hi [name], really enjoyed reviewing this...'
                              }
                              className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 resize-none text-sm mb-4"
                            />
                            <ActionButton
                              label={assessment.status === 'delivered' ? 'Re-deliver to Client' : 'Deliver to Client'}
                              loading={delivering}
                              disabled={delivering}
                              onClick={deliverProfile}
                              color="from-[#22C55E] to-[#6BA292]"
                            />
                          </div>
                        )}

                        {/* Client view link — shown on delivered generation */}
                        {isDelivered && assessment.view_token && (
                          <div className="mt-5 pt-4 border-t border-white/[0.06]">
                            <p className="text-xs text-gray-500 mb-1">Client view link:</p>
                            <code className="text-xs text-[#6BA292] break-all">
                              {typeof window !== 'undefined'
                                ? `${window.location.origin}/profile/view/${assessment.view_token}`
                                : `/profile/view/${assessment.view_token}`}
                            </code>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────

function CollapsibleSection({
  title,
  color,
  children,
  open,
  onToggle,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-4 rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color === '#ffffff' ? 'rgba(255,255,255,0.4)' : color }}
          />
          <h2 className="text-base font-semibold text-white">{title}</h2>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-3">
          {children}
        </div>
      )}
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
