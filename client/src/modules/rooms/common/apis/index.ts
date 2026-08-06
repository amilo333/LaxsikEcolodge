import { axiosInstance } from '@/apis/axios';

export const getRoomListApi = async () => {
  const response = await axiosInstance.get('/rooms');
  return response.data;
};
