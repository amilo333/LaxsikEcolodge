'use client';

import { Button } from '@/components/core';
import { Footer, Header } from '@/components/layouts';
import { useProfileApi } from '@/modules/auth/common';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AccountNavigation, MyBookingsPanel, ProfilePanel } from './components';

type TAccountModuleProps = {
  view: 'bookings' | 'profile';
};

export function AccountModule({ view }: TAccountModuleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const profileQuery = useProfileApi();
  const isUnauthorized =
    axios.isAxiosError(profileQuery.error) &&
    profileQuery.error.response?.status === 401;

  useEffect(() => {
    if (isUnauthorized) {
      router.replace(
        `/auth/login?redirect=${encodeURIComponent(pathname || '/account/profile')}`
      );
    }
  }, [isUnauthorized, pathname, router]);

  const user = profileQuery.data;

  return (
    <div className="min-h-screen bg-[url('/images/bg-screen.jpg')] bg-[length:720px_720px] text-[#172B29]">
      <Header />

      <main className='mx-auto min-h-[620px] w-[calc(100%-32px)] max-w-[1180px] py-8 sm:py-12'>
        <div className='mb-7'>
          <p className='text-[11px] font-bold tracking-[0.16em] text-[#0D4949]/60 uppercase'>
            Member area
          </p>
          <h1 className='mt-1 text-3xl font-extrabold tracking-[-0.035em] text-[#123F3D]'>
            Tài khoản của tôi
          </h1>
        </div>

        {profileQuery.isLoading || isUnauthorized ? (
          <div className='h-[320px] animate-pulse rounded-[16px] bg-white/80' />
        ) : profileQuery.isError || !user ? (
          <div className='rounded-[16px] border border-[#E7B8B8] bg-white p-8 text-center'>
            <h2 className='text-lg font-extrabold text-[#8F2F2F]'>
              Không thể tải thông tin tài khoản
            </h2>
            <Button
              onClick={() => void profileQuery.refetch()}
              className='mx-auto mt-5 h-11! w-auto! rounded-full! px-6! text-sm!'>
              Thử lại
            </Button>
          </div>
        ) : (
          <div className='grid gap-5 lg:grid-cols-[260px_1fr] lg:items-start'>
            <AccountNavigation activeView={view} user={user} />
            {view === 'bookings' ? (
              <MyBookingsPanel />
            ) : (
              <ProfilePanel user={user} />
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
