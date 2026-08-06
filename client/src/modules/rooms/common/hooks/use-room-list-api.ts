import { useQuery } from '@tanstack/react-query';
import { getRoomListApi } from '../apis';

export const useRoomListApi = () => {
  return useQuery({
    queryKey: ['roomList'],
    queryFn: getRoomListApi,
  });
};
