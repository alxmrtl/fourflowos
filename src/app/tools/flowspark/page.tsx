import CuriosityExplorer from '@/components/tools/CuriosityExplorer';
import CuriosityExplorerHeader from '../curiosity-explorer/CuriosityExplorerHeader';
import AuthGate from '@/components/auth/AuthGate';

export const metadata = {
  title: 'FlowSpark — Find Where Your Flow Lives | FourFlowOS',
  description: 'Surface what genuinely fascinates you and map the intersections where your flow naturally lives.',
};

export default function FlowSparkPage() {
  return (
    <AuthGate>
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
        <CuriosityExplorerHeader />
        <div className="h-px mx-6" style={{ background: 'linear-gradient(90deg, #6330A0, #3E6FA3)', opacity: 0.4 }} />
        <CuriosityExplorer />
      </div>
    </AuthGate>
  );
}
