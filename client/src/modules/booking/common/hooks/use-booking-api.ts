import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createBookingApi,
  getBookingDetailsApi,
  getMyBookingsApi,
} from '../apis';

export const useCreateBookingApi = () =>
  useMutation({ mutationFn: createBookingApi });

export const useBookingDetailsApi = (bookingId: string | null) =>
  useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBookingDetailsApi(bookingId!),
    enabled: Boolean(bookingId),
    retry: false,
    refetchInterval: (query) =>
      query.state.data?.paymentStatus === 'pending' ? 2500 : false,
  });

export const useMyBookingsApi = () =>
  useQuery({
    queryKey: ['bookings', 'mine'],
    queryFn: getMyBookingsApi,
    retry: false,
  });
