const ADMIN_PAYMENT_STATUS_TRANSITIONS = {
  unpaid: ["unpaid", "pending", "deposit_paid", "paid", "failed"],
  pending: ["unpaid", "pending", "deposit_paid", "paid", "failed"],
  failed: ["unpaid", "pending", "deposit_paid", "paid", "failed"],
  deposit_paid: ["deposit_paid", "paid"],
  paid: ["paid"],
  refunded: ["refunded"],
};

export const canAdminChangePaymentStatus = (currentStatus, nextStatus) =>
  ADMIN_PAYMENT_STATUS_TRANSITIONS[currentStatus]?.includes(nextStatus) ??
  false;

