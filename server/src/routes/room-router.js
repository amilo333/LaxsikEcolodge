import express from "express";
import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} from "../controllers/room-controller.js";
import { authenticate, authorizedAdmin } from "../middleware/authMiddleware.js";
import { uploadRoomImages } from "../middleware/multer.js";

const router = express.Router();

router.get("/", getAllRooms); // Public
router.get("/:id", getRoomById); // Public

router.post("/", authenticate, authorizedAdmin, uploadRoomImages, createRoom);
router.put("/:id", authenticate, authorizedAdmin, updateRoom);
router.delete("/:id", authenticate, authorizedAdmin, deleteRoom);

export { router as roomRouter };
