type TSearchParamsReader = {
  get: (name: string) => string | null;
};

const BOOKING_SEARCH_KEYS = [
  'checkInDate',
  'checkOutDate',
  'guests',
  'rooms',
] as const;

const toDateParam = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getDefaultStayDates = () => {
  const checkIn = new Date();
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 1);

  return {
    checkInDate: toDateParam(checkIn),
    checkOutDate: toDateParam(checkOut),
  };
};

export const createBookingSearchParams = (
  searchParams: TSearchParamsReader,
  options: { includeDefaultDates?: boolean } = {}
) => {
  const params = new URLSearchParams();

  BOOKING_SEARCH_KEYS.forEach((key) => {
    const value = searchParams.get(key);

    if (value) params.set(key, value);
  });

  const hasCompleteStayDates =
    params.has('checkInDate') && params.has('checkOutDate');

  if (!hasCompleteStayDates) {
    params.delete('checkInDate');
    params.delete('checkOutDate');

    if (options.includeDefaultDates) {
      const defaultDates = getDefaultStayDates();
      params.set('checkInDate', defaultDates.checkInDate);
      params.set('checkOutDate', defaultDates.checkOutDate);
    }
  }

  return params;
};

export const buildRoomDetailUrl = (
  roomId: string,
  searchParams: TSearchParamsReader
) => {
  const params = createBookingSearchParams(searchParams);
  const query = params.toString();

  return `/rooms/${roomId}${query ? `?${query}` : ''}`;
};

export const buildBookingUrl = (
  roomId: string,
  searchParams: TSearchParamsReader
) => {
  const params = createBookingSearchParams(searchParams, {
    includeDefaultDates: true,
  });
  params.set('roomId', roomId);

  return `/booking?${params.toString()}`;
};
