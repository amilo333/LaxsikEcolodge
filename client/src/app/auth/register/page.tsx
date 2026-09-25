import { AuthLayout } from '@/layouts';
import { RegisterModule } from '@/modules/auth/register';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

export default async function RegisterPage() {
  const t = await getTranslations('Common');
  return (
    <AuthLayout>
      <Suspense fallback={<div className='p-10'>{t('loading')}</div>}>
        <RegisterModule />
      </Suspense>
    </AuthLayout>
  );
}
