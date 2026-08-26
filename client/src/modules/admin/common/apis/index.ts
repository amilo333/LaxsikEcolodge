import { axiosInstance } from '@/apis/axios';
import { TPaginationResponse } from '@/types';
import { TRoom } from '@/modules/rooms/common/types';
import {
  TAdminBooking,
  TAdminExperience,
  TAdminExperienceKind,
  TAdminExperienceService,
  TAdminListParams,
  TAdminRoomPayload,
  TAdminSummary,
  TAdminUser,
  TAdminVoucher,
  TAdminVoucherPayload,
  TUpdateAdminBookingPayload,
  TUpdateAdminUserPayload,
} from '../types';

type TDataResponse<TData> = {
  message: string;
  data: TData;
};

export const getAdminUsersApi = async (params: TAdminListParams) => {
  const response = await axiosInstance.get<TPaginationResponse<TAdminUser[]>>(
    '/user',
    { params }
  );
  return response.data;
};

export const updateAdminUserApi = async ({
  userId,
  data,
}: {
  userId: string;
  data: TUpdateAdminUserPayload;
}) => {
  const response = await axiosInstance.put<TAdminUser>(`/user/${userId}`, data);
  return response.data;
};

export const deleteAdminUserApi = async (userId: string) => {
  const response = await axiosInstance.delete<{ message: string }>(
    `/user/${userId}`
  );
  return response.data;
};

export const getAdminRoomsApi = async (params: TAdminListParams) => {
  const response = await axiosInstance.get<TPaginationResponse<TRoom[]>>(
    '/rooms',
    { params }
  );
  return response.data;
};

export const createAdminRoomApi = async (data: FormData) => {
  const response = await axiosInstance.post<TDataResponse<TRoom>>(
    '/rooms',
    data
  );
  return response.data.data;
};

export const updateAdminRoomApi = async ({
  roomId,
  data,
}: {
  roomId: string;
  data: TAdminRoomPayload;
}) => {
  const response = await axiosInstance.put<{
    success: boolean;
    message: string;
    room: TRoom;
  }>(`/rooms/${roomId}`, data);
  return response.data.room;
};

export const deleteAdminRoomApi = async (roomId: string) => {
  const response = await axiosInstance.delete<{
    success: boolean;
    message: string;
  }>(`/rooms/${roomId}`);
  return response.data;
};

export const getAdminBookingsApi = async (params: TAdminListParams) => {
  const response = await axiosInstance.get<
    TPaginationResponse<TAdminBooking[]>
  >('/booking/admin', { params });
  return response.data;
};

export const getAdminSummaryApi = async () => {
  const response = await axiosInstance.get<TDataResponse<TAdminSummary>>(
    '/booking/admin/summary'
  );
  return response.data.data;
};

export const getAdminVouchersApi = async (params: TAdminListParams) => {
  const response = await axiosInstance.get<
    TPaginationResponse<TAdminVoucher[]>
  >('/voucher', { params });
  return response.data;
};

export const createAdminVoucherApi = async (data: TAdminVoucherPayload) => {
  const response = await axiosInstance.post<TDataResponse<TAdminVoucher>>(
    '/voucher',
    data
  );
  return response.data.data;
};

export const updateAdminVoucherApi = async ({
  voucherId,
  data,
}: {
  voucherId: string;
  data: TAdminVoucherPayload;
}) => {
  const response = await axiosInstance.put<TDataResponse<TAdminVoucher>>(
    `/voucher/${voucherId}`,
    data
  );
  return response.data.data;
};

export const deleteAdminVoucherApi = async (voucherId: string) => {
  const response = await axiosInstance.delete<{ message: string }>(
    `/voucher/${voucherId}`
  );
  return response.data;
};

const experienceConfig: Record<
  TAdminExperienceKind,
  { resource: string; services: string; parentField: 'diningId' | 'spaId' }
> = {
  dining: {
    resource: '/dining',
    services: '/dining-services',
    parentField: 'diningId',
  },
  spa: {
    resource: '/spa-massage',
    services: '/spa-services',
    parentField: 'spaId',
  },
};

export const getAdminExperiencesApi = async ({
  kind,
  params,
}: {
  kind: TAdminExperienceKind;
  params: TAdminListParams;
}) => {
  const response = await axiosInstance.get<
    TPaginationResponse<TAdminExperience[]>
  >(experienceConfig[kind].resource, { params });
  return response.data;
};

export const createAdminExperienceApi = async ({
  kind,
  data,
}: {
  kind: TAdminExperienceKind;
  data: FormData;
}) => {
  const response = await axiosInstance.post<TDataResponse<TAdminExperience>>(
    experienceConfig[kind].resource,
    data
  );
  return response.data.data;
};

export const updateAdminExperienceApi = async ({
  kind,
  experienceId,
  data,
}: {
  kind: TAdminExperienceKind;
  experienceId: string;
  data: FormData;
}) => {
  const response = await axiosInstance.put<{
    success: boolean;
    dining?: TAdminExperience;
    spa?: TAdminExperience;
  }>(`${experienceConfig[kind].resource}/${experienceId}`, data);
  return response.data.dining ?? response.data.spa!;
};

export const deleteAdminExperienceApi = async ({
  kind,
  experienceId,
}: {
  kind: TAdminExperienceKind;
  experienceId: string;
}) => {
  const response = await axiosInstance.delete<{ message: string }>(
    `${experienceConfig[kind].resource}/${experienceId}`
  );
  return response.data;
};

export const getAdminExperienceServicesApi = async ({
  kind,
  params,
}: {
  kind: TAdminExperienceKind;
  params: TAdminListParams & { parentId?: string };
}) => {
  const config = experienceConfig[kind];
  const { parentId, ...listParams } = params;
  const response = await axiosInstance.get<
    TPaginationResponse<TAdminExperienceService[]>
  >(config.services, {
    params: {
      ...listParams,
      ...(parentId ? { [config.parentField]: parentId } : {}),
    },
  });
  return response.data;
};

export const createAdminExperienceServiceApi = async ({
  kind,
  data,
}: {
  kind: TAdminExperienceKind;
  data: FormData;
}) => {
  const response = await axiosInstance.post<
    TDataResponse<TAdminExperienceService>
  >(experienceConfig[kind].services, data);
  return response.data.data;
};

export const updateAdminExperienceServiceApi = async ({
  kind,
  serviceId,
  data,
}: {
  kind: TAdminExperienceKind;
  serviceId: string;
  data: FormData;
}) => {
  const response = await axiosInstance.put<{
    success: boolean;
    service: TAdminExperienceService;
  }>(`${experienceConfig[kind].services}/${serviceId}`, data);
  return response.data.service;
};

export const deleteAdminExperienceServiceApi = async ({
  kind,
  serviceId,
}: {
  kind: TAdminExperienceKind;
  serviceId: string;
}) => {
  const response = await axiosInstance.delete<{ message: string }>(
    `${experienceConfig[kind].services}/${serviceId}`
  );
  return response.data;
};

export const updateAdminBookingApi = async ({
  bookingId,
  data,
}: {
  bookingId: string;
  data: TUpdateAdminBookingPayload;
}) => {
  const response = await axiosInstance.put<TDataResponse<TAdminBooking>>(
    `/booking/admin/${bookingId}`,
    data
  );
  return response.data.data;
};
