'use client';

import { Button } from '@/components/core';
import {
  getPaymentErrorMessage,
  useStartVnpayPayment,
  useVnpayPaymentStatusApi,
} from '@/modules/payment/common';
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
        ? 'VNPAY'
        : 'Bank transfer';
  const statusIcon = paymentFailed ? '!' : paymentPending ? '…' : '✓';
  const statusIconClass = paymentFailed
    ? 'bg-[#B33939]'
    : paymentPending
      ? 'bg-[#B87918]'
      : 'bg-[#0D4949]';

  const retryPayment = async () => {
    setPaymentError('');

    try {
      await vnpayPayment.startPayment(booking._id);
    } catch (error) {
      setPaymentError(getPaymentErrorMessage(error));
    }
  };

  return (
    <section className='mx-auto w-[calc(100%-32px)] max-w-[860px] py-8 sm:py-12'>
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

        <div className='mx-auto mt-7 grid max-w-[700px] gap-4 text-left sm:grid-cols-2'>
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

          <div className='rounded-[16px] bg-[#F4F7F6] p-5'>
            <p className='text-[10px] font-bold text-[#69726E] uppercase'>
              Payment
            </p>
            <p className='mt-2 text-sm font-bold capitalize'>
              {paymentMethodLabel}
            </p>
            <p className='mt-1 text-xs text-[#68726E] capitalize'>
              Status: {booking.paymentStatus}
            </p>
          </div>
        </div>

        <div className='mx-auto mt-4 max-w-[700px] rounded-[16px] border border-[#E1E8E5] p-5 text-left'>
          <div className='flex items-center justify-between gap-4 border-b border-[#E6EBE9] pb-4'>
            <p className='text-xs font-bold uppercase'>Rooms</p>
            <p className='text-lg font-bold'>
              {formatCurrency(booking.totalAmount)}
            </p>
          </div>
          <div className='divide-y divide-[#E6EBE9]'>
            {booking.bookingItems.map((item, index) => {
              const room = typeof item.roomId === 'string' ? null : item.roomId;

              return (
                <div
                  key={room?._id ?? `${item.pricePerNight}-${index}`}
                  className='flex justify-between gap-4 py-3 text-xs'>
                  <span className='font-semibold'>
                    {item.quantity} × {room?.title ?? 'Reserved room'}
                  </span>
                  <span>
                    {formatCurrency(
                      item.pricePerNight * item.quantity * booking.totalNights
                    )}
                  </span>
                </div>
              );
            })}
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
