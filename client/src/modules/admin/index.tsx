'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useLogoutApi, useProfileApi } from '@/modules/auth/common';
import type { TAdminSection } from './common';
import {
  AdminOverview,
  AdminSidebar,
  BookingsManagement,
  ExperienceManagement,
  RoomsManagement,
  UsersManagement,
  VouchersManagement,
} from './components';

const SECTIONS: TAdminSection[] = [
  'overview',
  'users',
  'rooms',
  'bookings',
  'vouchers',
  'dining',
  'spa',
];

const TITLES: Record<TAdminSection, string> = {
  overview: 'Tổng quan hệ thống',
  users: 'Quản lý người dùng',
  rooms: 'Quản lý phòng',
  bookings: 'Quản lý booking',
  vouchers: 'Quản lý voucher',
  dining: 'Quản lý Dining',
  spa: 'Quản lý Spa & Massage',
};

const getInitials = (fullName: string) =>
  fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

function ExternalLinkIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className='h-3.5 w-3.5 fill-none stroke-current stroke-2'>
      <path d='M14 3h7v7M10 14 21 3' />
      <path d='M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5' />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className='h-4 w-4 fill-none stroke-current stroke-2'>
      <path d='M14 8V5a2 2 0 0 0-2-2H5v18h7a2 2 0 0 0 2-2v-3' />
      <path d='M10 12h11m0 0-4-4m4 4-4 4' />
    </svg>
  );
}

function LoadingIcon({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden='true'
      className={`inline-block rounded-full border-2 border-current border-r-transparent ${className}`}
    />
  );
}

export default function AdminModule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileQuery = useProfileApi();
  const logout = useLogoutApi();
  const requestedSection = searchParams.get('section');
  const activeSection: TAdminSection = SECTIONS.includes(
    requestedSection as TAdminSection
  )
    ? (requestedSection as TAdminSection)
    : 'overview';

  useEffect(() => {
    if (profileQuery.isError) {
      router.replace('/auth/login?redirect=%2Fadmin');
      return;
    }

    if (profileQuery.data && profileQuery.data.role !== 'admin') {
      router.replace('/home');
    }
  }, [profileQuery.data, profileQuery.isError, router]);

  if (profileQuery.isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#F2F6F4]'>
        <div className='text-center text-[#0D4949]'>
          <LoadingIcon className='mx-auto h-8 w-8 animate-spin' />
          <p className='mt-3 text-xs font-bold uppercase'>Đang mở dashboard</p>
        </div>
      </div>
    );
  }

  const user = profileQuery.data;

  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.replace('/auth/login');
        router.refresh();
      },
    });
  };

  const content = {
    overview: <AdminOverview />,
    users: <UsersManagement currentUser={user} />,
    rooms: <RoomsManagement />,
    bookings: <BookingsManagement />,
    vouchers: <VouchersManagement />,
    dining: <ExperienceManagement kind='dining' />,
    spa: <ExperienceManagement kind='spa' />,
  }[activeSection];

  return (
    <div className='min-h-screen bg-[#F2F6F4] text-[#173C3A]'>
      <AdminSidebar activeSection={activeSection} />

      <div className='lg:pl-[258px]'>
        <header className='sticky top-0 z-20 border-b border-[#DCE6E2] bg-white/90 backdrop-blur-xl'>
          <div className='flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-9'>
            <div className='min-w-0'>
              <p className='text-[9px] font-extrabold text-[#7B8B86] uppercase'>
                Admin Dashboard
              </p>
              <h1 className='mt-1 truncate font-[family-name:var(--font-lora)] text-lg font-bold text-[#0D4949] sm:text-xl'>
                {TITLES[activeSection]}
              </h1>
            </div>

            <div className='flex shrink-0 items-center gap-2 sm:gap-3'>
              <Link
                href='/home'
                className='hidden h-10 items-center gap-2 rounded-full border border-[#D7E2DE] px-4 text-xs font-bold text-[#0D4949] transition hover:bg-[#EDF4F1] sm:inline-flex'>
                Xem website
                <ExternalLinkIcon />
              </Link>

              <div className='flex h-11 items-center gap-2 rounded-full bg-[#EDF4F1] py-1 pr-2.5 pl-1 sm:pr-4'>
                <span className='flex h-9 w-9 items-center justify-center rounded-full bg-[#0D4949] text-[10px] font-black text-white'>
                  {getInitials(user.full_name) || 'AD'}
                </span>
                <span className='hidden max-w-32 truncate text-xs font-extrabold sm:block'>
                  {user.full_name}
                </span>
              </div>

              <button
                type='button'
                onClick={handleLogout}
                disabled={logout.isPending}
                aria-label='Đăng xuất'
                title='Đăng xuất'
                className='flex h-10 w-10 items-center justify-center rounded-full border border-[#E6DCDC] text-[#A64949] transition hover:bg-[#FFF0F0] disabled:cursor-wait disabled:opacity-50'>
                {logout.isPending ? (
                  <LoadingIcon className='h-4 w-4 animate-spin' />
                ) : (
                  <LogoutIcon />
                )}
              </button>
            </div>
          </div>
        </header>

        <main className='px-4 py-6 sm:px-7 sm:py-8 lg:px-9 lg:py-9'>
          <div className='mx-auto max-w-[1480px]'>{content}</div>
        </main>
      </div>
    </div>
  );
}
