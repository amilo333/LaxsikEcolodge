import { TAdminSection } from '../common';
import Link from 'next/link';

type TAdminSidebarProps = {
  activeSection: TAdminSection;
};

const NAV_ITEMS: Array<{
  value: TAdminSection;
  label: string;
  description: string;
}> = [
  { value: 'overview', label: 'Tổng quan', description: 'Dashboard' },
  { value: 'users', label: 'Người dùng', description: 'Tài khoản & quyền' },
  { value: 'rooms', label: 'Phòng', description: 'Kho phòng' },
  { value: 'bookings', label: 'Booking', description: 'Đơn đặt phòng' },
  { value: 'vouchers', label: 'Voucher', description: 'Mã ưu đãi' },
  { value: 'dining', label: 'Dining', description: 'Nhà hàng & dịch vụ' },
  { value: 'spa', label: 'Spa', description: 'Spa & massage' },
];

const SECTION_ICONS: Record<TAdminSection, React.ReactNode> = {
  overview: (
    <svg
      viewBox='0 0 24 24'
      className='h-5 w-5 fill-none stroke-current stroke-2'>
      <rect x='3' y='3' width='7' height='7' rx='1' />
      <rect x='14' y='3' width='7' height='7' rx='1' />
      <rect x='3' y='14' width='7' height='7' rx='1' />
      <rect x='14' y='14' width='7' height='7' rx='1' />
    </svg>
  ),
  users: (
    <svg
      viewBox='0 0 24 24'
      className='h-5 w-5 fill-none stroke-current stroke-2'>
      <circle cx='9' cy='8' r='4' />
      <path d='M2.5 21a6.5 6.5 0 0 1 13 0M17 11a4 4 0 0 1 4.5 4' />
    </svg>
  ),
  rooms: (
    <svg
      viewBox='0 0 24 24'
      className='h-5 w-5 fill-none stroke-current stroke-2'>
      <path d='M3 20V8l9-5 9 5v12M3 20h18M8 20v-7h8v7' />
    </svg>
  ),
  bookings: (
    <svg
      viewBox='0 0 24 24'
      className='h-5 w-5 fill-none stroke-current stroke-2'>
      <rect x='3' y='5' width='18' height='16' rx='2' />
      <path d='M8 3v4m8-4v4M3 10h18' />
    </svg>
  ),
  vouchers: (
    <svg
      viewBox='0 0 24 24'
      className='h-5 w-5 fill-none stroke-current stroke-2'>
      <path d='M4 5h16v4a3 3 0 0 0 0 6v4H4v-4a3 3 0 0 0 0-6V5Z' />
      <path d='M12 7v2m0 2v2m0 2v2' />
    </svg>
  ),
  dining: (
    <svg
      viewBox='0 0 24 24'
      className='h-5 w-5 fill-none stroke-current stroke-2'>
      <path d='M7 3v8m-3-8v5a3 3 0 0 0 6 0V3m-3 8v10M16 3v18m0-18c3 1 4 4 4 7h-4' />
    </svg>
  ),
  spa: (
    <svg
      viewBox='0 0 24 24'
      className='h-5 w-5 fill-none stroke-current stroke-2'>
      <path d='M12 21c-4.5-2-7-5.1-7-9 3.1 0 5.3 1.2 7 3.4C13.7 13.2 15.9 12 19 12c0 3.9-2.5 7-7 9Z' />
      <path d='M12 15.4C9.7 12.8 9.7 8.6 12 5c2.3 3.6 2.3 7.8 0 10.4Z' />
    </svg>
  ),
};

export function AdminSidebar({ activeSection }: TAdminSidebarProps) {
  return (
    <aside className='border-b border-white/10 bg-[#093C3C] px-3 py-4 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-[258px] lg:border-r lg:border-b-0 lg:px-4 lg:py-6'>
      <Link href='/admin' className='hidden items-center gap-3 px-3 lg:flex'>
        <span className='flex h-11 w-11 items-center justify-center rounded-[14px] bg-white text-sm font-black text-[#0D4949]'>
          LA
        </span>
        <span>
          <span className='block font-[family-name:var(--font-lora)] text-lg font-semibold'>
            Laxsik
          </span>
          <span className='block text-[9px] font-bold text-white/55 uppercase'>
            Admin Console
          </span>
        </span>
      </Link>

      <nav className='flex gap-2 overflow-x-auto lg:mt-8 lg:max-h-[calc(100vh-190px)] lg:flex-col lg:overflow-y-auto lg:pr-1'>
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.value;

          return (
            <Link
              key={item.value}
              href={
                item.value === 'overview'
                  ? '/admin'
                  : `/admin?section=${item.value}`
              }
              className={`flex shrink-0 items-center gap-3 rounded-[14px] px-4 py-3 transition lg:w-full ${
                isActive
                  ? 'bg-white text-[#0D4949] shadow-[0_10px_28px_rgba(0,0,0,0.14)]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}>
              {SECTION_ICONS[item.value]}
              <span>
                <span className='block text-xs font-extrabold lg:text-sm'>
                  {item.label}
                </span>
                <span
                  className={`mt-0.5 hidden text-[9px] lg:block ${
                    isActive ? 'text-[#67807B]' : 'text-white/40'
                  }`}>
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
