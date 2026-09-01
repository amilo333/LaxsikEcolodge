import Image from 'next/image';
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
  { value: 'tours', label: 'Tour', description: 'Hành trình trải nghiệm' },
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
  tours: (
    <svg
      viewBox='0 0 24 24'
      className='h-5 w-5 fill-none stroke-current stroke-2'>
      <path d='M4 20 9.5 9l3.5 7 2.5-5L20 20H4Z' />
      <path d='m6.5 14.8 3-2.3 3.5 3.5 2.5-2 2.2 2.2M17 4h4v4' />
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
    <aside className='border-b border-white/10 bg-[#093C3C] px-3 py-4 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-[258px] lg:border-r lg:border-b-0 lg:px-4 lg:py-5'>
      <Link
        href='/admin'
        className='mb-8 hidden items-center gap-3 px-3 lg:flex'>
        <Image
          src='/images/logo/logo_2.png'
          alt='Laxsik Ecolodge'
          width={44}
          height={44}
          priority
          className='size-11 shrink-0 object-contain'
        />

        <span>
          <span className='block font-[family-name:var(--font-lora)] text-base font-semibold'>
            Laxsik Ecolodge
          </span>
          <span className='block text-[9px] font-bold text-white/55 uppercase'>
            Admin Dashboard
          </span>
        </span>
      </Link>

      <nav className='flex gap-[8px]! overflow-x-auto lg:mt-5 lg:flex-col lg:gap-1 lg:overflow-visible'>
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
              className={`flex shrink-0 items-center gap-3 rounded-[14px] px-4 py-3 transition lg:w-full lg:gap-2.5 lg:rounded-xl lg:px-3 lg:py-2.5 ${
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
