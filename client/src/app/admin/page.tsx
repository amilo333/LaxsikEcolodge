import { Suspense } from 'react';

import AdminModule from '@/modules/admin';

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center bg-[#F2F6F4] text-sm font-semibold text-[#0D4949]'>
          Đang tải dashboard…
        </div>
      }>
      <AdminModule />
    </Suspense>
  );
}
