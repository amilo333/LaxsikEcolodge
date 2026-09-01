import express from "express";
import {
  createTour,
  deleteTour,
  getAllTours,
  getTourById,
  updateTour,
} from "../controllers/tour-controller.js";
import { authenticate, authorizedAdmin } from "../middleware/authMiddleware.js";
import uploadImageMulter from "../middleware/multer.js";

const router = express.Router();

router.get("/", getAllTours);
router.get("/:id", getTourById);
router.post(
  "/",
  authenticate,
  authorizedAdmin,
  uploadImageMulter.single("thumbnail"),
  createTour,
);
router.put(
  "/:id",
  authenticate,
  authorizedAdmin,
  uploadImageMulter.single("thumbnail"),
  updateTour,
);
router.delete("/:id", authenticate, authorizedAdmin, deleteTour);

export { router as tourRouter };
