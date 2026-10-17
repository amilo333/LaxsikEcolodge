import Booking from "../models/Booking.js";

export const DEFAULT_BOOKING_HOLD_MINUTES = 15;
export const UNPAID_PAYMENT_STATUSES = ["unpaid", "pending", "failed"];

export const getBookingHoldMinutes = () => {
  const configuredMinutes = Number(process.env.BOOKING_HOLD_MINUTES);

  return Number.isFinite(configuredMinutes) && configuredMinutes > 0
    ? configuredMinutes
    : DEFAULT_BOOKING_HOLD_MINUTES;
};

export const getBookingHoldExpiresAt = (
  startAt = new Date(),
  holdMinutes = getBookingHoldMinutes(),
) => new Date(new Date(startAt).getTime() + holdMinutes * 60 * 1000);

export const getBookingHoldDeadline = (
  booking,
  holdMinutes = getBookingHoldMinutes(),
) => {
  if (booking?.holdExpiresAt) {
    const explicitDeadline = new Date(booking.holdExpiresAt);
    if (!Number.isNaN(explicitDeadline.getTime())) return explicitDeadline;
  }

  if (booking?.createdAt) {
    const createdAt = new Date(booking.createdAt);
    if (!Number.isNaN(createdAt.getTime())) {
      return getBookingHoldExpiresAt(createdAt, holdMinutes);
    }
  }

  return null;
};

export const isBookingHoldExpired = (booking, now = new Date()) => {
  if (
    booking?.bookingStatus !== "pending" ||
    !UNPAID_PAYMENT_STATUSES.includes(booking?.paymentStatus)
  ) {
    return false;
  }

  const deadline = getBookingHoldDeadline(booking);
  return deadline ? deadline.getTime() <= new Date(now).getTime() : false;
};

export const expireStaleBookingHolds = async ({
  now = new Date(),
  bookingId,
  userId,
} = {}) => {
  const currentTime = new Date(now);
  const legacyCreatedAtCutoff = new Date(
    currentTime.getTime() - getBookingHoldMinutes() * 60 * 1000,
  );
  const filter = {
    bookingStatus: "pending",
    paymentStatus: { $in: UNPAID_PAYMENT_STATUSES },
    $or: [
      { holdExpiresAt: { $lte: currentTime } },
      {
        holdExpiresAt: null,
        createdAt: { $lte: legacyCreatedAtCutoff },
      },
    ],
  };

  if (bookingId) filter._id = bookingId;
  if (userId) filter.userId = userId;

  return Booking.updateMany(filter, {
    $set: { bookingStatus: "cancelled" },
  });
};
