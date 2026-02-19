'use client';

import { use } from 'react';
import AdminAuth from '@/components/profile/AdminAuth';
import AssessmentDetail from '@/components/profile/AssessmentDetail';

export default function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AdminAuth>
      <AssessmentDetail id={id} />
    </AdminAuth>
  );
}
