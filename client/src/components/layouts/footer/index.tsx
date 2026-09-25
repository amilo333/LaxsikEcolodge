'use client';

import Image from 'next/image';
import { FOOTER_DATA } from './constant';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');
  const { logo, title, hotline, email, socials } = FOOTER_DATA;
  const [primaryEmail, secondaryEmail] = email.split(' or ');
  const menus = ['careers', 'partner', 'privacy', 'terms'] as const;

  return (
    <footer>
      <Image
        src='/images/mask.png'
        height={200}
        width={1920}
        alt='mask'
        className='height-[250px]! w-full object-fill'
      />

      <div className='flex flex-col items-center bg-white px-4 py-8 sm:py-10'>
        <Image
          src={logo}
          alt={title}
          width={120}
          height={90}
          className='h-auto w-[180px] object-contain sm:w-[220px]'
        />

        <p className='mt-4 text-center text-[17px] font-semibold'>
          {t('address')}
        </p>

        <div className='flex flex-col items-center'>
          <p className='mt-3 text-[17px]'>
            {t('hotline')}: {hotline}
          </p>

          <p className='mt-1 text-center text-[17px]'>
            Email: {primaryEmail} {t('emailOr')} {secondaryEmail}
          </p>
        </div>

        <div className='mt-5 flex items-center gap-3'>
          {socials.map((social) => (
            <a
              key={social.alt}
              href={social.href}
              target='_blank'
              rel='noopener noreferrer'>
              <Image
                src={social.icon}
                alt={social.alt}
                width={48}
                height={48}
                className='h-12 w-12'
              />
            </a>
          ))}
        </div>

        <div className='mt-9 flex flex-wrap justify-center gap-x-6 gap-y-4 text-center text-sm font-semibold uppercase sm:gap-10 sm:text-[16px]'>
          {menus.map((menu) => (
            <div key={menu}>{t(`menus.${menu}`)}</div>
          ))}
        </div>
      </div>

      <div className='bg-[#0D4949] px-4 py-3 text-center text-sm text-white sm:text-[16px]'>
        {t('copyright')}
      </div>
    </footer>
  );
}
