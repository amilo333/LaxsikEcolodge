import express from "express";
import { uploadImage, deleteImage } from "../controllers/upload-controller.js";
import uploadImageMulter from "../middleware/multer.js";

const router = express.Router();

router.post("/upload", uploadImageMulter.single("image"), uploadImage);
router.delete("/delete", deleteImage);

export { router as imageRouter };
