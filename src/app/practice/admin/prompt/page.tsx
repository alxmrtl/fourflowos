import AdminAuth from '@/components/profile/AdminAuth';
import FlowUnlockPromptInspector from './FlowUnlockPromptInspector';

export default function PromptInspectorPage() {
  return (
    <AdminAuth>
      <FlowUnlockPromptInspector />
    </AdminAuth>
  );
}
