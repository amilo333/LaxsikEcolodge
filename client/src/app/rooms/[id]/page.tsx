'use client';

import { useParams } from 'next/navigation';
import { DetailRoomModule } from '@/modules/rooms/detail';
import { useRoomDetailApi } from '@/modules/rooms/common/hooks';

export default function RoomDetailPage() {
  const params = useParams<{ id: string }>();

  const id = params.id;

  const { data, isLoading, isError } = useRoomDetailApi(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Failed to load room</div>;
  }

  if (!data) {
    return <div>Room not found</div>;
  }

  return <DetailRoomModule room={data} />;
}
