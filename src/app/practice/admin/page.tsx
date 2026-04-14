import AdminAuth from '@/components/profile/AdminAuth';
import PracticeAdminDashboard from './PracticeAdminDashboard';

export default function PracticeAdminPage() {
  return (
    <AdminAuth>
      <PracticeAdminDashboard />
    </AdminAuth>
  );
}
