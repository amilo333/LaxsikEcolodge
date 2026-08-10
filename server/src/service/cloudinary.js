import cloudinary from "cloudinary";
import fs from "fs/promises";

export const uploadOnCloudinary = async (localFilePath, folder = "uploads") => {
  if (!localFilePath) throw new Error("Local file path is required");
  try {
    const uploadResult = await cloudinary.v2.uploader.upload(localFilePath, {
      folder,
      resource_type: "image",
    });

    await fs.unlink(localFilePath); // Delete the local file after upload

    return {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Error uploading image to Cloudinary");
  }
};

export const deleteOnCloudinary = async (publicId) => {
  if (!publicId) throw new Error("publicId is required to delete image");
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Error deleting image from Cloudinary");
  }
};
