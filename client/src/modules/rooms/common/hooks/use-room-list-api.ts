import { TPaginationResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getAvailableRoomsApi, getRoomListApi, TRoomListParams } from '../apis';
import { TRoom } from '../types';

export const useRoomListApi = (
  params: TRoomListParams = { page: 1, limit: 10 },
  enabled = true
) => {
  return useQuery<TPaginationResponse<TRoom[]>>({
    queryKey: ['roomList', params],
    queryFn: () => getRoomListApi(params),
    enabled,
  });
};

type TAvailableRoomsSearch = {
  checkInDate?: string | null;
  checkOutDate?: string | null;
  guests?: string | null;
  rooms?: string | null;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
};

export const useAvailableRoomsApi = (
  search: TAvailableRoomsSearch,
  enabled = true
) => {
  const {
    checkInDate,
    checkOutDate,
    guests,
    rooms,
    page,
    limit,
    minPrice,
    maxPrice,
  } = search;
  const canSearch = enabled && Boolean(checkInDate && checkOutDate);

  return useQuery({
    queryKey: [
      'availableRooms',
      checkInDate,
      checkOutDate,
      guests,
      rooms,
      page,
      limit,
      minPrice,
      maxPrice,
    ],
    queryFn: () =>
      getAvailableRoomsApi({
        checkInDate: checkInDate!,
        checkOutDate: checkOutDate!,
        ...(guests ? { guests } : {}),
        ...(rooms ? { rooms } : {}),
        ...(page ? { page } : {}),
        ...(limit ? { limit } : {}),
        ...(minPrice !== undefined ? { minPrice } : {}),
        ...(maxPrice !== undefined ? { maxPrice } : {}),
      }),
    enabled: canSearch,
  });
};
