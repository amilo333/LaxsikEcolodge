import Image from "../models/Image.js";
import {
  uploadOnCloudinary,
  deleteOnCloudinary,
} from "../service/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const uploadedImage = await uploadOnCloudinary(
      req.file.path,
      "mern-images",
    );

    const ImageDoc = await Image.create({
      url: uploadedImage.url,
      public_id: uploadedImage.public_id,
      folder: "mern-images",
    });
    return res.status(201).json({ message: "Image uploaded", image: ImageDoc });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image" });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: "public_id is required" });
    }

    // delete from Cloudinary
    const result = await deleteOnCloudinary(public_id);

    return res.json({ message: "Image deleted successfully", result });
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ message: "Error deleting image" });
  }
};
