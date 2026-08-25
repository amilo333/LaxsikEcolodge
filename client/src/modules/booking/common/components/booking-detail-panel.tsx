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
        <p className='text-[11px] font-bold tracking-[0.14em] text-[#0D4949]/60 uppercase'>
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

        <div className='mt-4 rounded-[16px] bg-[#E9EEEC] p-4'>
          <p className='text-[10px] font-bold tracking-[0.12em] text-[#56615D] uppercase'>
            Your selection
          </p>
          <div className='mt-2 divide-y divide-white/80'>
            {selectedRooms.map((room) => {
              const quantity = quantities[room._id];

              return (
                <div key={room._id} className='py-2 first:pt-0 last:pb-0'>
                  <p className='text-xs font-bold'>
                    {quantity} × {room.title}
                  </p>
                  <p className='mt-0.5 text-[10px] text-[#606A66]'>
                    {formatCurrency(room.price * quantity * numberOfNights)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className='border-t border-[#E3E9E7] pt-5'>
        <p className='text-[11px] font-bold tracking-[0.14em] text-[#0D4949]/60 uppercase'>
          Price summary
        </p>
        <dl className='mt-3 space-y-2 text-xs'>
          <div className='flex justify-between gap-3'>
            <dt>Room subtotal</dt>
            <dd>{formatCurrency(pricing.subtotal)}</dd>
          </div>
          {appliedVoucher && (
            <div className='flex justify-between gap-3 text-[#236B51]'>
              <dt>Voucher ({appliedVoucher.code})</dt>
              <dd>− {formatCurrency(pricing.discountAmount)}</dd>
            </div>
          )}
          <div className='flex justify-between gap-3'>
            <dt>Service charge (5%)</dt>
            <dd>{formatCurrency(pricing.serviceCharge)}</dd>
          </div>
          <div className='flex justify-between gap-3 border-t border-[#DCE3E0] pt-3 text-sm font-bold'>
            <dt>Total</dt>
            <dd>{formatCurrency(pricing.totalAmount)}</dd>
          </div>
        </dl>
      </section>
    </aside>
  );
}
