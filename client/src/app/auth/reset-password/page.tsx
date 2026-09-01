import ResetPasswordModule from '@/modules/auth/reset-password';
import { AuthLayout } from '@/layouts/auth-layout';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div className='p-10'>Loading…</div>}>
        <ResetPasswordModule />
      </Suspense>
    </AuthLayout>
  );
}
