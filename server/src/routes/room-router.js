import express from "express";
import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} from "../controllers/room-controller.js";
import { authenticate, authorizedAdmin } from "../middleware/authMiddleware.js";
import { uploadImages } from "../middleware/multer.js";

const router = express.Router();

router.get("/", getAllRooms); // Public
router.get("/:id", getRoomById); // Public

router.post("/", authenticate, authorizedAdmin, uploadImages, createRoom);
router.put("/:id", authenticate, authorizedAdmin, updateRoom);
router.delete("/:id", authenticate, authorizedAdmin, deleteRoom);

export { router as roomRouter };
