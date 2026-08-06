'use client';
import { Footer, Header } from '@/components/layouts';
import { Facilities, Policies } from '../common';
import { RoomItem } from '../common/components/room-item';
import { ROOMS } from '../common/constants/rooms';
import { Pagination } from '@/components/core';

export function RoomListModule() {
  return (
    <div>
      <Header />
      <div className='my-15 flex flex-col items-center justify-center gap-10'>
        {ROOMS.map((room) => {
          return <RoomItem key={room.id} room={room} />;
        })}
      </div>
      <Pagination currentPage={1} totalPages={1} onChangePage={() => {}} />
      <Facilities />
      <Policies />
      <Footer />
    </div>
  );
}
