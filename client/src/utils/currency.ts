const vndFormatter = new Intl.NumberFormat('vi-VN', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatCurrency = (amount: number) =>
  `${vndFormatter.format(Math.round(amount))} VND`;
