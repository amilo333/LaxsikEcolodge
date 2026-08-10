import { axiosInstance } from '@/apis/axios';
import { TRoom } from '../types';

export const getRoomListApi = async () => {
  const response = await axiosInstance.get('/rooms');
  return response.data;
};

export const getRoomDetailsApi = async (roomId: string) => {
  const response = await axiosInstance.get<{ success: boolean; room: TRoom }>(
    `/rooms/${roomId}`
  );
  return response.data.room;
};
