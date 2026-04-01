'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ToolId } from './useLabState';
import ProfileSummary from './ProfileSummary';
import FlowZone from '@/components/tools/flowzone/FlowZone';
import FlowRead from '@/components/tools/flowread/FlowRead';
import CuriosityExplorer from '@/components/tools/CuriosityExplorer';
import CompendiumNavigator from '@/components/tools/training/CompendiumNavigator';
import Breathwork from '@/components/tools/flowzone/Breathwork';

interface ActivityAreaProps {
  activeTool: ToolId;
  onBack: () => void;
}

// Tools that manage their own internal padding — the activity window provides
// only the outer shell (border + width). Content tools get extra inner padding.
const PADDED_TOOLS: ToolId[] = ['profile', 'breathwork', 'compendium', 'training'];

function ToolContent({ activeTool, onBack }: ActivityAreaProps) {
  switch (activeTool) {
    case 'profile':    return <ProfileSummary />;
    case 'flowzone':   return <FlowZone />;
    case 'flowread':   return <FlowRead />;
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
    <div className="flex-1 overflow-auto min-h-0 py-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-[90%] md:w-[70%] mx-auto border border-white/[0.07] rounded-2xl overflow-hidden"
        >
          <div className={isPadded ? 'p-6 md:p-8' : ''}>
            <ToolContent activeTool={activeTool} onBack={onBack} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
