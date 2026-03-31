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

function ToolContent({ activeTool, onBack }: ActivityAreaProps) {
  switch (activeTool) {
    case 'profile':
      return <ProfileSummary />;
    case 'flowzone':
      return <FlowZone />;
    case 'flowread':
      return <FlowRead />;
    case 'curiosity':
      return <CuriosityExplorer />;
    case 'compendium':
      return <CompendiumNavigator />;
    case 'breathwork':
      return (
        <div className="flex items-start justify-center pt-8 px-4">
          <Breathwork onDone={onBack} onSkip={onBack} label="FlowLab" />
        </div>
      );
    default:
      return <ProfileSummary />;
  }
}

export default function ActivityArea({ activeTool, onBack }: ActivityAreaProps) {
  return (
    <div className="flex-1 overflow-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="h-full"
        >
          <ToolContent activeTool={activeTool} onBack={onBack} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
