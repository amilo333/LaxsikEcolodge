'use client';

import { useBookingPricing } from '../hooks';
import { useBookingStore } from '../stores';
import { TAvailableRoom } from '../types';
import { formatCurrency, formatStayDate } from '../utils';

type TBookingDetailPanelProps = {
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  requestedGuests: string | null;
  rooms: TAvailableRoom[];
};

export function BookingDetailPanel({
  checkInDate,
  checkOutDate,
  numberOfNights,
  requestedGuests,
  rooms,
}: TBookingDetailPanelProps) {
  const quantities = useBookingStore((state) => state.quantities);
  const appliedVoucher = useBookingStore((state) => state.appliedVoucher);
  const pricing = useBookingPricing(rooms, numberOfNights);
  const selectedRooms = rooms.filter((room) => quantities[room._id] > 0);

  return (
    <aside className='space-y-6'>
      <section>
        <p className='text-[11px] font-bold text-[#0D4949]/60 uppercase'>
          Your booking details
        </p>

        <div className='mt-4 grid grid-cols-2 gap-3'>
          <div className='rounded-[16px] bg-[#F4F7F6] p-3'>
            <p className='text-[10px] text-[#69726E]'>Check-in</p>
            <p className='mt-1 text-xs font-bold'>
              {formatStayDate(checkInDate)}
            </p>
          </div>
          <div className='rounded-[16px] bg-[#F4F7F6] p-3'>
            <p className='text-[10px] text-[#69726E]'>Check-out</p>
            <p className='mt-1 text-xs font-bold'>
              {formatStayDate(checkOutDate)}
            </p>
          </div>
        </div>

        <dl className='mt-4 space-y-2 text-xs'>
          <div className='flex justify-between gap-3'>
            <dt className='text-[#68726E]'>Length of stay</dt>
            <dd className='font-bold'>
              {numberOfNights} night{numberOfNights === 1 ? '' : 's'}
            </dd>
          </div>
          {requestedGuests && (
            <div className='flex justify-between gap-3'>
              <dt className='text-[#68726E]'>Guests</dt>
              <dd className='font-bold'>{requestedGuests}</dd>
            </div>
          )}
          <div className='flex justify-between gap-3'>
            <dt className='text-[#68726E]'>Rooms</dt>
            <dd className='font-bold'>{pricing.selectedRoomCount}</dd>
          </div>
        </dl>

        <div className='mt-4 overflow-hidden rounded-[16px] border border-[#DCE6E2] bg-[#F4F7F6]'>
          <div className='flex items-center justify-between gap-3 border-b border-[#DCE6E2] px-4 py-3'>
            <p className='text-[10px] font-bold text-[#56615D] uppercase'>
              Room details
            </p>
            <p className='text-[10px] text-[#68726E]'>
              {numberOfNights} night{numberOfNights === 1 ? '' : 's'}
            </p>
          </div>
          <div className='divide-y divide-[#DCE6E2] px-4'>
            {selectedRooms.map((room) => {
              const quantity = quantities[room._id];
              const lineTotal = room.price * quantity * numberOfNights;

              return (
                <div
                  key={room._id}
                  className='flex items-start justify-between gap-3 py-3'>
                  <div className='min-w-0'>
                    <p className='text-xs font-bold text-[#202522]'>
                      {room.title}
                    </p>
                    <p className='mt-1 text-[10px] leading-4 text-[#68726E]'>
                      {quantity} room{quantity === 1 ? '' : 's'} ×{' '}
                      {numberOfNights} night{numberOfNights === 1 ? '' : 's'}
                    </p>
                    <p className='text-[10px] leading-4 text-[#68726E]'>
                      {formatCurrency(room.price)} / room / night
                    </p>
                  </div>
                  <p className='shrink-0 text-xs font-bold text-[#0D4949]'>
                    {formatCurrency(lineTotal)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className='border-t border-[#E3E9E7] pt-5'>
        <p className='text-[11px] font-bold text-[#0D4949]/60 uppercase'>
          Price summary
        </p>
        <dl className='mt-3 space-y-2 text-xs'>
          <div className='flex justify-between gap-3'>
            <dt>Room subtotal</dt>
            <dd>{formatCurrency(pricing.subtotal)}</dd>
          </div>
          {appliedVoucher && (
            <>
              <div className='flex justify-between gap-3 text-[#236B51]'>
                <dt>Voucher ({appliedVoucher.code})</dt>
                <dd>− {formatCurrency(pricing.discountAmount)}</dd>
              </div>
              <div className='flex justify-between gap-3 text-[#68726E]'>
                <dt>After discount</dt>
                <dd>
                  {formatCurrency(pricing.subtotal - pricing.discountAmount)}
                </dd>
              </div>
            </>
          )}
          <div className='flex justify-between gap-3'>
            <dt>Service charge (5%)</dt>
            <dd>{formatCurrency(pricing.serviceCharge)}</dd>
          </div>
          <div className='flex justify-between gap-3 border-t border-[#DCE3E0] pt-3 text-sm font-bold'>
            <dt>Total payment</dt>
            <dd>{formatCurrency(pricing.totalAmount)}</dd>
          </div>
        </dl>
        <p className='mt-3 text-[10px] leading-4 text-[#747D79]'>
          The service charge is calculated after the voucher discount.
        </p>
      </section>
    </aside>
  );
}
