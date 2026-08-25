'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import {
  createAdminRoomApi,
  deleteAdminRoomApi,
  deleteAdminUserApi,
  getAdminBookingsApi,
  getAdminRoomsApi,
  getAdminSummaryApi,
  getAdminUsersApi,
  updateAdminBookingApi,
  updateAdminRoomApi,
  updateAdminUserApi,
} from '../apis';
import { TAdminListParams } from '../types';

const showAdminError = (error: unknown) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    toast.error(
      error.response?.data?.message ?? 'Không thể thực hiện thao tác.'
    );
    return;
  }

  toast.error('Không thể thực hiện thao tác.');
};

export const useAdminUsersApi = (params: TAdminListParams) =>
  useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => getAdminUsersApi(params),
    placeholderData: (previousData) => previousData,
    retry: false,
  });

export const useUpdateAdminUserApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminUserApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'summary'] });
      toast.success('Đã cập nhật người dùng.');
    },
    onError: showAdminError,
  });
};

export const useDeleteAdminUserApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminUserApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'summary'] });
      toast.success('Đã xóa người dùng.');
    },
    onError: showAdminError,
  });
};

export const useAdminRoomsApi = (params: TAdminListParams) =>
  useQuery({
    queryKey: ['admin', 'rooms', params],
    queryFn: () => getAdminRoomsApi(params),
    placeholderData: (previousData) => previousData,
    retry: false,
  });

export const useCreateAdminRoomApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminRoomApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'rooms'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'summary'] });
      void queryClient.invalidateQueries({ queryKey: ['roomList'] });
      toast.success('Đã tạo phòng.');
    },
    onError: showAdminError,
  });
};

export const useUpdateAdminRoomApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminRoomApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'rooms'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'summary'] });
      void queryClient.invalidateQueries({ queryKey: ['roomList'] });
      toast.success('Đã cập nhật phòng.');
    },
    onError: showAdminError,
  });
};

export const useDeleteAdminRoomApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminRoomApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'rooms'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'summary'] });
      void queryClient.invalidateQueries({ queryKey: ['roomList'] });
      toast.success('Đã xóa phòng.');
    },
    onError: showAdminError,
  });
};

export const useAdminBookingsApi = (params: TAdminListParams) =>
  useQuery({
    queryKey: ['admin', 'bookings', params],
    queryFn: () => getAdminBookingsApi(params),
    placeholderData: (previousData) => previousData,
    retry: false,
  });

export const useAdminSummaryApi = () =>
  useQuery({
    queryKey: ['admin', 'summary'],
    queryFn: getAdminSummaryApi,
    retry: false,
  });

export const useUpdateAdminBookingApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminBookingApi,
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'summary'] });
      void queryClient.invalidateQueries({
        queryKey: ['booking', variables.bookingId],
      });
      toast.success('Đã cập nhật booking.');
    },
    onError: showAdminError,
  });
};
