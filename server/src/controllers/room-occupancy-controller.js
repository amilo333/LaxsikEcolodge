import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import {
  parseOccupancyRange,
  RoomOccupancyError,
  summarizeRoomOccupancy,
} from "../service/room-occupancy.js";

export const getAdminRoomOccupancy = async (req, res) => {
  try {
    const range = parseOccupancyRange(req.query.dateFrom, req.query.days);
    const [rooms, bookings] = await Promise.all([
      Room.find({ status: "available" })
        .select("title translations quantity")
        .lean(),
      Booking.find({
        bookingStatus: { $in: ["pending", "confirmed", "completed"] },
        checkInDate: { $lt: range.end },
        checkOutDate: { $gt: range.start },
      })
        .select("bookingItems checkInDate checkOutDate")
        .lean(),
    ]);

    return res.status(200).json({
      message: "Get room occupancy successfully",
      data: summarizeRoomOccupancy({ rooms, bookings, range }),
    });
  } catch (error) {
    if (error instanceof RoomOccupancyError) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Admin room occupancy error:", error);
    return res.status(500).json({ message: "Unable to get room occupancy" });
  }
};
