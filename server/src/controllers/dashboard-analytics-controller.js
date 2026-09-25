import Booking from "../models/Booking.js";
import {
  parseDashboardAnalyticsParams,
  summarizeBookingAnalytics,
} from "../service/dashboard-analytics.js";

export const getAdminDashboardAnalytics = async (req, res) => {
  let params;
  try {
    params = parseDashboardAnalyticsParams(req.query.period, req.query.groupBy);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const bookings = await Booking.find({
      createdAt: { $gte: params.dataStart, $lt: params.dataEnd },
    })
      .select(
        "_id bookingCode userId customerInfo bookingItems totalNights totalAmount depositAmount paidAmount bookingStatus paymentStatus createdAt",
      )
      .populate("bookingItems.roomId", "title translations")
      .lean();

    return res.status(200).json({
      message: "Get admin dashboard analytics successfully",
      data: summarizeBookingAnalytics(bookings, params),
    });
  } catch (error) {
    console.error("Admin dashboard analytics error:", error);
    return res.status(500).json({
      message: "Unable to get dashboard analytics",
    });
  }
};
