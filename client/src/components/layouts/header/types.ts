export type TBookingBarFindForm = {
  checkinDate?: string;
  checkoutDate?: string;
  guest?: string;
  promoCode?: string;
};

export type TBookingBarProps = {
  onClickHide: () => void;
};

export type TNavbarProps = {
  onClickFind: () => void;
};
