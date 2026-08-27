import { Button } from '@/components/core';
import { TAvailableRoom } from '../types';
import { formatStayDate } from '../utils';
import { BookingRoomRow } from './booking-room-row';

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
  return (
    <>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-[11px] font-bold text-[#0D4949]/60 uppercase'>
            Step 1 of 3
          </p>
          <h1 className='mt-1 text-xl font-bold uppercase sm:text-2xl'>
            Choose your room
          </h1>
        </div>
        <p className='text-sm font-medium text-[#0D4949]'>
          {numberOfNights} night{numberOfNights === 1 ? '' : 's'}
        </p>
      </div>

      <div className='mt-5 rounded-[16px] bg-[#F0F2F1] px-4 py-3 text-[11px] leading-5 text-[#3E4442] sm:text-xs'>
        A 5% service charge and 10% tax are calculated from the room total after
        any eligible voucher discount.
      </div>

      <h2 className='mt-5 text-sm font-bold sm:text-base'>
        {formatStayDate(checkInDate)}
        <span className='mx-2 text-[#0D4949]/50'>—</span>
        {formatStayDate(checkOutDate)}
      </h2>

      <div className='mt-4 overflow-hidden rounded-[16px] border border-[#E3E8E6]'>
        <div className='hidden grid-cols-[minmax(360px,1.5fr)_110px_minmax(190px,1fr)_150px] bg-[#F1F5F3] text-[11px] font-bold md:grid'>
          <div className='px-4 py-3'>Room type</div>
          <div className='border-l border-white px-4 py-3'>Guests</div>
          <div className='border-l border-white px-4 py-3'>Price</div>
          <div className='border-l border-white px-4 py-3 text-center'>
            Select rooms
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
            <p className='font-semibold text-[#0D4949]'>
              We couldn&apos;t load the selected room.
            </p>
            <Button
              onClick={onRetry}
              className='mt-3 h-10! w-auto! rounded-full! border border-[#0D4949]! bg-white! px-5! text-sm! text-[#0D4949]!'>
              Try again
            </Button>
          </div>
        )}

        {!isLoading && !isError && rooms.length === 0 && (
          <div className='px-5 py-12 text-center'>
            <p className='font-semibold text-[#0D4949]'>
              {selectedRoomId
                ? 'The selected room is not available for these dates.'
                : 'Please choose a room before opening booking.'}
            </p>
            <p className='mt-1 text-sm text-[#555E5A]'>
              Return to the room list and choose another option.
            </p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          rooms.map((room) => <BookingRoomRow key={room._id} room={room} />)}
      </div>
    </>
  );
}
