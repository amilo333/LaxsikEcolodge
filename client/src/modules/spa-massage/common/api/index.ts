import { axiosInstance } from '@/apis/axios';

export const getSpaList = async () => {
  const response = await axiosInstance.get('/spa-massage', {
    params: { status: 'active', limit: 100 },
  });
  return response.data;
};

export const getSpaServices = async () => {
  const response = await axiosInstance.get('/spa-services', {
    params: { status: 'active', limit: 100 },
  });
  return response.data;
};
