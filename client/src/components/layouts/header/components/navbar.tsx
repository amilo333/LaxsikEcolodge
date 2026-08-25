'use client';
import { Button } from '@/components/core';
import Image from 'next/image';
import { TNavbarProps } from '../types';
import Link from 'next/link';
import { MENUS } from '../contants';
import { AccountMenu } from './account-menu';

export function Navbar(props: TNavbarProps) {
  const { onClickFind, isBookingBarVisible } = props;

  return (
    <div className="relative isolate bg-[url('/images/banner/bg_header.png')] bg-cover bg-center text-white">
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-10 bg-[#0D4949]/82'
      />
      <div className='mx-auto flex h-[88px] w-full max-w-[1600px] items-center justify-between gap-3 px-4 sm:h-[104px] sm:gap-5 sm:px-6 xl:px-12 2xl:px-[60px]'>
        <div className='flex min-w-0 items-center gap-6'>
          <Image
            src='/images/logo/logo_2.png'
            alt='Laxsik Ecolodge'
            width={111}
            height={68}
            priority
            className='h-14 w-auto shrink-0 sm:h-16 xl:h-[68px]'
          />

          <div className='hidden h-11 w-px bg-white/25 xl:block'></div>

          <div className='hidden xl:block'>
            <p className='font-[family-name:var(--font-lora)] text-[21px] leading-none font-medium text-white/80 2xl:text-[22px]'>
              Laxsik Ecolodge
            </p>

            <ul className='mt-[14px] flex items-center gap-4 text-[11px] leading-none font-bold tracking-[0.025em] text-white/90 2xl:gap-5 2xl:text-xs'>
              {MENUS.map((item) => (
                <li
                  key={item.label}
                  className='flex items-center gap-1.5 whitespace-nowrap'>
                  <Link
                    href={item.href}
                    className='transition hover:text-white'>
                    {item.label}
                  </Link>
                  <Image
                    src='/images/chevron_down.png'
                    alt=''
                    width={9}
                    height={5}
                    className='h-[5px] w-[9px] opacity-45'
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='flex shrink-0 items-center gap-2 sm:gap-2.5'>
          {!isBookingBarVisible && (
            <Button
              className='hidden h-10! w-[116px]! bg-white! text-[13px]! text-[#0D4949]! shadow-none! lg:flex'
              onClick={onClickFind}>
              Book Now
            </Button>
          )}
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
