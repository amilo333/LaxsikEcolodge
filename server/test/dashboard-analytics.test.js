import assert from "node:assert/strict";
import { test } from "node:test";

import {
  parseDashboardAnalyticsParams,
  summarizeBookingAnalytics,
} from "../src/service/dashboard-analytics.js";

const booking = (overrides = {}) => ({
  _id: overrides._id ?? "booking-1",
  userId: overrides.userId ?? "user-1",
  customerInfo: { emailContact: "guest@example.com" },
  bookingItems: [
    {
      roomId: { _id: "room-a", title: "Deluxe" },
      quantity: 2,
      pricePerNight: 1_000_000,
    },
  ],
  totalNights: 2,
  totalAmount: 4_000_000,
  paidAmount: 2_000_000,
  paymentStatus: "deposit_paid",
  bookingStatus: "confirmed",
  createdAt: new Date("2026-09-20T02:00:00.000Z"),
  ...overrides,
});

test("builds Vietnam calendar ranges without hourly grouping", () => {
  const params = parseDashboardAnalyticsParams(
    "last7Days",
    "day",
    new Date("2026-09-21T03:00:00.000Z"),
  );

  assert.equal(params.start.toISOString(), "2026-09-14T17:00:00.000Z");
  assert.equal(params.end.toISOString(), "2026-09-21T17:00:00.000Z");
  assert.equal(params.previousStart.toISOString(), "2026-09-07T17:00:00.000Z");
});

test("summarizes collected revenue, bookings, and room nights", () => {
  const params = parseDashboardAnalyticsParams(
    "last7Days",
    "day",
    new Date("2026-09-21T03:00:00.000Z"),
  );
  const result = summarizeBookingAnalytics(
    [
      booking(),
      booking({
        _id: "booking-2",
        userId: "user-2",
        createdAt: new Date("2026-09-19T03:00:00.000Z"),
        paidAmount: 4_000_000,
        paymentStatus: "paid",
      }),
      booking({
        _id: "booking-cancelled",
        bookingStatus: "cancelled",
        createdAt: new Date("2026-09-18T03:00:00.000Z"),
      }),
    ],
    params,
  );

  assert.equal(result.metrics.revenue, 6_000_000);
  assert.equal(result.metrics.bookings, 2);
  assert.equal(result.metrics.roomNights, 8);
  assert.equal(result.metrics.customers, 2);
  assert.equal(result.trend.length, 7);
  assert.equal(result.roomPerformance[0].roomNights, 8);
  assert.equal(result.roomPerformance[0].grossRevenue, 8_000_000);
});

test("groups the selected period by weekday and six recent months", () => {
  const now = new Date("2026-09-21T03:00:00.000Z");
  const weekday = summarizeBookingAnalytics(
    [booking()],
    parseDashboardAnalyticsParams("thisMonth", "weekday", now),
  );
  const monthly = summarizeBookingAnalytics(
    [booking()],
    parseDashboardAnalyticsParams("thisMonth", "month", now),
  );

  assert.deepEqual(
    weekday.trend.map((item) => item.label),
    ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
  );
  assert.equal(monthly.trend.length, 6);
  assert.equal(monthly.trend.at(-1).key, "2026-09");
});
