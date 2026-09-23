import express from "express";

import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAdminDashboardSummary,
  getAllBookingsAdmin,
  updateBookingAdmin,
} from "../controllers/booking-controller.js";

import { authenticate, authorizedAdmin } from "../middleware/authMiddleware.js";
import { getAdminRoomOccupancy } from "../controllers/room-occupancy-controller.js";
import { getAdminDashboardAnalytics } from "../controllers/dashboard-analytics-controller.js";

const router = express.Router();

router.post("/", authenticate, createBooking);

router.get("/my-bookings", authenticate, getMyBookings);

router.get("/admin", authenticate, authorizedAdmin, getAllBookingsAdmin);

router.get(
  "/admin/summary",
  authenticate,
  authorizedAdmin,
  getAdminDashboardSummary,
);

router.get(
  "/admin/analytics",
  authenticate,
  authorizedAdmin,
  getAdminDashboardAnalytics,
);

router.get(
  "/admin/occupancy",
  authenticate,
  authorizedAdmin,
  getAdminRoomOccupancy,
);

router.put("/admin/:id", authenticate, authorizedAdmin, updateBookingAdmin);

router.get("/:id", authenticate, getBookingById);

router.put("/:id/cancel", authenticate, cancelBooking);

export { router as bookingRouter };
