import ToolsNav from '@/components/tools/ToolsNav';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-[#0a0a0a] overflow-auto">
      <ToolsNav />
      {children}
    </div>
  );
}
