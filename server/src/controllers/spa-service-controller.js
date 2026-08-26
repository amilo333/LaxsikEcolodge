import SpaService from "../models/SpaService.js";
import Spa from "../models/Spa.js";

import { uploadOnCloudinary } from "../service/cloudinary.js";
import { ResponseUtil } from "../utils/response.util.js";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @desc    Get all spa services
// @route   GET /api/spa-services
// @access  Public
export const getAllSpaServices = async (req, res) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;

    const limit = Math.min(
      Number(req.query.limit) > 0 ? Number(req.query.limit) : 10,
      100,
    );

    const skip = (page - 1) * limit;

    const filter = {};

    if (["active", "inactive"].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    // Nếu truyền spaId thì chỉ lấy service của spa đó
    if (req.query.spaId) {
      filter.spaId = req.query.spaId;
    }

    if (req.query.search?.trim()) {
      const search = escapeRegExp(req.query.search.trim());
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const [services, total] = await Promise.all([
      SpaService.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "spaId",
          select: "title thumbnail",
        }),

      SpaService.countDocuments(filter),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    ResponseUtil.pagination(
      res,
      services,
      {
        page,
        limit,
        total,
        totalPages,
      },
      "Spa services fetched successfully",
    );
  } catch (error) {
    ResponseUtil.serverError(res, error.message);
  }
};

// @desc    Get spa service by id
// @route   GET /api/spa-services/:id
// @access  Public
export const getSpaServiceById = async (req, res) => {
  try {
    const service = await SpaService.findById(req.params.id).populate({
      path: "spaId",
      select: "title thumbnail",
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Spa service not found",
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

// @desc    Create spa service
// @route   POST /api/spa-services
// @access  Private/Admin
export const createSpaService = async (req, res) => {
  try {
    const { spaId, title, description, status } = req.body;

    // Validate
    if (!spaId || !title || !description) {
      return ResponseUtil.badRequest(
        res,
        "SpaId, title and description are required",
      );
    }

    // Check Spa tồn tại
    const spa = await Spa.findById(spaId);

    if (!spa) {
      return ResponseUtil.badRequest(res, "Spa not found");
    }

    // Check icon
    if (!req.file) {
      return ResponseUtil.badRequest(res, "Icon file is required");
    }

    // Upload icon lên Cloudinary
    const uploadedIcon = await uploadOnCloudinary(
      req.file.path,
      "spa-services",
    );

    if (!uploadedIcon?.url) {
      return ResponseUtil.serverError(res, "Failed to upload icon");
    }

    // Create service
    const service = new SpaService({
      spaId,
      title,
      description,
      icon: uploadedIcon.url,
      status: status || "active",
    });

    await service.save();

    ResponseUtil.created(res, service, "Spa service created successfully");
  } catch (error) {
    ResponseUtil.serverError(res, error.message);
  }
};

// @desc    Update spa service
// @route   PUT /api/spa-services/:id
// @access  Private/Admin
export const updateSpaService = async (req, res) => {
  try {
    const service = await SpaService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Spa service not found",
      });
    }

    const { spaId, title, description, status } = req.body;

    // Nếu đổi Spa
    if (spaId !== undefined) {
      const spa = await Spa.findById(spaId);

      if (!spa) {
        return ResponseUtil.badRequest(res, "Spa not found");
      }

      service.spaId = spaId;
    }

    // Update title
    if (title !== undefined) {
      service.title = title;
    }

    // Update description
    if (description !== undefined) {
      service.description = description;
    }

    // Update status
    if (status !== undefined) {
      service.status = status;
    }

    // Nếu có icon mới
    if (req.file) {
      const uploadedIcon = await uploadOnCloudinary(
        req.file.path,
        "spa-services",
      );

      if (!uploadedIcon?.url) {
        return ResponseUtil.serverError(res, "Failed to upload icon");
      }

      service.icon = uploadedIcon.url;
    }

    const updatedService = await service.save();

    res.status(200).json({
      success: true,
      message: "Spa service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete spa service
// @route   DELETE /api/spa-services/:id
// @access  Private/Admin
export const deleteSpaService = async (req, res) => {
  try {
    const service = await SpaService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Spa service not found",
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: "Spa service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
