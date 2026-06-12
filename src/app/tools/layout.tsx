import ToolsNav from '@/components/tools/ToolsNav';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-ground overflow-auto">
      <ToolsNav />
      {children}
    </div>
  );
}
