import { TPaginationResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getAvailableRoomsApi, getRoomListApi } from '../apis';
import { TRoom } from '../types';

export const useRoomListApi = (enabled = true) => {
  return useQuery<TPaginationResponse<TRoom[]>>({
    queryKey: ['roomList'],
    queryFn: getRoomListApi,
    enabled,
  });
};

type TAvailableRoomsSearch = {
  checkInDate?: string | null;
  checkOutDate?: string | null;
  guests?: string | null;
  rooms?: string | null;
};

export const useAvailableRoomsApi = (
  search: TAvailableRoomsSearch,
  enabled = true
) => {
  const { checkInDate, checkOutDate, guests, rooms } = search;
  const canSearch = enabled && Boolean(checkInDate && checkOutDate);

  return useQuery({
    queryKey: ['availableRooms', checkInDate, checkOutDate, guests, rooms],
    queryFn: () =>
      getAvailableRoomsApi({
        checkInDate: checkInDate!,
        checkOutDate: checkOutDate!,
        ...(guests ? { guests } : {}),
        ...(rooms ? { rooms } : {}),
      }),
    enabled: canSearch,
  });
};
