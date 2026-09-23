'use client';

import { useTranslations } from 'next-intl';

export function IntroductionSection() {
  const t = useTranslations('Home.introduction');
  return (
    <section className='px-4 py-16 sm:px-6 lg:py-24'>
      <div className='mx-auto max-w-5xl rounded-[16px] bg-[#EAF0EE] px-6 py-12 text-center sm:px-12 lg:px-20 lg:py-16'>
        <p className='font-lora text-xl font-semibold text-[#0D5653] uppercase sm:text-2xl'>
          {t('title')}
        </p>
        <p className='mx-auto mt-5 max-w-3xl text-sm leading-7 text-[#536965] sm:text-base'>
          {t('description')}
        </p>
      </div>
    </section>
  );
}
