import Dining from "../models/Dining.js";
import DiningService from "../models/DiningService.js";
import { uploadOnCloudinary } from "../service/cloudinary.js";
import { ResponseUtil } from "../utils/response.util.js";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @desc    Get all dining
// @route   GET /api/dining
// @access  Public
export const getAllDining = async (req, res) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;

    const limit = Math.min(
      Number(req.query.limit) > 0 ? Number(req.query.limit) : 10,
      100,
    );
    const search = req.query.search?.trim();
    const query = {};

    if (["active", "inactive"].includes(req.query.status)) {
      query.status = req.query.status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: escapeRegExp(search), $options: "i" } },
        { description: { $regex: escapeRegExp(search), $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [dinings, total] = await Promise.all([
      Dining.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "createdBy",
          select: "-password",
        })
        .populate({
          path: "updatedBy",
          select: "-password",
        }),

      Dining.countDocuments(query),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    ResponseUtil.pagination(
      res,
      dinings,
      {
        page,
        limit,
        total,
        totalPages,
      },
      "Dinings fetched successfully",
    );
  } catch (error) {
    ResponseUtil.serverError(res, error.message);
  }
};

// @desc    Get dining by id
// @route   GET /api/dining/:id
// @access  Public
export const getDiningById = async (req, res) => {
  try {
    const dining = await Dining.findById(req.params.id)
      .populate({
        path: "createdBy",
        select: "-password",
      })
      .populate({
        path: "updatedBy",
        select: "-password",
      });

    if (!dining) {
      return res.status(404).json({
        success: false,
        message: "Dining not found",
      });
    }

    res.status(200).json({
      success: true,
      dining,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new dining
// @route   POST /api/dining
// @access  Private/Admin
export const createDining = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const uploadedFiles = req.files || [];

    // Lấy thumbnail
    const thumbnailFile = uploadedFiles.find(
      (file) => file.fieldname === "thumbnail",
    );

    // Lấy các gallery images
    const imageFiles = uploadedFiles.filter(
      (file) => file.fieldname === "images",
    );

    // Validate thumbnail
    if (!thumbnailFile) {
      return ResponseUtil.badRequest(res, "Thumbnail file is required");
    }

    // Tối đa 5 ảnh gallery
    if (imageFiles.length > 5) {
      return ResponseUtil.badRequest(res, "Maximum 5 images are allowed");
    }

    // Upload Cloudinary
    const [uploadedThumbnail, ...uploadedImages] = await Promise.all([
      uploadOnCloudinary(thumbnailFile.path, "mern-images"),

      ...imageFiles.map((file) => uploadOnCloudinary(file.path, "mern-images")),
    ]);

    // Create dining
    const dining = new Dining({
      title,
      description,

      thumbnail: uploadedThumbnail.url,

      images: uploadedImages.map((image) => image.url),

      createdBy: req.user._id,
      updatedBy: req.user._id,

      status,
    });

    await dining.save();

    ResponseUtil.created(res, dining, "Dining created successfully");
  } catch (error) {
    ResponseUtil.serverError(res, error.message);
  }
};

// @desc    Update dining
// @route   PUT /api/dining/:id
// @access  Private/Admin
export const updateDining = async (req, res) => {
  try {
    const dining = await Dining.findById(req.params.id);

    if (!dining) {
      return res.status(404).json({
        success: false,
        message: "Dining not found",
      });
    }

    const { title, description, status } = req.body;

    const updateData = {
      title: title ?? dining.title,
      description: description ?? dining.description,
      status: status ?? dining.status,
      updatedBy: req.user._id,
    };

    const uploadedFiles = req.files || [];

    // Nếu gửi thumbnail mới
    const thumbnailFile = uploadedFiles.find(
      (file) => file.fieldname === "thumbnail",
    );

    if (thumbnailFile) {
      const uploadedThumbnail = await uploadOnCloudinary(
        thumbnailFile.path,
        "mern-images",
      );

      updateData.thumbnail = uploadedThumbnail.url;
    }

    // Nếu gửi images mới
    const imageFiles = uploadedFiles.filter(
      (file) => file.fieldname === "images",
    );

    if (imageFiles.length > 5) {
      return ResponseUtil.badRequest(res, "Maximum 5 images are allowed");
    }

    if (imageFiles.length > 0) {
      const uploadedImages = await Promise.all(
        imageFiles.map((file) => uploadOnCloudinary(file.path, "mern-images")),
      );

      updateData.images = uploadedImages.map((image) => image.url);
    }

    const updatedDining = await Dining.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Dining updated successfully",
      dining: updatedDining,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete dining
// @route   DELETE /api/dining/:id
// @access  Private/Admin
export const deleteDining = async (req, res) => {
  try {
    const dining = await Dining.findById(req.params.id);

    if (!dining) {
      return res.status(404).json({
        success: false,
        message: "Dining not found",
      });
    }

    const hasServices = await DiningService.exists({ diningId: dining._id });

    if (hasServices) {
      return res.status(409).json({
        success: false,
        message: "Delete dining services before deleting this dining item",
      });
    }

    await dining.deleteOne();

    res.status(200).json({
      success: true,
      message: "Dining deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
