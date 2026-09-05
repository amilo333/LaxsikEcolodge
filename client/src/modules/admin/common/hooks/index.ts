'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import {
  createAdminRoomApi,
  createAdminTourApi,
  createAdminExperienceApi,
  createAdminExperienceServiceApi,
  createAdminVoucherApi,
  deleteAdminExperienceApi,
  deleteAdminExperienceServiceApi,
  deleteAdminRoomApi,
  deleteAdminTourApi,
  deleteAdminUserApi,
  deleteAdminVoucherApi,
  getAdminBookingsApi,
  getAdminExperiencesApi,
  getAdminExperienceServicesApi,
  getAdminRoomsApi,
  getAdminToursApi,
  getAdminSummaryApi,
  getAdminUsersApi,
  getAdminVouchersApi,
  updateAdminBookingApi,
  updateAdminExperienceApi,
  updateAdminExperienceServiceApi,
  updateAdminRoomApi,
  updateAdminTourApi,
  updateAdminUserApi,
  updateAdminVoucherApi,
} from '../apis';
import {
  TAdminExperienceKind,
  TAdminListParams,
  TAdminVoucherPayload,
} from '../types';

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
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
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

export const useAdminToursApi = (params: TAdminListParams) =>
  useQuery({
    queryKey: ['admin', 'tours', params],
    queryFn: () => getAdminToursApi(params),
    placeholderData: (previousData) => previousData,
    retry: false,
  });

export const useCreateAdminTourApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminTourApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] });
      void queryClient.invalidateQueries({ queryKey: ['tourList'] });
      toast.success('Đã tạo tour.');
    },
    onError: showAdminError,
  });
};

export const useUpdateAdminTourApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminTourApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] });
      void queryClient.invalidateQueries({ queryKey: ['tourList'] });
      toast.success('Đã cập nhật tour.');
    },
    onError: showAdminError,
  });
};

export const useDeleteAdminTourApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminTourApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] });
      void queryClient.invalidateQueries({ queryKey: ['tourList'] });
      toast.success('Đã xóa tour.');
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

export const useAdminVouchersApi = (params: TAdminListParams) =>
  useQuery({
    queryKey: ['admin', 'vouchers', params],
    queryFn: () => getAdminVouchersApi(params),
    placeholderData: (previousData) => previousData,
    retry: false,
  });

export const useCreateAdminVoucherApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TAdminVoucherPayload) => createAdminVoucherApi(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'vouchers'] });
      toast.success('Đã tạo voucher.');
    },
    onError: showAdminError,
  });
};

export const useUpdateAdminVoucherApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      voucherId,
      data,
    }: {
      voucherId: string;
      data: TAdminVoucherPayload;
    }) => updateAdminVoucherApi({ voucherId, data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'vouchers'] });
      toast.success('Đã cập nhật voucher.');
    },
    onError: showAdminError,
  });
};

export const useDeleteAdminVoucherApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminVoucherApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'vouchers'] });
      toast.success('Đã xóa voucher.');
    },
    onError: showAdminError,
  });
};

export const useAdminExperiencesApi = (
  kind: TAdminExperienceKind,
  params: TAdminListParams
) =>
  useQuery({
    queryKey: ['admin', kind, 'items', params],
    queryFn: () => getAdminExperiencesApi({ kind, params }),
    placeholderData: (previousData) => previousData,
    retry: false,
  });

export const useCreateAdminExperienceApi = (kind: TAdminExperienceKind) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createAdminExperienceApi({ kind, data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', kind] });
      void queryClient.invalidateQueries({
        queryKey: [kind === 'dining' ? 'diningList' : 'spaList'],
      });
      toast.success(kind === 'dining' ? 'Đã tạo Dining.' : 'Đã tạo Spa.');
    },
    onError: showAdminError,
  });
};

export const useUpdateAdminExperienceApi = (kind: TAdminExperienceKind) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      experienceId,
      data,
    }: {
      experienceId: string;
      data: FormData;
    }) => updateAdminExperienceApi({ kind, experienceId, data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', kind] });
      void queryClient.invalidateQueries({
        queryKey: [kind === 'dining' ? 'diningList' : 'spaList'],
      });
      toast.success('Đã cập nhật nội dung.');
    },
    onError: showAdminError,
  });
};

export const useDeleteAdminExperienceApi = (kind: TAdminExperienceKind) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (experienceId: string) =>
      deleteAdminExperienceApi({ kind, experienceId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', kind] });
      void queryClient.invalidateQueries({
        queryKey: [kind === 'dining' ? 'diningList' : 'spaList'],
      });
      toast.success('Đã xóa nội dung.');
    },
    onError: showAdminError,
  });
};

export const useAdminExperienceServicesApi = (
  kind: TAdminExperienceKind,
  params: TAdminListParams & { parentId?: string }
) =>
  useQuery({
    queryKey: ['admin', kind, 'services', params],
    queryFn: () => getAdminExperienceServicesApi({ kind, params }),
    placeholderData: (previousData) => previousData,
    retry: false,
  });

export const useCreateAdminExperienceServiceApi = (
  kind: TAdminExperienceKind
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) =>
      createAdminExperienceServiceApi({ kind, data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', kind] });
      void queryClient.invalidateQueries({
        queryKey: [kind === 'dining' ? 'diningServices' : 'spaServices'],
      });
      toast.success('Đã tạo dịch vụ.');
    },
    onError: showAdminError,
  });
};

export const useUpdateAdminExperienceServiceApi = (
  kind: TAdminExperienceKind
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, data }: { serviceId: string; data: FormData }) =>
      updateAdminExperienceServiceApi({ kind, serviceId, data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', kind] });
      void queryClient.invalidateQueries({
        queryKey: [kind === 'dining' ? 'diningServices' : 'spaServices'],
      });
      toast.success('Đã cập nhật dịch vụ.');
    },
    onError: showAdminError,
  });
};

export const useDeleteAdminExperienceServiceApi = (
  kind: TAdminExperienceKind
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: string) =>
      deleteAdminExperienceServiceApi({ kind, serviceId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', kind] });
      void queryClient.invalidateQueries({
        queryKey: [kind === 'dining' ? 'diningServices' : 'spaServices'],
      });
      toast.success('Đã xóa dịch vụ.');
    },
    onError: showAdminError,
  });
};

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
