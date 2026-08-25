import { TUser } from '@/modules/auth/common';
import { TBooking } from '@/modules/booking/common/types';
import { TRoom } from '@/modules/rooms/common/types';

export type TAdminSection = 'overview' | 'users' | 'rooms' | 'bookings';

export type TAdminListParams = {
  page: number;
  limit: number;
  search?: string;
};

export type TAdminUser = TUser & {
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TUpdateAdminUserPayload = Partial<
  Pick<TAdminUser, 'full_name' | 'email' | 'phone' | 'role' | 'status'>
>;

export type TAdminBooking = TBooking & {
  userId: TAdminUser | null;
};

export type TAdminSummary = {
  totalUsers: number;
  activeUsers: number;
  totalRooms: number;
  availableRooms: number;
  totalBookings: number;
  pendingBookings: number;
  paidRevenue: number;
  recentBookings: TAdminBooking[];
};

export type TUpdateAdminBookingPayload = Partial<
  Pick<TBooking, 'bookingStatus' | 'paymentStatus'>
>;

export type TAdminRoomPayload = Pick<
  TRoom,
  | 'title'
  | 'description'
  | 'price'
  | 'bed'
  | 'area'
  | 'capacity'
  | 'quantity'
  | 'status'
  | 'bathroom'
  | 'fireplace'
  | 'views'
>;
