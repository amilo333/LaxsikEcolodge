'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export function BannerSpa() {
  const t = useTranslations('Spa.banner');
  return (
    <div className='relative mb-50 h-[500px] w-full'>
      <Image
        src='/images/banner/banner-spa.png'
        alt={t('imageAlt')}
        fill
        className='object-cover'
        sizes='100vw'
      />
      <div className='absolute top-106.5 left-0 flex w-full flex-col items-center justify-center gap-4 text-center'>
        <Image
          src='/images/maskfix.png'
          height={200}
          width={1920}
          alt='mask'
          className='height-[250px]! w-full object-fill'
        />
      </div>
      <div className='flex flex-col gap-4 px-37.5 pt-125'>
        <div className='font-lora mt-5 text-center text-[56px] font-semibold text-[#0D4949]'>
          {t('title')}
        </div>
        <div className='font-montserrat text-center text-[18px] text-[#333333]'>
          {t('description')}
        </div>
      </div>
    </div>
  );
}
