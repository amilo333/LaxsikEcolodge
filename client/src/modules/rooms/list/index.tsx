'use client';
import { Footer, Header } from '@/components/layouts';
import { Facilities, Policies } from '../common';
import { RoomItem } from '../common/components/room-item';
import { useRoomListApi } from '../common/hooks';

export function RoomListModule() {
  const { data } = useRoomListApi();

  return (
    <div>
      <Header />
      <div className='my-15 flex flex-col items-center justify-center gap-10'>
        {data?.data &&
          data.data.map((room) => {
            return <RoomItem key={room._id} room={room} />;
          })}
      </div>
      <Facilities />
      <Policies />
      <Footer />
    </div>
  );
}
