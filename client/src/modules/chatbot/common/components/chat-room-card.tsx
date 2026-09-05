'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { buildRoomDetailUrl } from '@/utils/booking-search';
import { formatCurrency } from '@/utils/currency';

import type { TChatRoom } from '../types';

type Props = {
  room: TChatRoom;
  onNavigate: () => void;
};

export function ChatRoomCard({ room, onNavigate }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const params = new URLSearchParams();
  if (room.stay) {
    params.set('checkInDate', room.stay.checkInDate);
    params.set('checkOutDate', room.stay.checkOutDate);
    if (room.stay.guests) params.set('guests', String(room.stay.guests));
    if (room.stay.roomCount) params.set('rooms', String(room.stay.roomCount));
  }

  return (
    <Link
      href={buildRoomDetailUrl(room.id, params)}
      onClick={onNavigate}
      aria-label={`Xem phòng ${room.title}`}
      className='group block overflow-hidden rounded-2xl border border-[#D8E5DF] bg-white shadow-sm transition hover:border-[#0D5653] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D5653]'>
      <div className='flex gap-3 p-3'>
        <div className='relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#EAF3F0]'>
          {room.thumbnail && !imageFailed ? (
            <Image
              src={room.thumbnail}
              alt=''
              fill
              sizes='96px'
              onError={() => setImageFailed(true)}
              className='object-cover transition group-hover:scale-105'
            />
          ) : (
            <span className='flex h-full items-center justify-center text-xs text-[#5F7772]'>
              Laxsik
            </span>
          )}
        </div>
        <div className='min-w-0 flex-1 text-[11px] leading-4 text-[#5F7772]'>
          <h3 className='text-xs leading-5 font-semibold break-words text-[#173F39]'>
            {room.title}
          </h3>
          {room.capacity !== null && <p>Tối đa {room.capacity} khách/phòng</p>}
          {room.views && <p className='mt-1 break-words'>View: {room.views}</p>}
          <p className='mt-2 font-semibold text-[#0D5653]'>
            {room.pricePerNight !== null
              ? `${formatCurrency(room.pricePerNight)} / đêm`
              : 'Liên hệ để xem giá'}
          </p>
        </div>
      </div>
      <div className='flex items-center justify-between gap-2 border-t border-[#E5EDE9] bg-[#F3F8F5] px-3 py-2'>
        <span className='text-[10px] leading-4 text-[#5F7772]'>
          {room.stay ? (
            <>
              Còn {room.stay.availableQuantity} phòng
              <span className='block'>
                {room.stay.checkInDate} → {room.stay.checkOutDate}
              </span>
            </>
          ) : (
            'Chưa kiểm tra phòng trống theo ngày'
          )}
        </span>
        <span className='shrink-0 text-[11px] font-semibold text-[#0D5653]'>
          Xem phòng <span aria-hidden='true'>→</span>
        </span>
      </div>
    </Link>
  );
}
