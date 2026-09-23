import { Suspense } from 'react';

import AdminModule from '@/modules/admin';
import { AdminLocalizationBoundary } from '@/modules/admin/components/admin-localization-boundary';

export default function AdminPage() {
  return (
    <AdminLocalizationBoundary>
      <Suspense
        fallback={
          <div className='flex min-h-screen items-center justify-center bg-[#F2F6F4] text-sm font-semibold text-[#0D4949]'>
            Đang tải dashboard…
          </div>
        }>
        <AdminModule />
      </Suspense>
    </AdminLocalizationBoundary>
  );
}
