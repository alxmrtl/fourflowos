import FlowZone from '@/components/tools/flowzone/FlowZone';
import AuthGate from '@/components/auth/AuthGate';

export const metadata = {
  title: 'FlowZone — Deep Work Companion | FourFlowOS',
  description: 'Enter your flow state with breathwork, Focus Reps tracking, and ambient audio. A deep-work companion tool from FourFlowOS.',
};

export default function FlowZonePage() {
  return (
    <AuthGate>
      <FlowZone />
    </AuthGate>
  );
}
