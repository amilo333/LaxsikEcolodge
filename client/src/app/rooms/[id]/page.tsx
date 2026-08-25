'use client';

import { DetailRoomModule } from '@/modules/rooms/detail';
import { Suspense } from 'react';

export default function RoomDetailPage() {
  return (
    <Suspense fallback={<div className='p-10 text-center'>Loading room…</div>}>
      <DetailRoomModule />
    </Suspense>
  );
}
