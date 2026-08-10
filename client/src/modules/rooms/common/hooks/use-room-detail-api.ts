import { useQuery } from '@tanstack/react-query';
import { getRoomDetailsApi } from '../apis';

export const useRoomDetailApi = (roomId?: string) => {
  return useQuery({
    queryKey: ['room-detail', roomId],
    queryFn: () => getRoomDetailsApi(roomId!),
    enabled: !!roomId,
  });
};
