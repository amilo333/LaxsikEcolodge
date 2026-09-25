'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export function BannerSpa() {
  const t = useTranslations('Spa.banner');
  return (
    <section className='relative mb-20 w-full sm:mb-24 lg:mb-28'>
      <div className='relative h-[320px] overflow-hidden sm:h-[420px] lg:h-[500px]'>
        <Image
          src='/images/banner/banner-spa.png'
          alt={t('imageAlt')}
          fill
          className='object-cover'
          sizes='100vw'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-[#092F2E]/60 via-transparent to-transparent' />
      </div>
      <div className='relative z-10 mx-auto -mt-12 flex w-[calc(100%-32px)] max-w-5xl flex-col gap-3 rounded-[24px] bg-white px-5 py-8 text-center shadow-[0_22px_70px_rgba(13,73,73,0.14)] sm:-mt-16 sm:px-10 sm:py-10'>
        <h1 className='font-lora text-3xl font-semibold text-[#0D4949] sm:text-4xl lg:text-[56px]'>
          {t('title')}
        </h1>
        <p className='font-montserrat mx-auto max-w-3xl text-sm leading-7 text-[#4E5D59] sm:text-base lg:text-[18px]'>
          {t('description')}
        </p>
      </div>
    </section>
  );
}
