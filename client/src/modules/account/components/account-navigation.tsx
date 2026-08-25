import { TUser } from '@/modules/auth/common';
import Link from 'next/link';

type TAccountNavigationProps = {
  activeView: 'bookings' | 'profile';
  user: TUser;
};

const NAV_ITEMS = [
  {
    value: 'bookings' as const,
    label: 'Phòng đã đặt',
    href: '/account/bookings',
    icon: (
      <svg
        viewBox='0 0 24 24'
        aria-hidden='true'
        className='h-5 w-5 fill-none stroke-current stroke-2'>
        <path d='M4 5h16v15H4zM8 3v4m8-4v4M4 10h16' />
      </svg>
    ),
  },
  {
    value: 'profile' as const,
    label: 'Thông tin cá nhân',
    href: '/account/profile',
    icon: (
      <svg
        viewBox='0 0 24 24'
        aria-hidden='true'
        className='h-5 w-5 fill-none stroke-current stroke-2'>
        <circle cx='12' cy='8' r='4' />
        <path d='M4.5 21a7.5 7.5 0 0 1 15 0' />
      </svg>
    ),
  },
];

export function AccountNavigation({
  activeView,
  user,
}: TAccountNavigationProps) {
  return (
    <aside className='rounded-[16px] border border-[#DCE7E3] bg-white p-3 shadow-[0_16px_45px_rgba(13,73,73,0.08)] lg:sticky lg:top-6 lg:self-start'>
      <div className='hidden border-b border-[#E5ECEA] px-3 pt-2 pb-5 lg:block'>
        <span className='flex h-12 w-12 items-center justify-center rounded-full bg-[#0D4949] text-sm font-extrabold text-white'>
          {user.full_name.trim().charAt(0).toUpperCase() || 'U'}
        </span>
        <p className='mt-3 truncate text-sm font-extrabold text-[#193D3B]'>
          {user.full_name}
        </p>
        <p className='mt-1 truncate text-[11px] text-[#73807C]'>{user.email}</p>
      </div>

      <nav className='flex gap-2 overflow-x-auto lg:mt-3 lg:flex-col'>
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.value;

          return (
            <Link
              key={item.value}
              href={item.href}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                isActive
                  ? 'bg-[#0D4949] text-white'
                  : 'text-[#526460] hover:bg-[#EEF5F3] hover:text-[#0D4949]'
              }`}>
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
