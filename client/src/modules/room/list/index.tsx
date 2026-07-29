import React from 'react';
import { ROOMS } from '../constants/rooms';
import { RoomItem } from '../components/room-item';

export function RoomListModule() {
  return (
    <div className='my-15 flex flex-col items-center justify-center gap-10'>
      {ROOMS.map((room) => {
        return <RoomItem key={room.id} room={room} />;
      })}
    </div>
  );
}
