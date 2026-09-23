import { DEPOSIT_RATE } from '../constants';
import type { TBooking } from '../types';

export const getNightCount = (checkInDate: string, checkOutDate: string) => {
  const checkIn = new Date(`${checkInDate}T00:00:00`);
  const checkOut = new Date(`${checkOutDate}T00:00:00`);

  return Math.max(
    1,
    Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86_400_000)
  );
};

export const formatStayDate = (date: string, locale = 'en-US') =>
  new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date.slice(0, 10)}T00:00:00`));

export { formatCurrency } from '@/utils/currency';

export const getBookingPaymentAmounts = (booking: TBooking) => {
  const depositAmount =
    booking.depositAmount ?? Math.round(booking.totalAmount * DEPOSIT_RATE);
  const paidAmount =
    booking.paidAmount ??
    (booking.paymentStatus === 'paid'
      ? booking.totalAmount
      : booking.paymentStatus === 'deposit_paid'
        ? depositAmount
        : 0);

  return {
    depositAmount,
    paidAmount,
    remainingAmount: Math.max(0, booking.totalAmount - paidAmount),
    balanceAfterDeposit: booking.totalAmount - depositAmount,
  };
};
