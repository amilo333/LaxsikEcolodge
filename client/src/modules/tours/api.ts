import { axiosInstance } from '@/apis/axios';
import { TPaginationResponse } from '@/types';
import { TTour } from './types';

export const getTourListApi = async () => {
  const response = await axiosInstance.get<TPaginationResponse<TTour[]>>(
    '/tours',
    {
      params: { status: 'active', limit: 100 },
    }
  );

  return response.data;
};
