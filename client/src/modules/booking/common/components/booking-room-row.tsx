'use client';

import { Button } from '@/components/core';
import Image from 'next/image';
import { useBookingStore } from '../stores';
import { TAvailableRoom } from '../types';
import { formatCurrency } from '../utils';
import { localizeRoomContent } from '@/utils';
import { useLocale, useTranslations } from 'next-intl';

type TBookingRoomRowProps = {
  room: TAvailableRoom;
};

function RoomFeature({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <span className='flex items-center gap-1.5'>
      <Image
        src={icon}
        alt=''
        aria-hidden='true'
        width={16}
        height={16}
        className='h-4 w-4 object-contain opacity-70'
      />
      {children}
    </span>
  );
}

export function BookingRoomRow({ room }: TBookingRoomRowProps) {
  const t = useTranslations('Booking.roomRow');
  const locale = useLocale();
  const displayRoom = localizeRoomContent(room, locale);
  const selectedQuantity = useBookingStore(
    (state) => state.quantities[room._id] ?? 0
  );
  const setRoomQuantity = useBookingStore((state) => state.setRoomQuantity);
  const maximumQuantity = room.availableQuantity ?? room.quantity;

  const updateQuantity = (change: number) => {
    const nextQuantity = Math.min(
      maximumQuantity,
      Math.max(0, selectedQuantity + change)
    );
    setRoomQuantity(room._id, nextQuantity);
  };

  return (
    <article className='grid grid-cols-1 border-t border-[#E3E8E6] first:border-t-0 md:grid-cols-[minmax(360px,1.5fr)_110px_minmax(190px,1fr)_150px]'>
      <div className='flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center'>
        <Image
          src={room.thumbnail}
          alt={displayRoom.title}
          width={128}
          height={96}
          className='h-24 w-full shrink-0 rounded-[16px] object-cover sm:w-32'
        />
        <div className='min-w-0'>
          <h3 className='text-sm font-bold'>{displayRoom.title}</h3>
          <div className='mt-2 grid gap-1 text-[11px] text-[#58605D] lg:grid-cols-2'>
            <RoomFeature icon='/images/icon/ic-room-bed.png'>
              {displayRoom.bed}
            </RoomFeature>
            <RoomFeature icon='/images/icon/ic-room-size.png'>
              {room.area}m²
            </RoomFeature>
            <RoomFeature icon='/images/icon/ic-room-occupancy.png'>
              {t('upToGuests', { count: room.capacity })}
            </RoomFeature>
            {displayRoom.fireplace && (
              <RoomFeature icon='/images/icon/ic-room-fireplace.png'>
                {displayRoom.fireplace}
              </RoomFeature>
            )}
          </div>
        </div>
      </div>

      <div className='flex items-center gap-2 border-t border-[#EEF1F0] px-4 py-3 text-sm font-bold md:border-t-0 md:border-l md:border-[#E3E8E6] md:py-4'>
        <span className='text-[10px] text-[#78807D] uppercase md:hidden'>
          {t('guests')}
        </span>
        {room.capacity}
      </div>

      <div className='border-t border-[#EEF1F0] px-4 py-3 md:border-t-0 md:border-l md:border-[#E3E8E6] md:py-4'>
        <span className='text-sm font-bold'>{formatCurrency(room.price)}</span>
        <p className='mt-1 text-[10px] text-[#777F7C]'>{t('priceNote')}</p>
      </div>

      <div className='flex items-center justify-between border-t border-[#EEF1F0] px-4 py-3 md:justify-center md:border-t-0 md:border-l md:border-[#E3E8E6] md:py-4'>
        <span className='text-[10px] text-[#78807D] uppercase md:hidden'>
          {t('selectRooms')}
        </span>
        <div className='flex items-center gap-3'>
          <Button
            aria-label={t('removeOne', { name: displayRoom.title })}
            isDisabled={selectedQuantity === 0}
            onClick={() => updateQuantity(-1)}
            className='h-8! w-8! min-w-8! rounded-full! border border-[#DCE3E0]! bg-white! p-0! text-xl! font-light! text-[#0D4949]! disabled:opacity-35'>
            −
          </Button>
          <output
            aria-live='polite'
            className='w-4 text-center text-sm font-bold'>
            {selectedQuantity}
          </output>
          <Button
            aria-label={t('addOne', { name: displayRoom.title })}
            isDisabled={selectedQuantity >= maximumQuantity}
            onClick={() => updateQuantity(1)}
            className='h-8! w-8! min-w-8! rounded-full! border border-[#DCE3E0]! bg-white! p-0! text-xl! font-light! text-[#0D4949]! disabled:opacity-35'>
            +
          </Button>
        </div>
      </div>
    </article>
  );
}
