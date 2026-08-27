'use client';

import { Button } from '@/components/core';
import {
  getPaymentErrorMessage,
  useStartVnpayPayment,
  useVnpayPaymentStatusApi,
} from '@/modules/payment/common';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useBookingDetailsApi } from '../hooks';
import { formatCurrency, formatStayDate } from '../utils';

type TBookingStepThreeProps = {
  bookingId: string | null;
  onFinish: () => void;
};

export function BookingStepThree({
  bookingId,
  onFinish,
}: TBookingStepThreeProps) {
  const bookingQuery = useBookingDetailsApi(bookingId);
  const vnpayPayment = useStartVnpayPayment();
  const [paymentError, setPaymentError] = useState('');
  const shouldReconcileVnpay =
    bookingQuery.data?.paymentMethod === 'vnpay' &&
    bookingQuery.data.paymentStatus === 'pending';
  const vnpayStatusQuery = useVnpayPaymentStatusApi(
    bookingId,
    shouldReconcileVnpay
  );
  const refetchBooking = bookingQuery.refetch;

  useEffect(() => {
    if (
      vnpayStatusQuery.data &&
      vnpayStatusQuery.data.paymentStatus !== 'pending'
    ) {
      void refetchBooking();
    }
  }, [refetchBooking, vnpayStatusQuery.data]);

  if (!bookingId) {
    return (
      <section className='mx-auto w-[calc(100%-32px)] max-w-[760px] py-12'>
        <div className='rounded-[16px] bg-white p-8 text-center shadow-lg'>
          <h1 className='text-xl font-bold text-[#0D4949]'>
            Booking not found
          </h1>
          <p className='mt-2 text-sm text-[#68726E]'>
            Complete step 2 before opening the confirmation page.
          </p>
        </div>
      </section>
    );
  }

  if (bookingQuery.isLoading) {
    return (
      <section className='mx-auto w-[calc(100%-32px)] max-w-[760px] py-12'>
        <div className='rounded-[16px] bg-white p-8 text-center font-semibold text-[#0D4949] shadow-lg'>
          Loading your confirmed booking from the server…
        </div>
      </section>
    );
  }

  if (bookingQuery.isError || !bookingQuery.data) {
    return (
      <section className='mx-auto w-[calc(100%-32px)] max-w-[760px] py-12'>
        <div className='flex flex-col items-center rounded-[16px] bg-white p-8 text-center shadow-lg'>
          <h1 className='text-xl font-bold text-[#0D4949]'>
            Unable to load your booking
          </h1>
          <p className='mt-2 text-sm text-[#68726E]'>
            Your booking may have been created. Try loading the confirmation
            again.
          </p>
          <Button
            onClick={() => void bookingQuery.refetch()}
            className='mt-5 h-11! w-auto! rounded-full! px-6! text-sm!'>
            Try again
          </Button>
        </div>
      </section>
    );
  }

  const booking = bookingQuery.data;
  const paymentFailed = booking.paymentStatus === 'failed';
  const paymentCompleted = booking.paymentStatus === 'paid';
  const paymentPending = booking.paymentStatus === 'pending';
  const canRetryVnpay =
    booking.paymentMethod === 'vnpay' &&
    (booking.paymentStatus === 'failed' || booking.paymentStatus === 'unpaid');
  const paymentMethodLabel =
    booking.paymentMethod === 'momo'
      ? 'MoMo'
      : booking.paymentMethod === 'vnpay'
        ? 'VNPay'
        : 'Bank transfer';
  const statusIcon = paymentFailed ? '!' : paymentPending ? '…' : '✓';
  const statusIconClass = paymentFailed
    ? 'bg-[#B33939]'
    : paymentPending
      ? 'bg-[#B87918]'
      : 'bg-[#0D4949]';
  const totalRoomCount = booking.bookingItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const amountAfterDiscount = Math.max(
    0,
    booking.subtotal - booking.discountAmount
  );
  const voucherCode =
    booking.voucherId && typeof booking.voucherId !== 'string'
      ? booking.voucherId.code
      : null;
  const issuedAt = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(booking.createdAt));

  const retryPayment = async () => {
    setPaymentError('');

    try {
      await vnpayPayment.startPayment(booking._id);
    } catch (error) {
      setPaymentError(getPaymentErrorMessage(error));
    }
  };

  return (
    <section className='mx-auto w-[calc(100%-32px)] max-w-[940px] py-8 sm:py-12'>
      <div className='rounded-[16px] border border-[#0D4949]/15 bg-white p-5 text-center shadow-[0_18px_55px_rgba(13,73,73,0.09)] sm:p-8'>
        <span
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white ${statusIconClass}`}>
          {statusIcon}
        </span>
        <p className='mt-5 text-[11px] font-bold text-[#0D4949]/60 uppercase'>
          Step 3 of 3
        </p>
        <h1 className='mt-1 text-2xl font-bold text-[#0D4949] sm:text-3xl'>
          {paymentFailed
            ? 'Payment was not completed'
            : paymentCompleted
              ? 'Your booking is confirmed'
              : paymentPending
                ? 'Confirming your payment'
                : 'Your booking is created'}
        </h1>
        <p className='mt-2 text-sm text-[#68726E]'>
          Booking reference:{' '}
          <strong className='text-[#151515]'>{booking.bookingCode}</strong>
        </p>

        <div className='mx-auto mt-7 grid max-w-[760px] gap-4 text-left sm:grid-cols-2'>
          <div className='rounded-[16px] bg-[#F4F7F6] p-5'>
            <p className='text-[10px] font-bold text-[#69726E] uppercase'>
              Stay
            </p>
            <p className='mt-2 text-sm font-bold'>
              {formatStayDate(booking.checkInDate)} —{' '}
              {formatStayDate(booking.checkOutDate)}
            </p>
            <p className='mt-1 text-xs text-[#68726E]'>
              {booking.totalNights} night
              {booking.totalNights === 1 ? '' : 's'}
            </p>
          </div>

          <div className='overflow-hidden rounded-[16px] border border-[#D8E7EA] bg-[linear-gradient(135deg,#F0FAFC_0%,#FFF8F4_100%)] p-5 shadow-[0_12px_28px_rgba(13,73,73,0.06)]'>
            <p className='text-[10px] font-bold text-[#69726E] uppercase'>
              Payment
            </p>
            {booking.paymentMethod === 'vnpay' ? (
              <div className='mt-2 flex items-center gap-3'>
                <div className='relative h-11 w-[116px] shrink-0 overflow-hidden rounded-[10px] border border-[#E1E8E8] bg-white shadow-sm'>
                  <Image
                    src='/images/vnpay-logo.jpg'
                    alt='VNPay payment gateway'
                    fill
                    sizes='116px'
                    className='scale-[3.4] object-contain'
                  />
                </div>
                <div>
                  <p className='text-sm font-bold text-[#0D4949]'>VNPay</p>
                  <p className='mt-0.5 text-xs text-[#68726E] capitalize'>
                    Status: {booking.paymentStatus}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className='mt-2 text-sm font-bold capitalize'>
                  {paymentMethodLabel}
                </p>
                <p className='mt-1 text-xs text-[#68726E] capitalize'>
                  Status: {booking.paymentStatus}
                </p>
              </>
            )}
          </div>
        </div>

        <div className='mx-auto mt-4 max-w-[760px] overflow-hidden rounded-[18px] border border-[#DCE6E2] bg-white text-left shadow-[0_14px_34px_rgba(13,73,73,0.07)]'>
          <div className='flex flex-col gap-3 bg-[linear-gradient(135deg,#0D4949_0%,#176361_100%)] px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <p className='text-[10px] font-bold tracking-[0.14em] text-white/65 uppercase'>
                Invoice details
              </p>
              <p className='mt-1 text-lg font-bold'>#{booking.bookingCode}</p>
            </div>
            <div className='sm:text-right'>
              <p className='text-[10px] font-semibold text-white/65 uppercase'>
                {paymentCompleted ? 'Total paid' : 'Total amount'}
              </p>
              <p className='mt-0.5 text-xl font-bold'>
                {formatCurrency(booking.totalAmount)}
              </p>
            </div>
          </div>

          <div className='grid gap-4 border-b border-[#E3EAE7] bg-[#F7F9F8] px-5 py-4 sm:grid-cols-3'>
            <div>
              <p className='text-[9px] font-bold text-[#77807C] uppercase'>
                Guest
              </p>
              <p className='mt-1 text-xs font-bold text-[#202522]'>
                {booking.customerInfo.fullNameContact}
              </p>
            </div>
            <div className='min-w-0'>
              <p className='text-[9px] font-bold text-[#77807C] uppercase'>
                Contact
              </p>
              <p className='mt-1 truncate text-[11px] font-semibold text-[#202522]'>
                {booking.customerInfo.emailContact}
              </p>
              <p className='mt-0.5 text-[10px] text-[#68726E]'>
                {booking.customerInfo.phoneContact}
              </p>
            </div>
            <div>
              <p className='text-[9px] font-bold text-[#77807C] uppercase'>
                Issued on
              </p>
              <p className='mt-1 text-[11px] font-semibold text-[#202522]'>
                {issuedAt}
              </p>
            </div>
          </div>

          <div className='px-5 pt-4'>
            <div className='hidden grid-cols-[minmax(0,1.8fr)_60px_65px_105px_112px] gap-3 border-b border-[#E6EBE9] pb-2 text-[9px] font-bold tracking-[0.08em] text-[#77807C] uppercase sm:grid'>
              <p>Room</p>
              <p className='text-center'>Qty</p>
              <p className='text-center'>Nights</p>
              <p className='text-right'>Rate</p>
              <p className='text-right'>Amount</p>
            </div>

            <div className='divide-y divide-[#E6EBE9]'>
              {booking.bookingItems.map((item, index) => {
                const room =
                  typeof item.roomId === 'string' ? null : item.roomId;
                const lineTotal =
                  item.pricePerNight * item.quantity * booking.totalNights;

                return (
                  <div
                    key={room?._id ?? `${item.pricePerNight}-${index}`}
                    className='grid gap-2 py-4 text-xs sm:grid-cols-[minmax(0,1.8fr)_60px_65px_105px_112px] sm:items-center sm:gap-3'>
                    <div className='min-w-0'>
                      <p className='font-bold text-[#202522]'>
                        {room?.title ?? 'Reserved room'}
                      </p>
                      <p className='mt-1 text-[10px] text-[#68726E] sm:hidden'>
                        {item.quantity} room{item.quantity === 1 ? '' : 's'} ×{' '}
                        {booking.totalNights} night
                        {booking.totalNights === 1 ? '' : 's'}
                      </p>
                      <p className='mt-0.5 text-[10px] text-[#68726E] sm:hidden'>
                        {formatCurrency(item.pricePerNight)} / room / night
                      </p>
                    </div>
                    <p className='hidden text-center text-[#4F5955] sm:block'>
                      {item.quantity}
                    </p>
                    <p className='hidden text-center text-[#4F5955] sm:block'>
                      {booking.totalNights}
                    </p>
                    <p className='hidden text-right text-[#4F5955] sm:block'>
                      {formatCurrency(item.pricePerNight)}
                    </p>
                    <p className='flex justify-between gap-3 font-bold text-[#0D4949] sm:block sm:text-right'>
                      <span className='text-[10px] font-semibold text-[#68726E] sm:hidden'>
                        Line total
                      </span>
                      {formatCurrency(lineTotal)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className='border-t border-[#DCE6E2] bg-[#FAFBFA] px-5 py-5'>
            <dl className='ml-auto max-w-[370px] space-y-2.5 text-xs'>
              <div className='flex justify-between gap-4 text-[#555E5A]'>
                <dt>Room subtotal</dt>
                <dd>{formatCurrency(booking.subtotal)}</dd>
              </div>
              {booking.discountAmount > 0 && (
                <>
                  <div className='flex justify-between gap-4 font-semibold text-[#236B51]'>
                    <dt>Voucher{voucherCode ? ` (${voucherCode})` : ''}</dt>
                    <dd>− {formatCurrency(booking.discountAmount)}</dd>
                  </div>
                  <div className='flex justify-between gap-4 text-[#68726E]'>
                    <dt>After discount</dt>
                    <dd>{formatCurrency(amountAfterDiscount)}</dd>
                  </div>
                </>
              )}
              <div className='flex justify-between gap-4 text-[#555E5A]'>
                <dt>Service charge (5%)</dt>
                <dd>{formatCurrency(booking.serviceChargeAmount)}</dd>
              </div>
              <div className='flex justify-between gap-4 text-[#555E5A]'>
                <dt>Tax (10%)</dt>
                <dd>{formatCurrency(booking.taxAmount)}</dd>
              </div>
              <div className='flex items-end justify-between gap-4 border-t border-[#D6E0DC] pt-3 text-[#0D4949]'>
                <dt>
                  <span className='block text-sm font-bold'>Total payment</span>
                  <span className='mt-0.5 block text-[9px] font-medium text-[#77807C]'>
                    {totalRoomCount} room
                    {totalRoomCount === 1 ? '' : 's'} · {booking.totalNights}{' '}
                    night{booking.totalNights === 1 ? '' : 's'}
                  </span>
                </dt>
                <dd className='text-lg font-bold'>
                  {formatCurrency(booking.totalAmount)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <p className='mx-auto mt-5 max-w-[620px] text-xs leading-5 text-[#68726E]'>
          {paymentPending
            ? 'We are checking the payment result with the server. This page refreshes automatically; please do not create another booking.'
            : `The booking is currently ${booking.bookingStatus}. Payment instructions and status follow the selected method.`}
        </p>

        {paymentPending && bookingQuery.isFetching && (
          <p className='mt-2 text-[11px] font-semibold text-[#B87918]'>
            Checking the latest payment status…
          </p>
        )}

        {paymentPending && vnpayStatusQuery.isFetching && (
          <p className='mt-2 text-[11px] font-semibold text-[#B87918]'>
            Verifying the transaction directly with VNPAY…
          </p>
        )}

        {paymentError && (
          <p
            className='mx-auto mt-4 max-w-[620px] rounded-[16px] bg-[#FFF0F0] px-4 py-3 text-xs font-medium text-[#B33939]'
            role='alert'>
            {paymentError}
          </p>
        )}

        <div className='mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row'>
          {canRetryVnpay && (
            <Button
              onClick={() => void retryPayment()}
              isDisabled={vnpayPayment.isPending}
              className='h-12! w-auto! min-w-[190px]! rounded-full! px-8! text-sm!'>
              {vnpayPayment.isPending ? 'Opening VNPAY…' : 'Retry payment'}
            </Button>
          )}
          <Button
            onClick={onFinish}
            className={`h-12! w-auto! min-w-[180px]! rounded-full! px-8! text-sm! ${
              canRetryVnpay
                ? 'border border-[#0D4949]! bg-white! text-[#0D4949]!'
                : ''
            }`}>
            View rooms
          </Button>
        </div>
      </div>
    </section>
  );
}
