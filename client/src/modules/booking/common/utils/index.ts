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
  }).format(new Date(`${date}T00:00:00`));

export const formatCurrency = (amount: number) =>
  `VND ${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount))}`;
