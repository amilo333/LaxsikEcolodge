import { axiosInstance } from '@/apis/axios';

export const getDiningList = async () => {
  const response = await axiosInstance.get('/dining');
  return response.data;
};
