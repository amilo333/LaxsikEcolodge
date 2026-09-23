'use client';

import { Button } from '@/components/core';
import { TAvailableRoom } from '../types';
import { formatStayDate } from '../utils';
import { BookingRoomRow } from './booking-room-row';
import { useLocale, useTranslations } from 'next-intl';

type TBookingRoomSelectionProps = {
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  rooms: TAvailableRoom[];
  selectedRoomId: string | null;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export function BookingRoomSelection({
  checkInDate,
  checkOutDate,
  numberOfNights,
  rooms,
  selectedRoomId,
  isLoading,
  isError,
  onRetry,
}: TBookingRoomSelectionProps) {
  const t = useTranslations('Booking.selection');
  const locale = useLocale();
  return (
    <>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-[11px] font-bold text-[#0D4949]/60 uppercase'>
            {t('step')}
          </p>
          <h1 className='mt-1 text-xl font-bold uppercase sm:text-2xl'>
            {t('title')}
          </h1>
        </div>
        <p className='text-sm font-medium text-[#0D4949]'>
          {t('nightCount', { count: numberOfNights })}
        </p>
      </div>

      <div className='mt-5 rounded-[16px] bg-[#F0F2F1] px-4 py-3 text-[11px] leading-5 text-[#3E4442] sm:text-xs'>
        {t('feeNote')}
      </div>

      <h2 className='mt-5 text-sm font-bold sm:text-base'>
        {formatStayDate(checkInDate, locale)}
        <span className='mx-2 text-[#0D4949]/50'>—</span>
        {formatStayDate(checkOutDate, locale)}
      </h2>

      <div className='mt-4 overflow-hidden rounded-[16px] border border-[#E3E8E6]'>
        <div className='hidden grid-cols-[minmax(360px,1.5fr)_110px_minmax(190px,1fr)_150px] bg-[#F1F5F3] text-[11px] font-bold md:grid'>
          <div className='px-4 py-3'>{t('roomType')}</div>
          <div className='border-l border-white px-4 py-3'>{t('guests')}</div>
          <div className='border-l border-white px-4 py-3'>{t('price')}</div>
          <div className='border-l border-white px-4 py-3 text-center'>
            {t('selectRooms')}
          </div>
        </div>

        {isLoading && (
          <div className='min-h-[112px] animate-pulse bg-white p-4'>
            <div className='h-4 w-1/3 rounded bg-[#E7ECEA]' />
            <div className='mt-3 h-3 w-1/5 rounded bg-[#EFF2F1]' />
          </div>
        )}

        {!isLoading && isError && (
          <div className='flex flex-col items-center px-5 py-12 text-center'>
            <p className='font-semibold text-[#0D4949]'>{t('loadError')}</p>
            <Button
              onClick={onRetry}
              className='mt-3 h-10! w-auto! rounded-full! border border-[#0D4949]! bg-white! px-5! text-sm! text-[#0D4949]!'>
              {t('tryAgain')}
            </Button>
          </div>
        )}

        {!isLoading && !isError && rooms.length === 0 && (
          <div className='px-5 py-12 text-center'>
            <p className='font-semibold text-[#0D4949]'>
              {selectedRoomId ? t('unavailable') : t('chooseFirst')}
            </p>
            <p className='mt-1 text-sm text-[#555E5A]'>{t('returnToRooms')}</p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          rooms.map((room) => <BookingRoomRow key={room._id} room={room} />)}
      </div>
    </>
  );
}
