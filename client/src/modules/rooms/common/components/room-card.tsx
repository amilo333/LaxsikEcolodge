'use client';

import { Button } from '@/components/core';
import { buildBookingUrl, formatCurrency } from '@/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { TRoom } from '../types';

type TRoomCardProps = {
  room: TRoom;
};

export function RoomCard({ room }: TRoomCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBookNow = () => {
    router.push(buildBookingUrl(room._id, searchParams));
  };

  return (
    <div className='flex max-h-[433px] w-full max-w-[1600px] items-center justify-center rounded-2xl bg-white shadow-2xl'>
      <div className='flex flex-col items-center gap-[24px] px-[56px] py-[44px]'>
        <div className='font-lora flex items-center gap-2 text-[32px] font-semibold uppercase'>
          {room.title}
        </div>
        <div className='flex flex-col gap-[28px] text-[18px]'>
          <div className='font-montserrat text-center text-[18px]'>
            {room.description}
          </div>
        </div>
        <hr className='h-0.1 w-full bg-[#ccc]' />
        <div className='flex flex-col items-center justify-between gap-2'>
          <div className='flex items-center gap-2 text-[18px]'>
            <div>Avg. price per night</div>
            <div className='text-[32px] font-extrabold text-[#0D4949] tabular-nums'>
              {formatCurrency(room.price)}
            </div>
          </div>
          <Button
            onClick={handleBookNow}
            className='h-[clamp(52px,4.5vw,71px)]! w-[clamp(180px,18vw,260px)]! text-[clamp(20px,2vw,28px)]!'>
            BOOK NOW
          </Button>
        </div>
      </div>
    </div>
  );
}
