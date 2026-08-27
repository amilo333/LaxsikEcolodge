import { axiosInstance } from '@/apis/axios';
import { TPagination, TPaginationResponse } from '@/types';
import { TRoom } from '../types';

export type TRoomListParams = {
  page: number;
  limit: number;
  minPrice?: number;
  maxPrice?: number;
};

export const getRoomListApi = async (params: TRoomListParams) => {
  const response = await axiosInstance.get<TPaginationResponse<TRoom[]>>(
    '/rooms',
    { params }
  );
  return response.data;
};

export type TAvailableRoomsParams = {
  checkInDate: string;
  checkOutDate: string;
  guests?: string;
  rooms?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
};

export type TAvailableRoomsResponse = {
  success: boolean;
  message: string;
  data: TRoom[];
  pagination?: TPagination;
};

export const getAvailableRoomsApi = async (params: TAvailableRoomsParams) => {
  const response = await axiosInstance.get<TAvailableRoomsResponse>(
    '/rooms/available',
    { params }
  );
  return response.data;
};

export const getRoomDetailsApi = async (roomId: string) => {
  const response = await axiosInstance.get<{ success: boolean; room: TRoom }>(
    `/rooms/${roomId}`
  );
  return response.data.room;
};
