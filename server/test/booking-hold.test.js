import assert from "node:assert/strict";
import { test } from "node:test";

import Booking from "../src/models/Booking.js";
import {
  DEFAULT_BOOKING_HOLD_MINUTES,
  expireStaleBookingHolds,
  getBookingHoldDeadline,
  getBookingHoldExpiresAt,
  isBookingHoldExpired,
} from "../src/utils/booking-hold.js";

test("creates a finite booking hold deadline", () => {
  const createdAt = new Date("2026-10-06T03:00:00.000Z");
  const expiresAt = getBookingHoldExpiresAt(
    createdAt,
    DEFAULT_BOOKING_HOLD_MINUTES,
  );

  assert.equal(
    expiresAt.getTime() - createdAt.getTime(),
    DEFAULT_BOOKING_HOLD_MINUTES * 60 * 1000,
  );
});

test("recognizes only expired pending bookings without a collected payment", () => {
  const now = new Date("2026-10-06T03:30:00.000Z");
  const expiredAt = new Date("2026-10-06T03:15:00.000Z");

  assert.equal(
    isBookingHoldExpired(
      {
        bookingStatus: "pending",
        paymentStatus: "unpaid",
        holdExpiresAt: expiredAt,
      },
      now,
    ),
    true,
  );
  assert.equal(
    isBookingHoldExpired(
      {
        bookingStatus: "confirmed",
        paymentStatus: "deposit_paid",
        holdExpiresAt: expiredAt,
      },
      now,
    ),
    false,
  );
});

test("uses createdAt as a deadline fallback for older bookings", () => {
  const booking = { createdAt: new Date("2026-10-06T03:00:00.000Z") };

  assert.equal(
    getBookingHoldDeadline(
      booking,
      DEFAULT_BOOKING_HOLD_MINUTES,
    ).toISOString(),
    "2026-10-06T03:15:00.000Z",
  );
});

test("cancels stale unpaid holds, including legacy bookings", async () => {
  const originalUpdateMany = Booking.updateMany;
  let capturedFilter;
  let capturedUpdate;

  try {
    Booking.updateMany = async (filter, update) => {
      capturedFilter = filter;
      capturedUpdate = update;
      return { modifiedCount: 2 };
    };

    const result = await expireStaleBookingHolds({
      now: new Date("2026-10-06T03:30:00.000Z"),
      userId: "user-1",
    });

    assert.equal(result.modifiedCount, 2);
    assert.equal(capturedFilter.bookingStatus, "pending");
    assert.deepEqual(capturedFilter.paymentStatus.$in, [
      "unpaid",
      "pending",
      "failed",
    ]);
    assert.equal(capturedFilter.userId, "user-1");
    assert.equal(
      capturedFilter.$or[1].createdAt.$lte.toISOString(),
      "2026-10-06T03:15:00.000Z",
    );
    assert.deepEqual(capturedUpdate, {
      $set: { bookingStatus: "cancelled" },
    });
  } finally {
    Booking.updateMany = originalUpdateMany;
  }
});
