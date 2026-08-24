import type { CalendarDate } from '@internationalized/date';

export type TBookingBarFindForm = {
  checkinDate?: CalendarDate | null;
  checkoutDate?: CalendarDate | null;
  guest?: string;
  promoCode?: string;
};

export type TBookingBarProps = {
  onClickHide: () => void;
};

export type TNavbarProps = {
  onClickFind: () => void;
  isBookingBarVisible: boolean;
};
