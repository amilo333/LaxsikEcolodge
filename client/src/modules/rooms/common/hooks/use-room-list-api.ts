import { useQuery } from '@tanstack/react-query';
import { getRoomListApi } from '../apis';
import { TRoom } from '../types';

export const useRoomListApi = () => {
  return useQuery<TRoom[]>({
    queryKey: ['roomList'],
    queryFn: getRoomListApi,
  });
};
