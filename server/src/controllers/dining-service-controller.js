import DiningService from "../models/DiningService.js";
import Dining from "../models/Dining.js";

import { uploadOnCloudinary } from "../service/cloudinary.js";

import { ResponseUtil } from "../utils/response.util.js";

// @desc    Get all dining services
// @route   GET /api/dining-services
// @access  Public
export const getAllDiningServices = async (req, res) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;

    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;

    const skip = (page - 1) * limit;

    const filter = {};

    // Filter theo Dining
    if (req.query.diningId) {
      filter.diningId = req.query.diningId;
    }

    const [services, total] = await Promise.all([
      DiningService.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "diningId",
          select: "title thumbnail",
        }),

      DiningService.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    ResponseUtil.pagination(
      res,
      services,
      {
        page,
        limit,
        total,
        totalPages,
      },
      "Dining services fetched successfully",
    );
  } catch (error) {
    ResponseUtil.serverError(res, error.message);
  }
};

// @desc    Get dining service by id
// @route   GET /api/dining-services/:id
// @access  Public
export const getDiningServiceById = async (req, res) => {
  try {
    const service = await DiningService.findById(req.params.id).populate({
      path: "diningId",
      select: "title thumbnail",
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Dining service not found",
      });
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create dining service
// @route   POST /api/dining-services
// @access  Private/Admin
export const createDiningService = async (req, res) => {
  try {
    const { diningId, title, description, status } = req.body;

    // Validate
    if (!diningId || !title || !description) {
      return ResponseUtil.badRequest(
        res,
        "DiningId, title and description are required",
      );
    }

    // Check Dining
    const dining = await Dining.findById(diningId);

    if (!dining) {
      return ResponseUtil.badRequest(res, "Dining not found");
    }

    // Get icon
    const iconFile = req.file;

    if (!iconFile) {
      return ResponseUtil.badRequest(res, "Icon file is required");
    }

    // Upload icon lên Cloudinary
    const uploadedIcon = await uploadOnCloudinary(
      iconFile.path,
      "dining-services",
    );

    if (!uploadedIcon?.url) {
      return ResponseUtil.serverError(res, "Failed to upload icon");
    }

    // Create service
    const service = new DiningService({
      diningId,
      title,
      description,
      icon: uploadedIcon.url,
      status: status || "active",
    });

    await service.save();

    ResponseUtil.created(res, service, "Dining service created successfully");
  } catch (error) {
    ResponseUtil.serverError(res, error.message);
  }
};

// @desc    Update dining service
// @route   PUT /api/dining-services/:id
// @access  Private/Admin
export const updateDiningService = async (req, res) => {
  try {
    const service = await DiningService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Dining service not found",
      });
    }

    const { diningId, title, description, status } = req.body;

    // Nếu đổi Dining
    if (diningId) {
      const dining = await Dining.findById(diningId);

      if (!dining) {
        return ResponseUtil.badRequest(res, "Dining not found");
      }

      service.diningId = diningId;
    }

    if (title !== undefined) {
      service.title = title;
    }

    if (description !== undefined) {
      service.description = description;
    }

    if (status !== undefined) {
      service.status = status;
    }

    // Nếu upload icon mới
    if (req.file) {
      const uploadedIcon = await uploadOnCloudinary(
        req.file.path,
        "dining-services",
      );

      if (!uploadedIcon?.url) {
        return ResponseUtil.serverError(res, "Failed to upload icon");
      }

      service.icon = uploadedIcon.url;
    }

    const updatedService = await service.save();

    res.status(200).json({
      success: true,
      message: "Dining service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete dining service
// @route   DELETE /api/dining-services/:id
// @access  Private/Admin
export const deleteDiningService = async (req, res) => {
  try {
    const service = await DiningService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Dining service not found",
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: "Dining service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
