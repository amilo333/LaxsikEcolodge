import express from "express";

import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} from "../controllers/booking-controller.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createBooking);

router.get("/my-bookings", authenticate, getMyBookings);

router.get("/:id", authenticate, getBookingById);

router.put("/:id/cancel", authenticate, cancelBooking);

export { router as bookingRouter };
