import express from "express";

import {
  createDining,
  deleteDining,
  getAllDining,
  getDiningById,
  updateDining,
} from "../controllers/dining-controller.js";
import { authenticate, authorizedAdmin } from "../middleware/authMiddleware.js";
import { uploadImages } from "../middleware/multer.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllDining);
router.get("/:id", getDiningById);

// ADMIN
router.post("/", authenticate, authorizedAdmin, uploadImages, createDining);

router.put("/:id", authenticate, authorizedAdmin, uploadImages, updateDining);

router.delete("/:id", authenticate, authorizedAdmin, deleteDining);

export { router as diningRouter };
