'use client';

import { SlideRoom } from '@/modules/rooms/common/components';
import { Suspense } from 'react';
import { SectionHeading } from './section-heading';
import { useTranslations } from 'next-intl';

export function RoomsShowcase() {
  const t = useTranslations('Home.rooms');
  return (
    <section className='bg-white py-16 lg:py-24'>
      <div className='px-4 sm:px-6'>
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
        />
      </div>

      <div className='mt-8 w-full'>
        <Suspense
          fallback={
            <div className='flex min-h-[520px] items-center justify-center text-sm text-[#60746F]'>
              {t('loading')}
            </div>
          }>
          <SlideRoom currentRoomId='' title='' />
        </Suspense>
      </div>
    </section>
  );
}
