import CuriosityExplorer from '@/components/tools/CuriosityExplorer';
import ToolShell from '@/components/ui/ToolShell';
import AuthGate from '@/components/auth/AuthGate';

export const metadata = {
  title: 'FlowSpark — Find Where Your Flow Lives | FourFlowOS',
  description: 'Surface what genuinely fascinates you and map the intersections where your flow naturally lives. Opens the Ignited Curiosity Key.',
};

export default function FlowSparkPage() {
  return (
    <AuthGate>
      <ToolShell toolId="curiosity" standalone>
        <CuriosityExplorer />
      </ToolShell>
    </AuthGate>
  );
}
