'use client';

import { useEffect } from 'react';
import { useProfile } from '@/hooks/auth/useProfile';
import { useAuthStore } from '@/store/auth.store';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const login = useAuthStore((state) => state.login);

  const { data, isSuccess } = useProfile();

  useEffect(() => {
    if (isSuccess) {
      login(data);
    }
  }, [data, isSuccess, login]);

  return children;
}
