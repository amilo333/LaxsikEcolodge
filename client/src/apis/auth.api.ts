import { axiosInstance } from './axios';
import { LoginRequest, RegisterRequest } from '@/types/auth';

export const registerApi = async (data: RegisterRequest) => {
  const res = await axiosInstance.post('/user', data);
  return res;
};

export const loginApi = async (data: LoginRequest) => {
  const res = await axiosInstance.post('/user/auth', data);
  return res;
};

export const logoutApi = async () => {
  const res = await axiosInstance.post('/user/logout');
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
