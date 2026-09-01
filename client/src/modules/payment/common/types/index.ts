type TPaymentProvider = 'vnpay';

export type TVnpayPayment = {
  paymentId: string;
  bookingId: string;
  orderId: string;
  amount: number;
  payUrl: string;
};

export type TCreateVnpayPaymentPayload = {
  bookingId: string;
  bankCode?: string;
};

export type TPaymentHandoff = {
  provider: TPaymentProvider;
  bookingId: string;
  paymentId: string;
  orderId: string;
  createdAt: string;
};

export type TVnpayPaymentStatus = {
  bookingId: string;
  paymentStatus: 'pending' | 'success' | 'failed' | 'refunded';
};
