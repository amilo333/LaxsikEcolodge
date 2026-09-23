'use client';

import { LoginForm } from './components';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function LoginModule() {
  const t = useTranslations('Auth.login');

  return (
    <div className='max-h-[calc(100dvh-32px)] w-full max-w-[500px] overflow-y-auto rounded-[28px] border border-white/60 bg-white/94 p-5 shadow-[0_28px_90px_rgba(3,35,34,0.35)] backdrop-blur-xl sm:max-h-[calc(100dvh-48px)] sm:p-7 lg:p-7 [@media(max-height:720px)]:p-4'>
      <div className='mb-5 flex items-center justify-between lg:hidden [@media(max-height:720px)]:hidden'>
        <Link href='/' aria-label={t('backHome')}>
          <Image
            src='/images/logo/logo_1.png'
            alt='Laxsik Ecolodge'
            width={138}
            height={70}
            className='h-auto w-[108px] sm:w-[116px]'
          />
        </Link>
        <span className='rounded-full bg-[#EAF1EF] px-3 py-1.5 text-[10px] font-bold text-[#0D4949] uppercase'>
          {t('welcomeBack')}
        </span>
      </div>

      <p className='text-[11px] font-bold text-[#0D4949]/60 uppercase'>
        {t('eyebrow')}
      </p>
      <h2 className='mt-1.5 text-[30px] leading-tight font-bold text-[#153F3D] sm:text-[34px]'>
        {t('welcomeBack')}
      </h2>
      <p className='mt-2 mb-5 max-w-[420px] text-[13px] leading-5 text-[#61706C] sm:text-sm [@media(max-height:720px)]:mb-4'>
        {t('description')}
      </p>

      <LoginForm />
    </div>
  );
}
