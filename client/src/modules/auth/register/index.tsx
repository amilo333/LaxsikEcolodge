'use client';

import { RegisterForm } from './components';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function RegisterModule() {
  const t = useTranslations('Auth.register');

  return (
    <div className='w-full max-w-[580px] rounded-[32px] border border-white/60 bg-white/94 p-6 shadow-[0_28px_90px_rgba(3,35,34,0.35)] backdrop-blur-xl sm:p-8 lg:p-9'>
      <div className='mb-5 flex items-center justify-between lg:hidden'>
        <Link href='/' aria-label={t('backHome')}>
          <Image
            src='/images/logo/logo_1.png'
            alt='Laxsik Ecolodge'
            width={138}
            height={70}
            className='h-auto w-[124px]'
          />
        </Link>
        <span className='rounded-full bg-[#EAF1EF] px-3 py-1.5 text-[10px] font-bold text-[#0D4949] uppercase'>
          {t('join')}
        </span>
      </div>

      <p className='text-[11px] font-bold text-[#0D4949]/60 uppercase'>
        {t('eyebrow')}
      </p>
      <h2 className='mt-1.5 text-3xl font-bold text-[#153F3D] sm:text-[36px]'>
        {t('title')}
      </h2>
      <p className='mt-2 mb-6 max-w-[470px] text-sm leading-6 text-[#61706C]'>
        {t('description')}
      </p>

      <RegisterForm />
    </div>
  );
}
