'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ToolId } from './useLabState';
import { getToolMeta } from './sections-data';
import ToolShell from '@/components/ui/ToolShell';
import ProfileSummary from './ProfileSummary';
import FlowZone from '@/components/tools/flowzone/FlowZone';
import FlowRead from '@/components/tools/flowread/FlowRead';
import FlowWrite from '@/components/tools/flowwrite/FlowWrite';
import CuriosityExplorer from '@/components/tools/CuriosityExplorer';
import CompendiumNavigator from '@/components/tools/training/CompendiumNavigator';
import Breathwork from '@/components/tools/flowzone/Breathwork';

interface ActivityAreaProps {
  activeTool: ToolId;
  onBack: () => void;
}

function ToolContent({ activeTool, onBack }: ActivityAreaProps) {
  switch (activeTool) {
    case 'flow-lens':        return <ProfileSummary mode="lens" />;
    case 'ancestral-signal': return <ProfileSummary mode="esoteric" />;
    case 'flowzone':   return <FlowZone embedded />;
    case 'flowwrite':  return <FlowWrite embedded />;
    case 'flowread':   return <FlowRead embedded />;
    case 'curiosity':  return <CuriosityExplorer />;
    case 'compendium': return <CompendiumNavigator />;
    case 'breathwork':
      return (
        <div className="flex items-start justify-center pt-6">
          <Breathwork onDone={onBack} onSkip={onBack} label="FlowLab" targetCycles={5} />
        </div>
      );
    default: return <ProfileSummary mode="lens" />;
  }
}

export default function ActivityArea({ activeTool, onBack }: ActivityAreaProps) {
  const meta = getToolMeta(activeTool);
  const isWide = meta?.width === 'wide';

  return (
    <div className={`flex-1 overflow-auto min-h-0 ${isWide ? 'py-3 lg:py-4' : 'py-6'}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`mx-auto ${isWide ? 'w-[96%] lg:w-[94%]' : 'w-[90%] md:w-[70%]'}`}
        >
          <ToolShell toolId={activeTool}>
            <ToolContent activeTool={activeTool} onBack={onBack} />
          </ToolShell>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
