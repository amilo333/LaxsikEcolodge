import { AuthLayout } from '@/layouts';
import { RegisterModule } from '@/modules/auth/register';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterModule />
    </AuthLayout>
  );
}
