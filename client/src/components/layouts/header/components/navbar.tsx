'use client';
import { Button } from '@/components/core';
import Image from 'next/image';
import { TNavbarProps } from '../types';
import Link from 'next/link';
import { MENUS } from '../contants';

export function Navbar(props: TNavbarProps) {
  const { onClickFind, isBookingBarVisible } = props;

  return (
    <div className='bg-[#0D4949]/90 text-white'>
      <div className='flex h-[120px] w-full items-center justify-between px-[60px]'>
        <div className='flex items-center gap-8'>
          <Image
            src='/images/logo/logo_2.png'
            alt='logo'
            width={108}
            height={120}
          />

          <div className='h-17 w-px bg-[#ffffff4d]'></div>

          <div>
            <h1 className='font-["Times_New_Roman"] text-[26px] opacity-70'>
              Laxsik Ecolodge
            </h1>

            <ul className='mt-2 flex gap-6 text-sm font-bold'>
              {MENUS.map((item) => (
                <li key={item.label} className='flex items-center gap-[6px]'>
                  <Link href={item.href}>{item.label}</Link>{' '}
                  <Image
                    src='/images/chevron_down.png'
                    alt='down'
                    width={12}
                    height={6}
                    className='h-[6px] w-[12px]'
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='mr-[40px] flex items-center gap-2'>
          {!isBookingBarVisible && (
            <Button
              className='ml-[36px] h-[48px] w-[148px]! bg-white text-lg! text-[#0D4949]!'
              onClick={onClickFind}>
              Book Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
