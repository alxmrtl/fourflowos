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

// Tools that manage their own full-height layout — only get horizontal padding
const FULL_HEIGHT_TOOLS: ToolId[] = ['flowzone', 'flowread', 'curiosity'];

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
  const isFullHeight = FULL_HEIGHT_TOOLS.includes(activeTool);

  return (
    <div className="flex-1 overflow-auto min-h-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={isFullHeight ? 'h-full' : 'px-6 py-7 max-w-3xl'}
        >
          <ToolContent activeTool={activeTool} onBack={onBack} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
