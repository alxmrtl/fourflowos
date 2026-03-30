'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import FlowZone from '@/components/tools/flowzone/FlowZone';
import FlowRead from '@/components/tools/flowread/FlowRead';
import CuriosityExplorer from '@/components/tools/CuriosityExplorer';
import TrainingApp from '@/components/tools/training/TrainingApp';
import CompendiumNavigator from '@/components/tools/training/CompendiumNavigator';
import Breathwork from '@/components/tools/flowzone/Breathwork';
import { STEEL, AMETHYST } from '@/styles/brand-colors';
import BreathEntry from './BreathEntry';
import FieldView from './FieldView';
import MetaView from './MetaView';
import { useLabState } from './useLabState';
import type { FieldId, ToolId } from './useLabState';

const FIELD_LABELS: Record<FieldId, string> = {
  consume: 'CONSUME',
  create: 'CREATE',
  catalyze: 'CATALYZE',
  core: 'CORE',
};

// Lightweight profile summary shown in the CORE / Profile tool view
function ProfileSummary() {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<{
    status: string;
    view_token: string | null;
    flow_profile_json: { archetype?: { name?: string; tagline?: string } } | null;
    flow_profile_final: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabaseBrowser();
    supabase
      .from('assessments')
      .select('status, view_token, flow_profile_json, flow_profile_final')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setAssessment(data);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    );
  }

  const hasProfile =
    assessment &&
    assessment.status !== 'intake_submitted' &&
    (assessment.flow_profile_json || assessment.flow_profile_final);

  if (!hasProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <p className="text-white/35 text-sm mb-6">You don&apos;t have a Flow Profile yet.</p>
        <Link
          href="/profile/intake"
          className="px-6 py-2.5 rounded-full text-white text-sm font-semibold"
          style={{ background: `linear-gradient(135deg, ${STEEL}, ${AMETHYST})` }}
        >
          Get your Flow Profile
        </Link>
      </div>
    );
  }

  const archetype = assessment.flow_profile_json?.archetype;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-6 py-8 max-w-md"
    >
      {archetype?.name ? (
        <>
          <p className="text-white/35 text-[10px] uppercase tracking-[0.28em] mb-2">
            Your Archetype
          </p>
          <h2 className="text-white text-2xl font-semibold mb-2">{archetype.name}</h2>
          {archetype.tagline && (
            <p className="text-white/45 text-sm italic mb-6 leading-relaxed">{archetype.tagline}</p>
          )}
        </>
      ) : assessment.flow_profile_final ? (
        <p className="text-white/55 text-sm leading-relaxed mb-6 line-clamp-5">
          {assessment.flow_profile_final.slice(0, 320)}
          {assessment.flow_profile_final.length > 320 ? '…' : ''}
        </p>
      ) : null}

      {assessment.view_token && (
        <Link
          href={`/profile/view/${assessment.view_token}`}
          className="inline-flex items-center gap-1.5 text-sm px-5 py-2 rounded-full border border-white/12 text-white/55 hover:text-white/80 hover:border-white/25 transition-colors"
        >
          View full profile →
        </Link>
      )}
    </motion.div>
  );
}

function ToolRenderer({ tool, onBack }: { tool: ToolId; onBack: () => void }) {
  switch (tool) {
    case 'flowzone':
      return <FlowZone />;
    case 'flowread':
      return <FlowRead />;
    case 'curiosity':
      return <CuriosityExplorer />;
    case 'compendium':
      return <CompendiumNavigator />;
    case 'breathwork':
      return <Breathwork onDone={onBack} onSkip={onBack} label="FlowLab" />;
    case 'training':
      return <TrainingApp />;
    case 'profile':
      return <ProfileSummary />;
    default:
      return null;
  }
}

export default function FlowLab() {
  const { user, loading } = useAuth();
  const {
    phase,
    activeField,
    activeTool,
    isMeta,
    lastField,
    skipBreath,
    completeBreath,
    enterField,
    enterTool,
    exitTool,
    toggleMeta,
    recentre,
  } = useLabState();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <AuthModal />
      </div>
    );
  }

  const handleSelectTool = (fieldId: FieldId, toolId: ToolId) => {
    enterField(fieldId);
    enterTool(toolId);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AnimatePresence mode="wait">
        {/* Breath ritual */}
        {phase === 'breath' && (
          <motion.div key="breath" className="min-h-screen">
            <BreathEntry onComplete={completeBreath} onSkip={skipBreath} />
          </motion.div>
        )}

        {/* Field view or tool view */}
        {phase === 'fields' && (
          <motion.div key="fields" className="min-h-screen">
            {activeTool ? (
              // Tool full-screen
              <div className="min-h-screen relative">
                {/* Back nav — floats above the tool */}
                <div className="fixed top-4 left-4 z-50">
                  <button
                    onClick={exitTool}
                    className="flex items-center gap-2 text-white/35 hover:text-white/65 transition-colors text-xs uppercase tracking-wider"
                  >
                    <span>←</span>
                    <span>{activeField ? FIELD_LABELS[activeField] : 'FLOWLAB'}</span>
                  </button>
                </div>
                <ToolRenderer tool={activeTool} onBack={exitTool} />
              </div>
            ) : (
              <FieldView
                lastField={lastField}
                onSelectTool={handleSelectTool}
                onToggleMeta={toggleMeta}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meta overlay */}
      <AnimatePresence>
        {isMeta && (
          <MetaView
            onSelectTool={handleSelectTool}
            onClose={toggleMeta}
            onRecentre={recentre}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
