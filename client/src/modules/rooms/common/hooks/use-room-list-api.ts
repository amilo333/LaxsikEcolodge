import { TPaginationResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getRoomListApi } from '../apis';
import { TRoom } from '../types';

export const useRoomListApi = () => {
  return useQuery<TPaginationResponse<TRoom[]>>({
    queryKey: ['roomList'],
    queryFn: getRoomListApi,
  });
};
