import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

export class RoomAvailabilityError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "RoomAvailabilityError";
    this.status = status;
  }
}

export const findAvailableRooms = async ({
  checkInDate,
  checkOutDate,
  guests,
  roomCount,
}) => {
  if (!checkInDate || !checkOutDate) {
    throw new RoomAvailabilityError(
      "Check-in and check-out dates are required",
    );
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    throw new RoomAvailabilityError("Invalid date");
  }

  if (checkIn >= checkOut) {
    throw new RoomAvailabilityError(
      "Check-out date must be after check-in date",
    );
  }

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  if (checkIn < currentDate) {
    throw new RoomAvailabilityError("Check-in date cannot be in the past");
  }

  const requestedGuests = guests == null ? undefined : Number(guests);
  const requestedRooms = roomCount == null ? undefined : Number(roomCount);

  if (
    (requestedGuests !== undefined &&
      (!Number.isInteger(requestedGuests) || requestedGuests < 1)) ||
    (requestedRooms !== undefined &&
      (!Number.isInteger(requestedRooms) || requestedRooms < 1))
  ) {
    throw new RoomAvailabilityError(
      "Guests and rooms must be positive whole numbers",
    );
  }

  const overlappingBookings = await Booking.find({
    bookingStatus: { $in: ["pending", "confirmed"] },
    checkInDate: { $lt: checkOut },
    checkOutDate: { $gt: checkIn },
  }).select("bookingItems");
  const bookedRoomMap = {};

  overlappingBookings.forEach((booking) => {
    booking.bookingItems.forEach((item) => {
      const roomId = item.roomId.toString();
      bookedRoomMap[roomId] = (bookedRoomMap[roomId] ?? 0) + item.quantity;
    });
  });

  const rooms = await Room.find({ status: "available" }).sort({ price: 1 });

  return rooms
    .map((room) => {
      const bookedQuantity = bookedRoomMap[room._id.toString()] ?? 0;

      return {
        ...room.toObject(),
        availableQuantity: room.quantity - bookedQuantity,
      };
    })
    .filter((room) => {
      if (room.availableQuantity <= 0) return false;
      if (requestedRooms && room.availableQuantity < requestedRooms) {
        return false;
      }
      if (
        requestedGuests &&
        room.capacity * (requestedRooms ?? 1) < requestedGuests
      ) {
        return false;
      }
      return true;
    });
};
