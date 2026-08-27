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

export type TPaymentMethod = 'banking' | 'vnpay' | 'momo';
export type TCheckoutPaymentMethod = 'vnpay';

export type TBookingCustomerInfo = {
  fullNameContact: string;
  phoneContact: string;
  emailContact: string;
  note: string;
};

export type TBookingDetailsForm = TBookingCustomerInfo & {
  paymentMethod: TCheckoutPaymentMethod;
  acceptTerms: boolean;
};

export type TCreateBookingPayload = {
  bookingItems: Array<{
    roomId: string;
    quantity: number;
  }>;
  checkInDate: string;
  checkOutDate: string;
  voucherCode?: string;
  paymentMethod: TCheckoutPaymentMethod;
  customerInfo: TBookingCustomerInfo;
};

export type TBookingItem = {
  roomId: string | TRoom;
  quantity: number;
  pricePerNight: number;
};

export type TBooking = {
  _id: string;
  bookingCode: string;
  bookingItems: TBookingItem[];
  checkInDate: string;
  checkOutDate: string;
  totalNights: number;
  subtotal: number;
  voucherId: string | TVoucher | null;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: TPaymentMethod;
  customerInfo: TBookingCustomerInfo;
  createdAt: string;
};
