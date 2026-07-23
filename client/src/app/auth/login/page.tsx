import LoginModule from '@/modules/auth/login';
import { AuthLayout } from '@/layouts/auth-layout';

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginModule />
    </AuthLayout>
  );
}
