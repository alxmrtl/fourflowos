'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import type { ToolId } from './useLabState';
import ProfileSummary from './ProfileSummary';
import FlowZone from '@/components/tools/flowzone/FlowZone';
import FlowRead from '@/components/tools/flowread/FlowRead';
import CuriosityExplorer from '@/components/tools/CuriosityExplorer';
import CompendiumNavigator from '@/components/tools/training/CompendiumNavigator';
import Breathwork from '@/components/tools/flowzone/Breathwork';
import { GRADIENTS } from '@/styles/brand-colors';

interface ActivityAreaProps {
  activeTool: ToolId;
  onBack: () => void;
}

// Tools that manage their own internal padding — the activity window provides
// only the outer shell (border + width). Content tools get extra inner padding.
const PADDED_TOOLS: ToolId[] = ['profile', 'breathwork', 'compendium', 'training'];

// Metadata for the consistent tool header bar
const TOOL_META: Partial<Record<ToolId, { icon: string; label: string; description: string }>> = {
  profile:    { icon: '/assets/LOGOS/FOURFLOW - MAIN LOGO.png', label: 'Flow Profile',   description: 'Your consciousness alignment map' },
  flowread:   { icon: '/assets/apps/flowread-icon.png',          label: 'FlowRead',        description: 'Undivided attention + absorption training' },
  compendium: { icon: '/assets/LOGOS/OPEN MIND.png',             label: 'FlowCompendium',  description: 'Browse 191 flow protocols'         },
  breathwork: { icon: '/assets/LOGOS/FOCUSED BODY.png',          label: 'FlowBreath',      description: 'Shift state — body first'          },
  curiosity:  { icon: '/assets/LOGOS/IGNITED CURIOSITY.png',     label: 'FlowSpark',       description: 'Map what pulls you'               },
  flowzone:   { icon: '/assets/apps/flowzone-icon.png',          label: 'FlowZone',        description: 'Focus timer + reps'               },
};

function ToolHeader({ activeTool }: { activeTool: ToolId }) {
  const meta = TOOL_META[activeTool];
  if (!meta) return null;
  return (
    <>
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="relative w-6 h-6 flex-shrink-0 opacity-85">
          <Image src={meta.icon} alt={meta.label} fill className="object-contain" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white leading-none tracking-tight">{meta.label}</h2>
          <p className="text-[11px] text-white/45 mt-0.5 leading-tight">{meta.description}</p>
        </div>
      </div>
      <div className="h-px" style={{ background: GRADIENTS.fourPillar, opacity: 0.3 }} />
    </>
  );
}

function ToolContent({ activeTool, onBack }: ActivityAreaProps) {
  switch (activeTool) {
    case 'profile':    return <ProfileSummary />;
    case 'flowzone':   return <FlowZone hideHeader />;
    case 'flowread':   return <FlowRead hideHeader />;
    case 'curiosity':  return <CuriosityExplorer />;
    case 'compendium': return <CompendiumNavigator />;
    case 'breathwork':
      return (
        <div className="flex items-start justify-center pt-6">
          <Breathwork onDone={onBack} onSkip={onBack} label="FlowLab" />
        </div>
      );
    default: return <ProfileSummary />;
  }
}

export default function ActivityArea({ activeTool, onBack }: ActivityAreaProps) {
  const isPadded = PADDED_TOOLS.includes(activeTool);

  return (
    <div className="flex-1 overflow-auto min-h-0 py-6 pb-6 md:pb-6" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-[90%] md:w-[70%] mx-auto border border-white/[0.07] rounded-2xl overflow-hidden"
        >
          <ToolHeader activeTool={activeTool} />
          <div className={isPadded ? 'p-6 md:p-8' : ''}>
            <ToolContent activeTool={activeTool} onBack={onBack} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
