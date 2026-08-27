import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import {
  cancelBookingApi,
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

export const useCancelBookingApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelBookingApi,
    onSuccess: (booking) => {
      queryClient.setQueryData(['booking', booking._id], booking);
      void queryClient.invalidateQueries({ queryKey: ['bookings', 'mine'] });
      toast.success('Đã hủy đặt phòng thành công.');
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : null;

      toast.error(message ?? 'Không thể hủy đặt phòng. Vui lòng thử lại.');
    },
  });
};
