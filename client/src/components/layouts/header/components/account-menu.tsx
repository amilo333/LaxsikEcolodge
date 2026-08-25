'use client';

import { useLogoutApi, useProfileApi } from '@/modules/auth/common';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const getInitials = (fullName: string) =>
  fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

function GuestActions() {
  const pathname = usePathname();
  const redirect =
    pathname === '/' ? '' : `?redirect=${encodeURIComponent(pathname)}`;

  return (
    <div className='flex shrink-0 items-center gap-1.5 sm:gap-2'>
      <Link
        href={`/auth/login${redirect}`}
        className='inline-flex h-9 items-center gap-1.5 rounded-full bg-[#DDF2FF] px-3 text-[11px] font-bold text-[#075A93] transition hover:bg-[#C9EAFF] sm:h-10 sm:px-4 sm:text-xs'>
        <span>Đăng nhập</span>
        <svg
          viewBox='0 0 24 24'
          aria-hidden='true'
          className='h-3.5 w-3.5 fill-none stroke-current stroke-2 sm:h-4 sm:w-4'>
          <path d='M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2' />
          <path d='M15 12H3m0 0 4-4m-4 4 4 4' />
        </svg>
      </Link>
      <Link
        href={`/auth/register${redirect}`}
        className='inline-flex h-9 items-center rounded-full bg-[#159DE5] px-3 text-[11px] font-bold text-white shadow-[0_7px_18px_rgba(21,157,229,0.22)] transition hover:bg-[#0D8DD1] sm:h-10 sm:px-4 sm:text-xs'>
        Đăng ký
      </Link>
    </div>
  );
}

export function AccountMenu() {
  const router = useRouter();
  const profileQuery = useProfileApi();
  const logout = useLogoutApi();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  if (profileQuery.isLoading) {
    return (
      <div
        className='h-10 w-[136px] animate-pulse rounded-full bg-white/15'
        aria-label='Loading account'
      />
    );
  }

  const user = profileQuery.data;

  if (!user) {
    return <GuestActions />;
  }

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setIsOpen(false);
        router.push('/');
        router.refresh();
      },
    });
  };

  return (
    <div ref={menuRef} className='relative shrink-0'>
      <button
        type='button'
        aria-haspopup='menu'
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className='flex h-10 items-center gap-2 rounded-full border border-white/25 bg-white/10 py-1 pr-3 pl-1 text-left transition hover:bg-white/18 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none'>
        <span className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-[11px] font-extrabold text-[#0D4949]'>
          {getInitials(user.full_name) || 'U'}
        </span>
        <span className='hidden max-w-[125px] truncate text-[11px] font-bold lg:block'>
          {user.full_name}
        </span>
        <svg
          viewBox='0 0 20 20'
          aria-hidden='true'
          className={`h-3.5 w-3.5 fill-none stroke-current stroke-2 transition ${
            isOpen ? 'rotate-180' : ''
          }`}>
          <path d='m5 7.5 5 5 5-5' />
        </svg>
      </button>

      {isOpen && (
        <div
          role='menu'
          className='absolute top-[calc(100%+10px)] right-0 z-50 w-[280px] overflow-hidden rounded-[16px] border border-[#DCE7E3] bg-white text-[#193D3B] shadow-[0_24px_70px_rgba(3,35,34,0.22)]'>
          <div className='border-b border-[#E4ECE9] bg-[#F3F7F6] px-5 py-4'>
            <p className='truncate text-sm font-extrabold'>{user.full_name}</p>
            <p className='mt-1 truncate text-[11px] text-[#6C7A76]'>
              {user.email}
            </p>
          </div>

          <div className='p-2'>
            <Link
              role='menuitem'
              href='/account/bookings'
              onClick={() => setIsOpen(false)}
              className='flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition hover:bg-[#EEF5F3]'>
              <svg
                viewBox='0 0 24 24'
                aria-hidden='true'
                className='h-5 w-5 fill-none stroke-[#0D4949] stroke-2'>
                <path d='M4 5h16v15H4zM8 3v4m8-4v4M4 10h16' />
              </svg>
              Phòng đã đặt
            </Link>
            <Link
              role='menuitem'
              href='/account/profile'
              onClick={() => setIsOpen(false)}
              className='flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition hover:bg-[#EEF5F3]'>
              <svg
                viewBox='0 0 24 24'
                aria-hidden='true'
                className='h-5 w-5 fill-none stroke-[#0D4949] stroke-2'>
                <circle cx='12' cy='8' r='4' />
                <path d='M4.5 21a7.5 7.5 0 0 1 15 0' />
              </svg>
              Thông tin cá nhân
            </Link>
          </div>

          <div className='border-t border-[#E4ECE9] p-2'>
            <button
              role='menuitem'
              type='button'
              disabled={logout.isPending}
              onClick={handleLogout}
              className='flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-[#B33939] transition hover:bg-[#FFF0F0] disabled:cursor-wait disabled:opacity-60'>
              <svg
                viewBox='0 0 24 24'
                aria-hidden='true'
                className='h-5 w-5 fill-none stroke-current stroke-2'>
                <path d='M14 8V5a2 2 0 0 0-2-2H5v18h7a2 2 0 0 0 2-2v-3' />
                <path d='M10 12h11m0 0-4-4m4 4-4 4' />
              </svg>
              {logout.isPending ? 'Đang đăng xuất…' : 'Đăng xuất'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
