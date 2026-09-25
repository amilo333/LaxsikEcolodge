'use client';

import { Button } from '@/components/core';
import { buildBookingUrl, formatCurrency } from '@/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { TRoom } from '../types';
import { useTranslations } from 'next-intl';

type TRoomCardProps = {
  room: TRoom;
};

export function RoomCard({ room }: TRoomCardProps) {
  const t = useTranslations('Rooms.card');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBookNow = () => {
    router.push(buildBookingUrl(room._id, searchParams));
  };

  return (
    <div className='flex w-full items-center justify-center rounded-[20px] bg-white shadow-2xl'>
      <div className='flex w-full flex-col items-center gap-5 px-5 py-7 sm:gap-6 sm:px-9 sm:py-9 lg:px-14 lg:py-11'>
        <div className='font-lora text-center text-2xl font-semibold uppercase sm:text-[32px]'>
          {room.title}
        </div>
        <div className='flex flex-col gap-5 text-base sm:text-[18px]'>
          <div className='font-montserrat max-w-4xl text-center text-sm leading-7 sm:text-[18px]'>
            {room.description}
          </div>
        </div>
        <hr className='h-0.1 w-full bg-[#ccc]' />
        <div className='flex flex-col items-center justify-between gap-2'>
          <div className='flex flex-col items-center gap-1 text-base sm:flex-row sm:gap-2 sm:text-[18px]'>
            <div className='text-center'>{t('averagePrice')}</div>
            <div className='text-2xl font-extrabold text-[#0D4949] tabular-nums sm:text-[32px]'>
              {formatCurrency(room.price)}
            </div>
          </div>
          <Button
            onClick={handleBookNow}
            className='h-[clamp(48px,4.5vw,64px)]! w-[clamp(180px,55vw,260px)]! text-[clamp(17px,2vw,24px)]!'>
            {t('bookNow')}
          </Button>
        </div>
      </div>
    </div>
  );
}
