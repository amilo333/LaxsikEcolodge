'use client';

import { Button } from '@/components/core';
import { useBookingPricing } from '../hooks';
import { useBookingStore } from '../stores';
import { TAvailableRoom } from '../types';
import { formatCurrency } from '../utils';
import { VoucherSelector } from './voucher-selector';

type TBookingSummaryProps = {
  rooms: TAvailableRoom[];
  numberOfNights: number;
};

export function BookingSummary({
  rooms,
  numberOfNights,
}: TBookingSummaryProps) {
  const appliedVoucher = useBookingStore((state) => state.appliedVoucher);
  const checkoutMessage = useBookingStore((state) => state.checkoutMessage);
  const setCheckoutMessage = useBookingStore(
    (state) => state.setCheckoutMessage
  );
  const pricing = useBookingPricing(rooms, numberOfNights);

  const handleCheckout = () => {
    setCheckoutMessage(
      pricing.selectedRoomCount === 0
        ? 'Please select at least one room to continue.'
        : 'Your room selection is ready. Guest details will be completed in step 2.'
    );
  };

  return (
    <div className='mt-6 grid gap-7 border-t border-[#E5EAE8] pt-6 lg:grid-cols-[1fr_440px] lg:items-start'>
      <div className='rounded-[16px] bg-[#F5F7F6] px-4 py-4 text-[11px] leading-5 text-[#505754] sm:px-5'>
        <p className='font-bold text-[#202522]'>Good to know</p>
        <p className='mt-1'>
          Room availability is held after your booking is confirmed. Taxes and
          service fees are calculated from the room total after any eligible
          voucher discount.
        </p>
      </div>

      <div>
        <VoucherSelector />

        <dl className='mt-5 space-y-2 text-xs'>
          <div className='flex justify-between gap-4 text-[#555E5A]'>
            <dt>Room subtotal</dt>
            <dd>{formatCurrency(pricing.subtotal)}</dd>
          </div>
          {appliedVoucher && (
            <div className='flex justify-between gap-4 font-semibold text-[#236B51]'>
              <dt>Voucher ({appliedVoucher.code})</dt>
              <dd>− {formatCurrency(pricing.discountAmount)}</dd>
            </div>
          )}
          <div className='flex justify-between gap-4 text-[#555E5A]'>
            <dt>Service charge (5%)</dt>
            <dd>{formatCurrency(pricing.serviceCharge)}</dd>
          </div>
        </dl>

        <div className='mt-4 flex flex-col gap-4 border-t border-[#DCE3E0] pt-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-[10px] font-bold tracking-[0.12em] text-[#69726E] uppercase'>
              Total
            </p>
            <p className='mt-0.5 text-xl font-bold'>
              {formatCurrency(pricing.totalAmount)}
            </p>
            <p className='mt-0.5 text-[10px] text-[#6E7773]'>
              for {pricing.selectedRoomCount} room
              {pricing.selectedRoomCount === 1 ? '' : 's'} · {numberOfNights}{' '}
              night{numberOfNights === 1 ? '' : 's'}
            </p>
          </div>

          <Button
            onClick={handleCheckout}
            className='h-12! w-auto! min-w-[170px]! rounded-full! px-8! text-sm! tracking-[0.04em] uppercase'>
            Book Now
          </Button>
        </div>

        {checkoutMessage && (
          <p
            className={`mt-3 text-xs font-medium ${
              pricing.selectedRoomCount === 0
                ? 'text-[#B33939]'
                : 'text-[#236B51]'
            }`}
            role={pricing.selectedRoomCount === 0 ? 'alert' : 'status'}>
            {checkoutMessage}
          </p>
        )}
      </div>
    </div>
  );
}
