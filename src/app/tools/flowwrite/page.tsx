import FlowWrite from '@/components/tools/flowwrite/FlowWrite';
import ToolShell from '@/components/ui/ToolShell';

export const metadata = {
  title: 'FlowWrite — Momentum Writing | FourFlowOS',
  description: 'Write before you think. A momentum writing container with a live flow trace — your typing rhythm made visible. Opens the Generative Story Key.',
};

export default function FlowWritePage() {
  return (
    <ToolShell toolId="flowwrite" standalone>
      <FlowWrite />
    </ToolShell>
  );
}
