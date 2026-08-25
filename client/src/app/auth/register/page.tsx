import { AuthLayout } from '@/layouts';
import { RegisterModule } from '@/modules/auth/register';
import { Suspense } from 'react';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div className='p-10'>Loading…</div>}>
        <RegisterModule />
      </Suspense>
    </AuthLayout>
  );
}
