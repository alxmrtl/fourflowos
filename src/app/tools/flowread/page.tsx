import FlowRead from '@/components/tools/flowread/FlowRead';
import ToolShell from '@/components/ui/ToolShell';

export const metadata = {
  title: 'FlowRead — Speed Reading Trainer | FourFlowOS',
  description: 'Train absorption at full attention with RSVP, phrase chunking, and line pacing. Opens the Open Mind Key.',
};

export default function FlowReadPage() {
  return (
    <ToolShell toolId="flowread" standalone>
      <FlowRead />
    </ToolShell>
  );
}
