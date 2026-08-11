import Spa from "../models/Spa.js";
import { uploadOnCloudinary } from "../service/cloudinary.js";
import { ResponseUtil } from "../utils/response.util.js";

// @desc    Get all spas
// @route   GET /api/spa
// @access  Public
export const getAllSpa = async (req, res) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;

    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;

    const skip = (page - 1) * limit;

    const [spas, total] = await Promise.all([
      Spa.find()
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

      Spa.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

    ResponseUtil.pagination(
      res,
      spas,
      {
        page,
        limit,
        total,
        totalPages,
      },
      "Spas fetched successfully",
    );
  } catch (error) {
    ResponseUtil.serverError(res, error.message);
  }
};

// @desc    Get spa by id
// @route   GET /api/spa/:id
// @access  Public
export const getSpaById = async (req, res) => {
  try {
    const spa = await Spa.findById(req.params.id)
      .populate({
        path: "createdBy",
        select: "-password",
      })
      .populate({
        path: "updatedBy",
        select: "-password",
      });

    if (!spa) {
      return res.status(404).json({
        success: false,
        message: "Spa not found",
      });
    }

    res.status(200).json({
      success: true,
      spa,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new spa
// @route   POST /api/spa
// @access  Private/Admin
export const createSpa = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Validate text
    if (!title || !description) {
      return ResponseUtil.badRequest(res, "Title and description are required");
    }

    // Validate thumbnail
    if (!req.file) {
      return ResponseUtil.badRequest(res, "Thumbnail file is required");
    }

    // Upload thumbnail lên Cloudinary
    const uploadedThumbnail = await uploadOnCloudinary(req.file.path, "spa");

    if (!uploadedThumbnail?.url) {
      return ResponseUtil.serverError(res, "Failed to upload thumbnail");
    }

    // Create Spa
    const spa = new Spa({
      title,
      description,

      thumbnail: uploadedThumbnail.url,

      status: status || "active",

      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await spa.save();

    ResponseUtil.created(res, spa, "Spa created successfully");
  } catch (error) {
    ResponseUtil.serverError(res, error.message);
  }
};

// @desc    Update spa
// @route   PUT /api/spa/:id
// @access  Private/Admin
export const updateSpa = async (req, res) => {
  try {
    const spa = await Spa.findById(req.params.id);

    if (!spa) {
      return res.status(404).json({
        success: false,
        message: "Spa not found",
      });
    }

    const { title, description, status } = req.body;

    // Update text
    if (title !== undefined) {
      spa.title = title;
    }

    if (description !== undefined) {
      spa.description = description;
    }

    if (status !== undefined) {
      spa.status = status;
    }

    // Nếu có thumbnail mới
    if (req.file) {
      const uploadedThumbnail = await uploadOnCloudinary(req.file.path, "spa");

      if (!uploadedThumbnail?.url) {
        return ResponseUtil.serverError(res, "Failed to upload thumbnail");
      }

      spa.thumbnail = uploadedThumbnail.url;
    }

    // Người update
    spa.updatedBy = req.user._id;

    const updatedSpa = await spa.save();

    res.status(200).json({
      success: true,
      message: "Spa updated successfully",
      spa: updatedSpa,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete spa
// @route   DELETE /api/spa/:id
// @access  Private/Admin
export const deleteSpa = async (req, res) => {
  try {
    const spa = await Spa.findById(req.params.id);

    if (!spa) {
      return res.status(404).json({
        success: false,
        message: "Spa not found",
      });
    }

    await spa.deleteOne();

    res.status(200).json({
      success: true,
      message: "Spa deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
