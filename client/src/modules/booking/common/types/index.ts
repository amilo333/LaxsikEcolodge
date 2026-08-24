import { TRoom } from '@/modules/rooms/common/types';

export type TVoucher = {
  _id: string;
  code: string;
  discountType: 'percent' | 'amount';
  discountValue: number;
};

export type TAvailableRoom = TRoom & {
  availableQuantity?: number;
};

export type TBookingPricing = {
  subtotal: number;
  discountAmount: number;
  serviceCharge: number;
  totalAmount: number;
  selectedRoomCount: number;
};
