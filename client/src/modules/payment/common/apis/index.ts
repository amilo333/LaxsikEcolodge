import { axiosInstance } from '@/apis/axios';
import {
  TCreateVnpayPaymentPayload,
  TVnpayPayment,
  TVnpayPaymentStatus,
} from '../types';

type TCreateVnpayPaymentResponse = {
  message: string;
  data: TVnpayPayment;
};

export const createVnpayPaymentApi = async (
  payload: TCreateVnpayPaymentPayload
) => {
  const response = await axiosInstance.post<TCreateVnpayPaymentResponse>(
    '/payments/vnpay/create',
    payload
  );

  return response.data.data;
};

type TVnpayPaymentStatusResponse = {
  message: string;
  data: TVnpayPaymentStatus;
};

export const getVnpayPaymentStatusApi = async (bookingId: string) => {
  const response = await axiosInstance.get<TVnpayPaymentStatusResponse>(
    `/payments/vnpay/status/${bookingId}`
  );

  return response.data.data;
};
