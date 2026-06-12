'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { GRADIENTS } from '@/styles/brand-colors';
import type { PromptTemplate } from '@/lib/supabase';

const MODEL_OPTIONS = [
  { value: 'claude-sonnet-4-6', label: 'Sonnet 4.6', description: 'Best quality, balanced cost/speed' },
  { value: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5', description: 'Fast and cheap, good for simpler profiles' },
  { value: 'claude-opus-4-6', label: 'Opus 4.6', description: 'Highest quality, premium profiles' },
];

function tokenLabel(tokens: number): string {
  if (tokens <= 800) return 'Brief — quick summary';
  if (tokens <= 1200) return 'Short — focused overview';
  if (tokens <= 1800) return 'Standard — balanced depth';
  if (tokens <= 2500) return 'Detailed — full analysis';
  if (tokens <= 3200) return 'Thorough — comprehensive';
  return 'Maximum — full deep dive';
}

export default function PromptManager() {
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt_text: '',
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    is_active: true,
  });

  const adminKey = typeof window !== 'undefined' ? sessionStorage.getItem('profile_admin_key') || '' : '';

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile/prompts', {
        headers: { 'x-admin-key': adminKey },
      });
      const data = await res.json();
      if (data.success) {
        setPrompts(data.prompts);
      }
    } catch (err) {
      console.error('Failed to fetch prompts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    if (!formData.name || !formData.prompt_text) {
      alert('Name and prompt text are required');
      return;
    }

    try {
      const res = await fetch('/api/profile/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        await fetchPrompts();
        setCreating(false);
        setFormData({
          name: '',
          description: '',
          prompt_text: '',
          model: 'claude-sonnet-4-6',
          max_tokens: 2000,
          is_active: true,
        });
      } else {
        alert(`Failed to create: ${data.error}`);
      }
    } catch (err) {
      console.error('Create failed:', err);
      alert('Failed to create prompt');
    }
  };

  const handleUpdate = async (id: string) => {
    const prompt = prompts.find(p => p.id === id);
    if (!prompt) return;

    try {
      const res = await fetch(`/api/profile/prompts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        await fetchPrompts();
        setEditingId(null);
      } else {
        alert(`Failed to update: ${data.error}`);
      }
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update prompt');
    }
  };

  const handleDelete = async (id: string) => {
    const prompt = prompts.find(p => p.id === id);
    if (!confirm(`Delete prompt "${prompt?.name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/profile/prompts/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey },
      });

      const data = await res.json();
      if (data.success) {
        await fetchPrompts();
      } else {
        alert(`Failed to delete: ${data.error}`);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete prompt');
    }
  };

  const startEdit = (prompt: PromptTemplate) => {
    setEditingId(prompt.id);
    setFormData({
      name: prompt.name,
      description: prompt.description || '',
      prompt_text: prompt.prompt_text,
      model: prompt.model,
      max_tokens: prompt.max_tokens,
      is_active: prompt.is_active,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCreating(false);
    setFormData({
      name: '',
      description: '',
      prompt_text: '',
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      is_active: true,
    });
  };

  return (
    <div className="min-h-screen bg-ground p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile/admin" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 mb-4 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Prompt Templates</h1>
              <p className="text-gray-500">
                {prompts.length} template{prompts.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <button
              onClick={() => setCreating(true)}
              className="px-4 py-2 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
              style={{ background: GRADIENTS.tertiaryCta }}
            >
              + New Template
            </button>
          </div>
        </div>

        {/* Create/Edit Form */}
        <AnimatePresence>
          {(creating || editingId) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-6 rounded-xl bg-white/[0.03] border border-white/10"
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                {creating ? 'Create New Template' : 'Edit Template'}
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Template Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Flow Archetype"
                    className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-white/30"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description (optional)</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Astro-focused profile emphasizing archetypal patterns"
                    className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-white/30"
                  />
                </div>

                {/* Model + Max Tokens */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Model</label>
                    <select
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                    >
                      {MODEL_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label} — {opt.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-gray-400">Max Tokens</label>
                      <span className="text-sm font-mono text-white">{formData.max_tokens}</span>
                    </div>
                    <input
                      type="range"
                      value={formData.max_tokens}
                      onChange={(e) => setFormData({ ...formData, max_tokens: parseInt(e.target.value) })}
                      min={500}
                      max={4000}
                      step={100}
                      className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-space cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">{tokenLabel(formData.max_tokens)}</p>
                  </div>
                </div>

                {/* Active */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-400">Active (available for use)</label>
                </div>

                {/* Prompt Text */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Prompt Text
                    <span className="text-xs text-gray-600 ml-2">(Use {'{INTAKE_DATA}'} and {'{CHART_DATA}'} placeholders)</span>
                  </label>
                  <textarea
                    value={formData.prompt_text}
                    onChange={(e) => setFormData({ ...formData, prompt_text: e.target.value })}
                    rows={16}
                    placeholder="You are generating a personalized Flow Profile..."
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-lg text-white placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-white/30 resize-y"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => creating ? handleCreate() : handleUpdate(editingId!)}
                    className="px-5 py-2 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                    style={{ background: GRADIENTS.tertiaryCta }}
                  >
                    {creating ? 'Create' : 'Save Changes'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-5 py-2 bg-white/[0.05] border border-white/10 text-white rounded-lg text-sm hover:bg-white/[0.08] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prompts List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No prompt templates yet. Create one to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {prompts.map((prompt, idx) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-medium">{prompt.name}</h3>
                      {!prompt.is_active && (
                        <span className="px-2 py-0.5 text-xs rounded bg-gray-700/30 text-gray-500">Inactive</span>
                      )}
                    </div>
                    {prompt.description && (
                      <p className="text-sm text-gray-500">{prompt.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(prompt)}
                      className="px-3 py-1 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/30 rounded transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prompt.id)}
                      className="px-3 py-1 text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>Model: {MODEL_OPTIONS.find(m => m.value === prompt.model)?.label || prompt.model}</span>
                  <span>•</span>
                  <span>Max tokens: {prompt.max_tokens}</span>
                  <span>•</span>
                  <span>Updated {new Date(prompt.updated_at).toLocaleDateString()}</span>
                </div>

                <details className="mt-3">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
                    View prompt text
                  </summary>
                  <pre className="mt-2 p-3 bg-black/30 rounded text-xs text-gray-400 whitespace-pre-wrap overflow-auto max-h-60">
                    {prompt.prompt_text}
                  </pre>
                </details>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
