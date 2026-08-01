'use client';
import Image from 'next/image';
import { Button } from '@/components/core';
import { TRoom } from '../types/room-type';
import { useRouter } from 'next/navigation';

type TRoomItemProps = {
  room: TRoom;
};

export function RoomItem(props: TRoomItemProps) {
  const { room } = props;

  const router = useRouter();

  const handleBookRoom = () => {
    router.push(`/room/${room.id}`);
  };

  return (
    <div className='flex h-[482px] w-[1300px] items-center bg-white'>
      <Image
        height={400}
        width={600}
        src={room.image}
        alt={room.title}
        className='w-1/2'
      />

      <div className='flex w-1/2 flex-col gap-6 py-9 pr-9 pl-14'>
        <div className='flex items-center gap-2 text-[22px] font-semibold text-[#0D4949] uppercase'>
          {room.title}
          <Image
            height={30}
            width={30}
            src='/images/icon/ic_arrow.png'
            alt='arrow'
          />
        </div>

        <div className='flex flex-col gap-7'>
          <div>{room.description}</div>

          <div className='flex items-center gap-2'>
            <Image
              height={20}
              width={20}
              src='/images/icon/ic-bed.png'
              alt='bed'
              className='h-5 w-5'
            />
            <div>{room.bed}</div>
          </div>

          <div className='flex items-center gap-2'>
            <Image
              height={20}
              width={20}
              src='/images/icon/ic-home.png'
              alt='area'
              className='h-5 w-5'
            />
            <div>{room.area} m²</div>
          </div>

          <div className='flex items-center gap-2'>
            <Image
              height={20}
              width={20}
              src='/images/icon/ic-group.png'
              alt='capacity'
              className='h-5 w-5'
            />
            <div>{room.capacity}</div>
          </div>
        </div>

        <hr className='border-primary/20' />

        <div className='flex items-center justify-between'>
          <div>
            <div>Avg. price per night</div>
            <div className='text-2xl font-bold'>$ {room.price}.00</div>
          </div>

          <Button onClick={handleBookRoom}>BOOK NOW</Button>
        </div>
      </div>
    </div>
  );
}
