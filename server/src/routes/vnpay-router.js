import express from "express";

import {
  createVnpayPayment,
  vnpayIpn,
  vnpayReturn,
} from "../controllers/vnpay-controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// User tạo thanh toán
router.post("/create", authenticate, createVnpayPayment);

// Browser được VNPay redirect về
router.get("/return", vnpayReturn);

// VNPay server thông báo kết quả
router.get("/ipn", vnpayIpn);

export { router as vnpayRouter };
