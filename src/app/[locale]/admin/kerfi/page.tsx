'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/hooks/useAuth';
import { SystemSection } from '@/components/admin/SystemSection';
import { Loader2 } from 'lucide-react';

export default function AdminSystemPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center py-24 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full">
      {message && (
        <div className="mb-6 max-w-3xl rounded-xl border border-(--color-border) bg-(--color-bg-secondary) px-4 py-3 text-sm font-medium text-(--color-text-primary) shadow-sm">
          {message}
        </div>
      )}
      <SystemSection
        showMessage={setMessage}
        onRefresh={() => router.refresh()}
        user={user}
      />
    </div>
  );
}
