import FlowZone from '@/components/tools/flowzone/FlowZone';
import ToolShell from '@/components/ui/ToolShell';
import AuthGate from '@/components/auth/AuthGate';

export const metadata = {
  title: 'FlowZone — Deep Work Companion | FourFlowOS',
  description: 'Enter your flow state with breathwork, Focus Reps tracking, and ambient audio. A deep-work companion tool from FourFlowOS.',
};

export default function FlowZonePage() {
  return (
    <AuthGate>
      <ToolShell toolId="flowzone" standalone>
        <FlowZone />
      </ToolShell>
    </AuthGate>
  );
}
