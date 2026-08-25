'use client';
import Image from 'next/image';
import { Button } from '@/components/core';
import { TRoom } from '../types/room-type';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/utils';

type TRoomItemProps = {
  room: TRoom;
  detailHref: string;
};

export function RoomItem(props: TRoomItemProps) {
  const { room, detailHref } = props;

  const router = useRouter();

  const handleViewRoom = () => router.push(detailHref);

  return (
    <div className='flex h-100 w-[75%] items-center rounded-2xl bg-white shadow-2xl'>
      <Link
        href={detailHref}
        aria-label={`View ${room.title}`}
        className='h-[99.5%] w-1/2 rounded-2xl'>
        <Image
          height={400}
          width={600}
          src={room.thumbnail}
          alt={room.title}
          className='h-full w-full rounded-2xl object-cover'
        />
      </Link>

      <div className='flex w-1/2 flex-col gap-6 py-9 pr-9 pl-14'>
        <Link
          href={detailHref}
          className='flex items-center gap-2 truncate text-[22px] font-semibold text-[#0D4949] uppercase'>
          {room.title}
          <Image
            height={30}
            width={30}
            src='/images/icon/ic_arrow.png'
            alt='arrow'
          />
        </Link>

        <div className='flex flex-col gap-7'>
          <div className='line-clamp-2'>{room.description}</div>

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
            <div>{room.capacity} guests</div>
          </div>
        </div>

        <hr className='border-primary/20' />

        <div className='flex items-center justify-between'>
          <div>
            <div className='text-sm text-[#66736F]'>Avg. price per night</div>
            <div className='mt-1 text-2xl font-extrabold text-[#0D4949] tabular-nums'>
              {formatCurrency(room.price)}
            </div>
          </div>

          <Button
            onClick={handleViewRoom}
            className='h-[48px] w-[148px]! text-lg!'>
            View Room
          </Button>
        </div>
      </div>
    </div>
  );
}
