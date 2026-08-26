import { axiosInstance } from '@/apis/axios';

export const getDiningList = async () => {
  const response = await axiosInstance.get('/dining', {
    params: { status: 'active', limit: 100 },
  });
  return response.data;
};

export const getDiningServices = async () => {
  const response = await axiosInstance.get('/dining-services', {
    params: { status: 'active', limit: 100 },
  });
  return response.data;
};
