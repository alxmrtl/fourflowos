'use client';

import AdminAuth from '@/components/profile/AdminAuth';
import PromptManager from '@/components/profile/PromptManager';

export default function PromptsPage() {
  return (
    <AdminAuth>
      <PromptManager />
    </AdminAuth>
  );
}
