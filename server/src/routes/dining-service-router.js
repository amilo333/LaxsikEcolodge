import express from "express";
import {
  createDiningService,
  deleteDiningService,
  getAllDiningServices,
  getDiningServiceById,
  updateDiningService,
} from "../controllers/dining-service-controller.js";
import { authenticate, authorizedAdmin } from "../middleware/authMiddleware.js";
import uploadImageMulter from "../middleware/multer.js";

const router = express.Router();

// PUBLIC

// GET all services
// Có thể filter:
// /api/dining-services?diningId=xxx
router.get("/", getAllDiningServices);

// GET service by id
router.get("/:id", getDiningServiceById);

// ADMIN

// Create service
router.post(
  "/",
  authenticate,
  authorizedAdmin,
  uploadImageMulter.single("icon"),
  createDiningService,
);

// Update service
router.put(
  "/:id",
  authenticate,
  authorizedAdmin,
  uploadImageMulter.single("icon"),
  updateDiningService,
);

// Delete service
router.delete("/:id", authenticate, authorizedAdmin, deleteDiningService);

export { router as diningServiceRouter };
