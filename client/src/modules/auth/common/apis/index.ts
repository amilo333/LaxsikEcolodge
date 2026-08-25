import { axiosInstance } from '@/apis/axios';
import { LoginRequest, RegisterRequest } from '@/types/auth';
import { TUpdateProfilePayload, TUser } from '../types';

type TAuthResponse = {
  message: string;
  data: TUser;
};

export const registerApi = async (data: RegisterRequest) => {
  const res = await axiosInstance.post<TAuthResponse>('/auth/register', data);
  return res;
};

export const loginApi = async (data: LoginRequest) => {
  const res = await axiosInstance.post<TAuthResponse>('/auth/login', data);
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

export const updateProfileApi = async (data: TUpdateProfilePayload) => {
  const res = await axiosInstance.put<TUser>('/user/profile', data);
  return res.data;
};
