import { axiosInstance } from '@/apis/axios';
import { TBooking, TCreateBookingPayload, TVoucher } from '../types';

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

export const createBookingApi = async (payload: TCreateBookingPayload) => {
  const response = await axiosInstance.post<TBookingResponse>(
    '/booking',
    payload
  );

  return response.data.data;
};

export const getBookingDetailsApi = async (bookingId: string) => {
  const response = await axiosInstance.get<TBookingResponse>(
    `/booking/${bookingId}`
  );

  return response.data.data;
};

type TMyBookingsResponse = {
  message: string;
  data: TBooking[];
};

export const getMyBookingsApi = async () => {
  const response = await axiosInstance.get<TMyBookingsResponse>(
    '/booking/my-bookings'
  );

  return response.data.data;
};
