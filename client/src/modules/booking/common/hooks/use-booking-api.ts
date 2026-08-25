import { useMutation, useQuery } from '@tanstack/react-query';
import { createBookingApi, getBookingDetailsApi } from '../apis';

export const useCreateBookingApi = () =>
  useMutation({ mutationFn: createBookingApi });

export const useBookingDetailsApi = (bookingId: string | null) =>
  useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBookingDetailsApi(bookingId!),
    enabled: Boolean(bookingId),
    retry: false,
  });
