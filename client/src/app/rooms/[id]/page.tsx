import { ROOMS } from '@/modules/rooms/common/constants/rooms';
import { DetailRoomModule } from '@/modules/rooms/detail';

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const room = ROOMS.find((room) => room.id === id);

  if (!room) return <div>Room not found</div>;

  return <DetailRoomModule room={room} />;
}
