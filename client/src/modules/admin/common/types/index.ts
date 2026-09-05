import { TUser } from '@/modules/auth/common';
import { TBooking } from '@/modules/booking/common/types';
import { TRoom } from '@/modules/rooms/common/types';

export type TAdminSection =
  | 'overview'
  | 'users'
  | 'rooms'
  | 'tours'
  | 'bookings'
  | 'vouchers'
  | 'dining'
  | 'spa';

export type TAdminListParams = {
  page: number;
  limit: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type TAdminUser = Omit<TUser, 'phone'> & {
  phone: string | null;
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
  bookingTrend: Array<{
    month: string;
    label: string;
    bookings: number;
    guests: number;
    paidRevenue: number;
  }>;
  bookingStatus: Array<{
    status: TBooking['bookingStatus'];
    count: number;
  }>;
  currentMonthRevenue: number;
  revenueGrowthPercent: number | null;
  currentMonthBookings: number;
  bookingGrowthPercent: number | null;
  currentMonthPaidBookings: number;
  averageBookingValue: number;
  occupancyRate: number;
  occupiedRoomNights: number;
  availableRoomNights: number;
  roomPerformance: Array<{
    roomId: string;
    title: string;
    bookings: number;
    bookedRoomNights: number;
    availableRoomNights: number;
    occupancyRate: number;
  }>;
  checkInsToday: number;
  checkOutsToday: number;
  unpaidBookings: number;
  maintenanceRooms: number;
};

export type TAdminExperienceKind = 'dining' | 'spa';

export type TAdminVoucher = {
  _id: string;
  code: string;
  discountType: 'percent' | 'amount';
  discountValue: number;
  quantity: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};

export type TAdminVoucherPayload = Pick<
  TAdminVoucher,
  | 'code'
  | 'discountType'
  | 'discountValue'
  | 'quantity'
  | 'startDate'
  | 'endDate'
  | 'status'
>;

export type TAdminExperience = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  images?: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};

export type TAdminExperienceService = {
  _id: string;
  title: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive';
  diningId?: string | Pick<TAdminExperience, '_id' | 'title' | 'thumbnail'>;
  spaId?: string | Pick<TAdminExperience, '_id' | 'title' | 'thumbnail'>;
  createdAt: string;
  updatedAt: string;
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
