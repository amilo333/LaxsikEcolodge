import assert from "node:assert/strict";
import { test } from "node:test";

import {
  parseOccupancyRange,
  summarizeRoomOccupancy,
} from "../src/service/room-occupancy.js";
import { getAdminRoomOccupancy } from "../src/controllers/room-occupancy-controller.js";
import Booking from "../src/models/Booking.js";
import Room from "../src/models/Room.js";

test("validates a custom day count and calendar start date", () => {
  assert.throws(() => parseOccupancyRange("2026-02-30", 7), /Invalid start date/);
  assert.throws(() => parseOccupancyRange("2026-09-19", 0), /between 1 and 366/);
  assert.throws(() => parseOccupancyRange("2026-09-19", 367), /between 1 and 366/);
  assert.equal(parseOccupancyRange("2026-09-19", 3).dateTo, "2026-09-22");
});

test("counts used and free room units per day, excluding checkout day", () => {
  const range = parseOccupancyRange("2026-09-19", 3);
  const result = summarizeRoomOccupancy({
    range,
    rooms: [
      { _id: "room-a", title: "A", quantity: 3 },
      { _id: "room-b", title: "B", quantity: 2 },
    ],
    bookings: [
      {
        _id: "booking-1",
        checkInDate: new Date("2026-09-18T00:00:00Z"),
        checkOutDate: new Date("2026-09-21T00:00:00Z"),
        bookingItems: [{ roomId: "room-a", quantity: 2 }],
      },
      {
        _id: "booking-2",
        checkInDate: new Date("2026-09-20T00:00:00Z"),
        checkOutDate: new Date("2026-09-22T00:00:00Z"),
        bookingItems: [{ roomId: "room-b", quantity: 1 }],
      },
    ],
  });

  assert.deepEqual(
    result.dailyOccupancy.map(({ date, usedRooms, freeRooms }) => ({
      date,
      usedRooms,
      freeRooms,
    })),
    [
      { date: "2026-09-19", usedRooms: 2, freeRooms: 3 },
      { date: "2026-09-20", usedRooms: 3, freeRooms: 2 },
      { date: "2026-09-21", usedRooms: 1, freeRooms: 4 },
    ],
  );
  assert.equal(result.occupiedRoomNights, 6);
  assert.equal(result.freeRoomNights, 9);
  assert.equal(result.availableRoomNights, 15);
  assert.equal(result.roomPerformance[0].bookedRoomNights, 4);
});

test("an empty booking range leaves every sellable room free", () => {
  const result = summarizeRoomOccupancy({
    range: parseOccupancyRange("2026-09-19", 2),
    rooms: [{ _id: "room-a", title: "A", quantity: 3 }],
    bookings: [],
  });

  assert.equal(result.occupiedRoomNights, 0);
  assert.equal(result.freeRoomNights, 6);
  assert.deepEqual(result.dailyOccupancy.map((day) => day.freeRooms), [3, 3]);
});

test("occupancy endpoint excludes cancelled bookings and only counts sellable rooms", async () => {
  const originalRoomFind = Room.find;
  const originalBookingFind = Booking.find;
  let roomFilter;
  let bookingFilter;
  try {
    Room.find = (filter) => {
      roomFilter = filter;
      return {
        select: () => ({
          lean: async () => [{ _id: "room-a", title: "A", quantity: 2 }],
        }),
      };
    };
    Booking.find = (filter) => {
      bookingFilter = filter;
      return {
        select: () => ({ lean: async () => [] }),
      };
    };
    const response = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        this.body = body;
        return this;
      },
    };

    await getAdminRoomOccupancy(
      { query: { dateFrom: "2026-09-19", days: "2" } },
      response,
    );

    assert.equal(response.statusCode, 200);
    assert.deepEqual(roomFilter, { status: "available" });
    assert.deepEqual(bookingFilter.bookingStatus.$in, [
      "pending",
      "confirmed",
      "completed",
    ]);
    assert.equal(response.body.data.freeRoomNights, 4);
  } finally {
    Room.find = originalRoomFind;
    Booking.find = originalBookingFind;
  }
});
