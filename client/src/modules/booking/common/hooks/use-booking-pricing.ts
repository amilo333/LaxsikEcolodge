import { SERVICE_CHARGE_RATE, TAX_RATE } from '../constants';
import { useBookingStore } from '../stores';
import { TAvailableRoom, TBookingPricing } from '../types';

export const useBookingPricing = (
  rooms: TAvailableRoom[],
  numberOfNights: number
): TBookingPricing => {
  const quantities = useBookingStore((state) => state.quantities);
  const appliedVoucher = useBookingStore((state) => state.appliedVoucher);

  const selectedRoomCount = rooms.reduce(
    (total, room) => total + (quantities[room._id] ?? 0),
    0
  );

  const subtotal = rooms.reduce(
    (total, room) =>
      total + (quantities[room._id] ?? 0) * room.price * numberOfNights,
    0
  );

  const discountAmount = appliedVoucher
    ? Math.min(
        subtotal,
        appliedVoucher.discountType === 'percent'
          ? (subtotal * appliedVoucher.discountValue) / 100
          : appliedVoucher.discountValue
      )
    : 0;

  const amountAfterDiscount = Math.max(0, subtotal - discountAmount);
  const serviceCharge = amountAfterDiscount * SERVICE_CHARGE_RATE;
  const taxAmount = amountAfterDiscount * TAX_RATE;

  return {
    subtotal,
    discountAmount,
    serviceCharge,
    taxAmount,
    totalAmount: amountAfterDiscount + serviceCharge + taxAmount,
    selectedRoomCount,
  };
};
