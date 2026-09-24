import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import imageFileFilter from "../utils/imageFileFilter.js";

const uploadDirectory = process.env.VERCEL ? "/tmp" : "uploads";
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${path.basename(file.originalname)}`);
  },
});

const uploadImageMulter = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadImages = (req, res, next) => {
  uploadImageMulter.any()(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next();
  });
};

export { uploadImages };
export default uploadImageMulter;
