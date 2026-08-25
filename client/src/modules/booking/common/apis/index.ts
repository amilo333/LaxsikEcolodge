import { axiosInstance } from '@/apis/axios';
import {
  TBooking,
  TCreateBookingPayload,
  TPaymentInitiation,
  TVoucher,
} from '../types';

type TValidateVoucherResponse = {
  message: string;
  data: TVoucher;
};

export const validateVoucherApi = async (code: string) => {
  const response = await axiosInstance.post<TValidateVoucherResponse>(
    '/voucher/validate',
    { code }
  );

  return response.data.data;
};

type TBookingResponse = {
  message: string;
  data: TBooking;
};

type TCreateBookingResponse = TBookingResponse & {
  payment: TPaymentInitiation | null;
};

export const createBookingApi = async (payload: TCreateBookingPayload) => {
  const response = await axiosInstance.post<TCreateBookingResponse>(
    '/booking',
    payload
  );

  return {
    booking: response.data.data,
    payment: response.data.payment,
  };
};

export const getBookingDetailsApi = async (bookingId: string) => {
  const response = await axiosInstance.get<TBookingResponse>(
    `/booking/${bookingId}`
  );

  return response.data.data;
};
