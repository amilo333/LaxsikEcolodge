'use client';

import Link from 'next/link';
import type { TContactCtaProps } from './type';
import { useTranslations } from 'next-intl';

export function ContactCta(props: TContactCtaProps) {
  const t = useTranslations('ContactCta');
  const {
    title = t('title'),
    phone = '+84 214 3892 999',
    phoneLabel = t('call'),
    contactLabel = t('contact'),
    phoneHref = 'tel:+842143892999',
    contactHref = '/contact',
    className = '',
  } = props;

  return (
    <section
      className={`mx-auto my-16 flex w-[calc(100%-32px)] max-w-[1280px] items-center rounded-[28px] border border-white/10 bg-[#0D4949] px-5 py-7 text-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] sm:my-20 sm:px-7 lg:my-30 lg:w-[80%] lg:rounded-full lg:px-9 ${className}`}>
      <div className='flex w-full flex-col items-stretch justify-around gap-5 text-center lg:flex-row lg:items-center lg:gap-8 lg:text-left'>
        <div className='text-base leading-[1.6] sm:text-[20px]'>{title}</div>

        <div className='flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:gap-4'>
          <a
            href={phoneHref}
            className='font-Montserrat inline-flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white uppercase transition hover:bg-white/20 sm:text-base lg:min-w-[305px]'>
            {phoneLabel} {phone}
          </a>

          <Link
            href={contactHref}
            className='font-Montserrat inline-flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-full border border-white bg-white px-6 py-3 text-sm font-semibold text-[#0D4949] uppercase transition hover:bg-[#F5F5F5] sm:text-base lg:min-w-[172px]'>
            {contactLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
