export const DEPOSIT_RATE = 0.5;

// VNPay chỉ nhận số tiền VND nguyên; phần còn lại giữ chênh lệch làm tròn.
export const getDepositAmount = (totalAmount) =>
  Math.round(totalAmount * DEPOSIT_RATE);
