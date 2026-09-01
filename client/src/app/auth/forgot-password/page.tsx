import ForgotPasswordModule from '@/modules/auth/forgot-password';
import { AuthLayout } from '@/layouts/auth-layout';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordModule />
    </AuthLayout>
  );
}
