import React from 'react';
import { ROOMS } from '../common/constants/rooms';
import { RoomItem } from '../common/components/room-item';
import { Footer, Header } from '@/components/layouts';
import { Facilities, Policies } from '../common';

export function RoomListModule() {
  return (
    <div>
      <Header />
      <div className='my-15 flex flex-col items-center justify-center gap-10'>
        {ROOMS.map((room) => {
          return <RoomItem key={room.id} room={room} />;
        })}
      </div>
      <Facilities />
      <Policies />
      <Footer />
    </div>
  );
}
