import { axiosInstance } from '@/apis/axios';
import { LoginRequest, RegisterRequest } from '@/types/auth';

export const registerApi = async (data: RegisterRequest) => {
  const res = await axiosInstance.post('/auth/register', data);
  return res;
};

export const loginApi = async (data: LoginRequest) => {
  const res = await axiosInstance.post('/auth/login', data);
  return res;
};

export const logoutApi = async () => {
  const res = await axiosInstance.post('/auth/logout');
  return res.data;
};

export const getProfileApi = async () => {
  const res = await axiosInstance.get('/user/profile');
  return res.data;
};

export const updateProfileApi = async () => {
  const res = await axiosInstance.post('/user/profile');
  return res.data;
};
