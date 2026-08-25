import express from "express";

import {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  validateVoucher,
} from "../controllers/voucher-controller.js";

import { authenticate, authorizedAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/validate", validateVoucher);

// Admin
router.get("/", authenticate, authorizedAdmin, getAllVouchers);

router.get("/:id", authenticate, authorizedAdmin, getVoucherById);

router.post("/", authenticate, authorizedAdmin, createVoucher);

router.put("/:id", authenticate, authorizedAdmin, updateVoucher);

router.delete("/:id", authenticate, authorizedAdmin, deleteVoucher);

export { router as voucherRouter };
