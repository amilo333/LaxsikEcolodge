import { axiosInstance } from '@/apis/axios';
import {
  ForgotPasswordRequest,
  GoogleAccountLinkRequest,
  GoogleLoginRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '@/types/auth';
import { TUpdateProfilePayload, TUser } from '../types';

export type TAuthResponse = {
  message: string;
  data: TUser;
};

export type TMessageResponse = {
  message: string;
};

export const registerApi = async (data: RegisterRequest) => {
  const res = await axiosInstance.post<TAuthResponse>('/auth/register', data);
  return res;
};

export const loginApi = async (data: LoginRequest) => {
  const res = await axiosInstance.post<TAuthResponse>('/auth/login', data);
  return res;
};

export const googleLoginApi = async (data: GoogleLoginRequest) => {
  const res = await axiosInstance.post<TAuthResponse>('/auth/google', data);
  return res;
};

export const linkGoogleAccountApi = async (data: GoogleAccountLinkRequest) => {
  const res = await axiosInstance.post<TAuthResponse>(
    '/auth/google/link',
    data
  );
  return res;
};

export const forgotPasswordApi = async (data: ForgotPasswordRequest) => {
  const res = await axiosInstance.post<TMessageResponse>(
    '/auth/forgot-password',
    data
  );
  return res.data;
};

export const resetPasswordApi = async (data: ResetPasswordRequest) => {
  const res = await axiosInstance.post<TMessageResponse>(
    '/auth/reset-password',
    data
  );
  return res.data;
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
