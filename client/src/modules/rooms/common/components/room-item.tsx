'use client';

import { Button } from '@/components/core';
import { formatCurrency } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TRoom } from '../types/room-type';

type TRoomItemProps = {
  room: TRoom;
  detailHref: string;
  isPriority?: boolean;
};

export function RoomItem({
  room,
  detailHref,
  isPriority = false,
}: TRoomItemProps) {
  const router = useRouter();

  const handleViewRoom = () => router.push(detailHref);

  return (
    <article className='group grid w-full overflow-hidden rounded-[22px] border border-[#DCE6E2] bg-white shadow-[0_18px_48px_rgba(13,73,73,0.09)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(13,73,73,0.13)] md:min-h-[380px] md:grid-cols-[46%_54%] xl:min-h-[400px]'>
      <Link
        href={detailHref}
        aria-label={`View ${room.title}`}
        className='relative block min-h-[220px] overflow-hidden bg-[#E7EEEB] sm:min-h-[260px] md:min-h-full'>
        <Image
          fill
          src={room.thumbnail}
          alt={room.title}
          {...(isPriority ? { preload: true } : { loading: 'lazy' as const })}
          sizes='(min-width: 1024px) 35vw, (min-width: 768px) 46vw, 92vw'
          quality={90}
          className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
        />
        <span className='absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent' />
      </Link>

      <div className='flex min-w-0 flex-col p-5 sm:p-6 lg:p-8'>
        <Link
          href={detailHref}
          className='flex items-start justify-between gap-4 text-base font-bold text-[#0D4949] uppercase transition-colors hover:text-[#A66641] sm:text-lg'>
          <span className='line-clamp-2'>{room.title}</span>
          <span className='mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#0D4949]/15 bg-[#F4F7F6]'>
            <svg
              aria-hidden='true'
              viewBox='0 0 20 20'
              className='h-3.5 w-3.5 fill-current'>
              <path d='m7.4 4.8 1.1-1.1 6.3 6.3-6.3 6.3-1.1-1.1 5.2-5.2-5.2-5.2Z' />
            </svg>
          </span>
        </Link>

        <p className='mt-3 line-clamp-2 text-xs leading-5 text-[#66736F]'>
          {room.description}
        </p>

        <div className='mt-4 grid flex-1 content-center gap-2'>
          <span className='flex min-h-8 w-fit items-center gap-2 rounded-full bg-[#F1F5F3] px-3 py-2 text-[10px] font-medium text-[#53625D]'>
            <Image
              height={15}
              width={15}
              src='/images/icon/ic-bed.png'
              alt=''
              className='h-[15px] w-[15px] object-contain'
            />
            {room.bed}
          </span>
          <span className='flex min-h-8 w-fit items-center gap-2 rounded-full bg-[#F1F5F3] px-3 py-2 text-[10px] font-medium text-[#53625D]'>
            <Image
              height={15}
              width={15}
              src='/images/icon/ic-home.png'
              alt=''
              className='h-[15px] w-[15px] object-contain'
            />
            {room.area} m²
          </span>
          <span className='flex min-h-8 w-fit items-center gap-2 rounded-full bg-[#F1F5F3] px-3 py-2 text-[10px] font-medium text-[#53625D]'>
            <Image
              height={15}
              width={15}
              src='/images/icon/ic-group.png'
              alt=''
              className='h-[15px] w-[15px] object-contain'
            />
            {room.capacity} guests
          </span>
          {room.views && (
            <span className='flex min-h-8 w-fit items-center gap-2 rounded-full bg-[#F1F5F3] px-3 py-2 text-[10px] font-medium text-[#53625D]'>
              <svg
                aria-hidden='true'
                viewBox='0 0 20 20'
                className='h-[15px] w-[15px] shrink-0 fill-[#6A7C76]'>
                <path d='M10 3c4.5 0 7.8 3.6 8.7 6.2a2.4 2.4 0 0 1 0 1.6C17.8 13.4 14.5 17 10 17s-7.8-3.6-8.7-6.2a2.4 2.4 0 0 1 0-1.6C2.2 6.6 5.5 3 10 3Zm0 2C6.6 5 3.9 7.6 3.2 10c.7 2.4 3.4 5 6.8 5s6.1-2.6 6.8-5c-.7-2.4-3.4-5-6.8-5Zm0 2.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6Z' />
              </svg>
              View {room.views}
            </span>
          )}
        </div>

        <div className='mt-4 flex flex-col gap-4 border-t border-[#E1E8E5] pt-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-[10px] font-semibold tracking-[0.04em] text-[#71807B] uppercase'>
              Avg. price per night
            </p>
            <p className='mt-1 text-lg font-extrabold text-[#0D4949] tabular-nums sm:text-xl'>
              {formatCurrency(room.price)}
            </p>
          </div>

          <Button
            onClick={handleViewRoom}
            className='h-11! w-full! rounded-full! px-6! text-xs! font-bold! uppercase sm:w-auto! sm:min-w-[132px]!'>
            View Room
          </Button>
        </div>
      </div>
    </article>
  );
}
