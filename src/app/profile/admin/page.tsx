'use client';

import AdminAuth from '@/components/profile/AdminAuth';
import AdminDashboard from '@/components/profile/AdminDashboard';

export default function AdminPage() {
  return (
    <AdminAuth>
      <AdminDashboard />
    </AdminAuth>
  );
}
