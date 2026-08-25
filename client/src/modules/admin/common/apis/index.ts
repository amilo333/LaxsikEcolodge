import { axiosInstance } from '@/apis/axios';
import { TPaginationResponse } from '@/types';
import { TRoom } from '@/modules/rooms/common/types';
import {
  TAdminBooking,
  TAdminListParams,
  TAdminRoomPayload,
  TAdminSummary,
  TAdminUser,
  TUpdateAdminBookingPayload,
  TUpdateAdminUserPayload,
} from '../types';

type TDataResponse<TData> = {
  message: string;
  data: TData;
};

export const getAdminUsersApi = async (params: TAdminListParams) => {
  const response = await axiosInstance.get<TPaginationResponse<TAdminUser[]>>(
    '/user',
    { params }
  );
  return response.data;
};

export const updateAdminUserApi = async ({
  userId,
  data,
}: {
  userId: string;
  data: TUpdateAdminUserPayload;
}) => {
  const response = await axiosInstance.put<TAdminUser>(`/user/${userId}`, data);
  return response.data;
};

export const deleteAdminUserApi = async (userId: string) => {
  const response = await axiosInstance.delete<{ message: string }>(
    `/user/${userId}`
  );
  return response.data;
};

export const getAdminRoomsApi = async (params: TAdminListParams) => {
  const response = await axiosInstance.get<TPaginationResponse<TRoom[]>>(
    '/rooms',
    { params }
  );
  return response.data;
};

export const createAdminRoomApi = async (data: FormData) => {
  const response = await axiosInstance.post<TDataResponse<TRoom>>(
    '/rooms',
    data
  );
  return response.data.data;
};

export const updateAdminRoomApi = async ({
  roomId,
  data,
}: {
  roomId: string;
  data: TAdminRoomPayload;
}) => {
  const response = await axiosInstance.put<{
    success: boolean;
    message: string;
    room: TRoom;
  }>(`/rooms/${roomId}`, data);
  return response.data.room;
};

export const deleteAdminRoomApi = async (roomId: string) => {
  const response = await axiosInstance.delete<{
    success: boolean;
    message: string;
  }>(`/rooms/${roomId}`);
  return response.data;
};

export const getAdminBookingsApi = async (params: TAdminListParams) => {
  const response = await axiosInstance.get<
    TPaginationResponse<TAdminBooking[]>
  >('/booking/admin', { params });
  return response.data;
};

export const getAdminSummaryApi = async () => {
  const response = await axiosInstance.get<TDataResponse<TAdminSummary>>(
    '/booking/admin/summary'
  );
  return response.data.data;
};

export const updateAdminBookingApi = async ({
  bookingId,
  data,
}: {
  bookingId: string;
  data: TUpdateAdminBookingPayload;
}) => {
  const response = await axiosInstance.put<TDataResponse<TAdminBooking>>(
    `/booking/admin/${bookingId}`,
    data
  );
  return response.data.data;
};
