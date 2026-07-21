'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/auth/useProfile';
import { Loading } from '@/layouts/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  const { data, isLoading } = useProfile();

  useEffect(() => {
    if (!isLoading && !data) {
      router.replace('/auth/login');
    }
  }, [data, isLoading, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return null;
  }

  return <>{children}</>;
}
