import LoginModule from '@/modules/auth/login';
import { AuthLayout } from '@/layouts/auth-layout';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div className='p-10'>Loading…</div>}>
        <LoginModule />
      </Suspense>
    </AuthLayout>
  );
}
