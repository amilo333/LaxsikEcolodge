const DAY_MS = 86_400_000;
const MAX_DAYS = 366;

export class RoomOccupancyError extends Error {
  constructor(message) {
    super(message);
    this.name = "RoomOccupancyError";
  }
}

export const parseOccupancyRange = (dateFrom, daysValue) => {
  const days = Number(daysValue);
  if (!Number.isInteger(days) || days < 1 || days > MAX_DAYS) {
    throw new RoomOccupancyError("Number of days must be between 1 and 366");
  }

  if (typeof dateFrom !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateFrom)) {
    throw new RoomOccupancyError("Invalid start date");
  }

  const start = new Date(`${dateFrom}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime()) || start.toISOString().slice(0, 10) !== dateFrom) {
    throw new RoomOccupancyError("Invalid start date");
  }

  const end = new Date(start.getTime() + days * DAY_MS);
  return { dateFrom, dateTo: end.toISOString().slice(0, 10), start, end, days };
};

export const summarizeRoomOccupancy = ({ rooms, bookings, range }) => {
  const roomMap = new Map(
    rooms.map((room) => [
      room._id.toString(),
      {
        roomId: room._id,
        title: room.title,
        translations: room.translations,
        quantity: room.quantity,
        usedByDay: Array(range.days).fill(0),
        bookingIds: new Set(),
      },
    ]),
  );

  for (const booking of bookings) {
    const firstDay = Math.max(
      0,
      Math.round((booking.checkInDate.getTime() - range.start.getTime()) / DAY_MS),
    );
    const lastDay = Math.min(
      range.days,
      Math.round((booking.checkOutDate.getTime() - range.start.getTime()) / DAY_MS),
    );
    if (firstDay >= lastDay) continue;

    for (const item of booking.bookingItems) {
      const room = roomMap.get(item.roomId.toString());
      if (!room) continue;
      room.bookingIds.add(booking._id.toString());
      for (let day = firstDay; day < lastDay; day += 1) {
        room.usedByDay[day] += item.quantity;
      }
    }
  }

  const roomPerformance = Array.from(roomMap.values())
    .map((room) => {
      const bookedRoomNights = room.usedByDay.reduce(
        (sum, used) => sum + Math.min(room.quantity, used),
        0,
      );
      const availableRoomNights = room.quantity * range.days;
      return {
        roomId: room.roomId,
        title: room.title,
        translations: room.translations,
        quantity: room.quantity,
        bookings: room.bookingIds.size,
        bookedRoomNights,
        freeRoomNights: availableRoomNights - bookedRoomNights,
        availableRoomNights,
        occupancyRate: availableRoomNights
          ? Math.round((bookedRoomNights / availableRoomNights) * 1000) / 10
          : 0,
      };
    })
    .sort(
      (left, right) =>
        right.occupancyRate - left.occupancyRate ||
        right.bookedRoomNights - left.bookedRoomNights,
    );

  const totalRooms = rooms.reduce((sum, room) => sum + room.quantity, 0);
  const dailyOccupancy = Array.from({ length: range.days }, (_, index) => {
    const usedRooms = Array.from(roomMap.values()).reduce(
      (sum, room) => sum + Math.min(room.quantity, room.usedByDay[index]),
      0,
    );
    return {
      date: new Date(range.start.getTime() + index * DAY_MS)
        .toISOString()
        .slice(0, 10),
      usedRooms,
      freeRooms: totalRooms - usedRooms,
      totalRooms,
    };
  });
  const occupiedRoomNights = dailyOccupancy.reduce(
    (sum, day) => sum + day.usedRooms,
    0,
  );
  const availableRoomNights = totalRooms * range.days;

  return {
    dateFrom: range.dateFrom,
    dateTo: range.dateTo,
    days: range.days,
    totalRooms,
    occupiedRoomNights,
    freeRoomNights: availableRoomNights - occupiedRoomNights,
    availableRoomNights,
    occupancyRate: availableRoomNights
      ? Math.round((occupiedRoomNights / availableRoomNights) * 1000) / 10
      : 0,
    roomPerformance,
    dailyOccupancy,
  };
};
