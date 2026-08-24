import { axiosInstance } from '@/apis/axios';
import { TVoucher } from '../types';

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
