import { RoomListModule } from '@/modules/rooms/list';
import { Suspense } from 'react';

export default function RoomPage() {
  return (
    <Suspense fallback={<div className='p-10 text-center'>Loading rooms…</div>}>
      <RoomListModule />
    </Suspense>
  );
}
