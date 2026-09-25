'use client';
import { Button } from '@/components/core';
import Image from 'next/image';
import { TNavbarProps } from '../types';
import Link from 'next/link';
import { MENUS } from '../contants';
import { AccountMenu } from './account-menu';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function Navbar(props: TNavbarProps) {
  const { onClickFind, isBookingBarVisible } = props;
  const t = useTranslations('Navigation');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative isolate bg-[url('/images/banner/bg_header.png')] bg-cover bg-center text-white">
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-10 bg-[#0D4949]/82'
      />
      <div className='mx-auto flex h-[88px] w-full max-w-[1600px] items-center justify-between gap-3 px-4 sm:h-[104px] sm:gap-5 sm:px-6 xl:px-12 2xl:px-[60px]'>
        <div className='flex min-w-0 items-center gap-6'>
          <Link
            href='/home'
            aria-label={t('overview')}
            className='shrink-0 rounded-md focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D4949] focus-visible:outline-none'>
            <Image
              src='/images/logo/logo_2.png'
              alt='Laxsik Ecolodge'
              width={111}
              height={68}
              priority
              className='h-14 w-auto sm:h-16 xl:h-[68px]'
            />
          </Link>

          <div className='hidden h-11 w-px bg-white/25 xl:block'></div>

          <div className='hidden xl:block'>
            <p className='font-[family-name:var(--font-lora)] text-[21px] leading-none font-medium text-white/80 2xl:text-[22px]'>
              Laxsik Ecolodge
            </p>

            <ul className='mt-[14px] flex items-center gap-4 text-[11px] leading-none font-bold text-white/90 2xl:gap-5 2xl:text-xs'>
              {MENUS.map((item) => (
                <li
                  key={item.label}
                  className='flex items-center gap-1.5 whitespace-nowrap'>
                  <Link
                    href={item.href}
                    className='transition hover:text-white'>
                    {t(item.label)}
                  </Link>
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
              {t('bookNow')}
            </Button>
          )}
          <AccountMenu />
          <button
            type='button'
            aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={isMenuOpen}
            aria-controls='mobile-navigation'
            onClick={() => setIsMenuOpen((current) => !current)}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 transition hover:bg-white/20 xl:hidden'>
            <span className='sr-only'>
              {isMenuOpen ? t('closeMenu') : t('openMenu')}
            </span>
            <span className='relative h-4 w-5' aria-hidden='true'>
              <span
                className={`absolute left-0 h-0.5 w-5 bg-white transition ${
                  isMenuOpen ? 'top-[7px] rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute top-[7px] left-0 h-0.5 w-5 bg-white transition ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-5 bg-white transition ${
                  isMenuOpen ? 'top-[7px] -rotate-45' : 'top-[14px]'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          id='mobile-navigation'
          className='absolute inset-x-0 top-full z-40 border-t border-white/15 bg-[#0D4949]/98 px-4 py-5 shadow-[0_20px_45px_rgba(1,35,34,0.3)] backdrop-blur-xl sm:px-6 xl:hidden'>
          <nav className='mx-auto max-w-[720px]' aria-label={t('openMenu')}>
            <ul className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
              {MENUS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className='flex min-h-11 items-center rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-bold text-white transition hover:bg-white/15'>
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
            {!isBookingBarVisible && (
              <Button
                className='mt-4 h-11! w-full! bg-white! text-sm! text-[#0D4949]! shadow-none! lg:hidden'
                onClick={() => {
                  setIsMenuOpen(false);
                  onClickFind();
                }}>
                {t('bookNow')}
              </Button>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
