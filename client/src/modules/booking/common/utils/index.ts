export const getNightCount = (checkInDate: string, checkOutDate: string) => {
  const checkIn = new Date(`${checkInDate}T00:00:00`);
  const checkOut = new Date(`${checkOutDate}T00:00:00`);

  return Math.max(
    1,
    Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86_400_000)
  );
};

export const formatStayDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date.slice(0, 10)}T00:00:00`));

export { formatCurrency } from '@/utils/currency';
