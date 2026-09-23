'use client';

import { DetailRoomModule } from '@/modules/rooms/detail';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

export default function RoomDetailPage() {
  const t = useTranslations('Rooms.detail');

  return (
    <Suspense fallback={<div className='p-10 text-center'>{t('loading')}</div>}>
      <DetailRoomModule />
    </Suspense>
  );
}
