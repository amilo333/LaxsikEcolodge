import ResetPasswordModule from '@/modules/auth/reset-password';
import { AuthLayout } from '@/layouts/auth-layout';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

export default async function ResetPasswordPage() {
  const t = await getTranslations('Common');
  return (
    <AuthLayout>
      <Suspense fallback={<div className='p-10'>{t('loading')}</div>}>
        <ResetPasswordModule />
      </Suspense>
    </AuthLayout>
  );
}
