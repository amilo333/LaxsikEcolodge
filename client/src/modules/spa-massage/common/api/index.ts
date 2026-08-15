import { axiosInstance } from '@/apis/axios';

export const getSpaList = async () => {
  const response = await axiosInstance.get('/spa-massage');
  return response.data;
};
