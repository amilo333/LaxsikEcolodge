import { Suspense } from 'react';

import AdminModule from '@/modules/admin';
import { AdminLocalizationBoundary } from '@/modules/admin/components/admin-localization-boundary';
import { getTranslations } from 'next-intl/server';

export default async function AdminPage() {
  const t = await getTranslations('Common');
  return (
    <AdminLocalizationBoundary>
      <Suspense
        fallback={
          <div className='flex min-h-screen items-center justify-center bg-[#F2F6F4] text-sm font-semibold text-[#0D4949]'>
            {t('loadingDashboard')}
          </div>
        }>
        <AdminModule />
      </Suspense>
    </AdminLocalizationBoundary>
  );
}
