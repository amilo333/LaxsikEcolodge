import express from "express";
import {
  createSpa,
  deleteSpa,
  getAllSpa,
  getSpaById,
  updateSpa,
} from "../controllers/spa-controller.js";
import { authenticate, authorizedAdmin } from "../middleware/authMiddleware.js";
import uploadImageMulter from "../middleware/multer.js";

const router = express.Router();

// PUBLIC

router.get("/", getAllSpa);

router.get("/:id", getSpaById);

// ADMIN

router.post(
  "/",
  authenticate,
  authorizedAdmin,
  uploadImageMulter.single("thumbnail"),
  createSpa,
);

router.put(
  "/:id",
  authenticate,
  authorizedAdmin,
  uploadImageMulter.single("thumbnail"),
  updateSpa,
);

router.delete("/:id", authenticate, authorizedAdmin, deleteSpa);

export { router as spaRouter };
