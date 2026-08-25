import express from "express";

import {
  createVnpayPayment,
  getVnpayPaymentStatus,
  vnpayIpn,
  vnpayReturn,
} from "../controllers/vnpay-controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// User tạo thanh toán
router.post("/create", authenticate, createVnpayPayment);

// Frontend đối soát trạng thái với VNPay khi IPN chưa tới
router.get("/status/:bookingId", authenticate, getVnpayPaymentStatus);

// Browser được VNPay redirect về
router.get("/return", vnpayReturn);

// VNPay server thông báo kết quả
router.get("/ipn", vnpayIpn);

export { router as vnpayRouter };
