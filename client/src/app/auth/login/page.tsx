import LoginModule from '@/modules/auth/login';
import { AuthLayout } from '@/layouts/auth-layout';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

export default async function LoginPage() {
  const t = await getTranslations('Common');
  return (
    <AuthLayout>
      <Suspense fallback={<div className='p-10'>{t('loading')}</div>}>
        <LoginModule />
      </Suspense>
    </AuthLayout>
  );
}
