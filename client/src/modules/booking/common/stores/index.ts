import { create } from 'zustand';
import { TVoucher } from '../types';

type TInitializeBooking = {
  bookingKey: string;
  roomId: string | null;
  roomQuantity: number;
};

type TBookingStore = {
  bookingKey: string | null;
  quantities: Record<string, number>;
  voucherCode: string;
  appliedVoucher: TVoucher | null;
  voucherError: string;
  checkoutMessage: string;
  initializeBooking: (booking: TInitializeBooking) => void;
  setRoomQuantity: (roomId: string, quantity: number) => void;
  setVoucherCode: (code: string) => void;
  setVoucherError: (message: string) => void;
  applyVoucher: (voucher: TVoucher) => void;
  removeVoucher: () => void;
  setCheckoutMessage: (message: string) => void;
};

export const useBookingStore = create<TBookingStore>((set) => ({
  bookingKey: null,
  quantities: {},
  voucherCode: '',
  appliedVoucher: null,
  voucherError: '',
  checkoutMessage: '',

  initializeBooking: ({ bookingKey, roomId, roomQuantity }) =>
    set((state) => {
      if (state.bookingKey === bookingKey) return state;

      return {
        bookingKey,
        quantities: roomId ? { [roomId]: roomQuantity } : {},
        voucherCode: '',
        appliedVoucher: null,
        voucherError: '',
        checkoutMessage: '',
      };
    }),

  setRoomQuantity: (roomId, quantity) =>
    set((state) => ({
      quantities: { ...state.quantities, [roomId]: quantity },
      checkoutMessage: '',
    })),

  setVoucherCode: (voucherCode) =>
    set({ voucherCode: voucherCode.toUpperCase(), voucherError: '' }),

  setVoucherError: (voucherError) => set({ voucherError }),

  applyVoucher: (appliedVoucher) =>
    set({
      appliedVoucher,
      voucherCode: appliedVoucher.code,
      voucherError: '',
    }),

  removeVoucher: () =>
    set({ appliedVoucher: null, voucherCode: '', voucherError: '' }),

  setCheckoutMessage: (checkoutMessage) => set({ checkoutMessage }),
}));
