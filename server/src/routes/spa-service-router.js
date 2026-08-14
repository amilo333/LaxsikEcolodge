import express from "express";
import {
  createSpaService,
  deleteSpaService,
  getAllSpaServices,
  getSpaServiceById,
  updateSpaService,
} from "../controllers/spa-service-controller.js";
import { authenticate, authorizedAdmin } from "../middleware/authMiddleware.js";
import uploadImageMulter from "../middleware/multer.js";

const router = express.Router();

// PUBLIC

router.get("/", getAllSpaServices);

router.get("/:id", getSpaServiceById);

// ADMIN

router.post(
  "/",
  authenticate,
  authorizedAdmin,
  uploadImageMulter.single("icon"),
  createSpaService,
);

router.put(
  "/:id",
  authenticate,
  authorizedAdmin,
  uploadImageMulter.single("icon"),
  updateSpaService,
);

router.delete("/:id", authenticate, authorizedAdmin, deleteSpaService);

export { router as spaServiceRouter };
