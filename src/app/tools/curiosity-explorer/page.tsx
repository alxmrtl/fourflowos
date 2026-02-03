import CuriosityExplorer from '@/components/tools/CuriosityExplorer';
import CuriosityExplorerHeader from './CuriosityExplorerHeader';

export const metadata = {
  title: 'Curiosity Explorer — Map Your Flow | FourFlowOS',
  description: 'Discover where your flow lives by mapping your curiosities and finding the intersections that ignite you.',
};

export default function CuriosityExplorerPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <CuriosityExplorerHeader />
      <div className="h-px mx-6" style={{ background: 'linear-gradient(90deg, #7A4DA4, #5B84B1)', opacity: 0.4 }} />
      <CuriosityExplorer />
    </div>
  );
}
