import { RoomListModule } from '@/modules/rooms/list';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

export default async function RoomPage() {
  const t = await getTranslations('Common');
  return (
    <Suspense
      fallback={<div className='p-10 text-center'>{t('loadingRooms')}</div>}>
      <RoomListModule />
    </Suspense>
  );
}
