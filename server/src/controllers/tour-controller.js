import Tour from "../models/Tour.js";
import { uploadOnCloudinary } from "../service/cloudinary.js";
import { ResponseUtil } from "../utils/response.util.js";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseHighlights = (value) => {
  if (typeof value === "undefined") return undefined;

  let highlights = value;
  if (typeof value === "string") {
    try {
      highlights = JSON.parse(value);
    } catch {
      highlights = value.split("\n");
    }
  }

  if (!Array.isArray(highlights)) {
    throw new Error("Highlights must be an array");
  }

  const normalized = highlights
    .map((item) => String(item).trim())
    .filter(Boolean);

  if (normalized.length > 8) {
    throw new Error("A tour can have at most 8 highlights");
  }

  return normalized;
};

const parseSortOrder = (value) => {
  if (typeof value === "undefined" || value === "") return undefined;

  const sortOrder = Number(value);
  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    throw new Error("Sort order must be a non-negative integer");
  }

  return sortOrder;
};

const sendControllerError = (res, error) => {
  if (
    error.name === "ValidationError" ||
    error.name === "CastError" ||
    [
      "Highlights must be an array",
      "A tour can have at most 8 highlights",
      "Sort order must be a non-negative integer",
    ].includes(error.message)
  ) {
    return ResponseUtil.badRequest(res, error.message);
  }

  return ResponseUtil.serverError(res, error.message);
};

// @desc    Get all tours
// @route   GET /api/tours
// @access  Public
export const getAllTours = async (req, res) => {
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
      const expression = { $regex: escapeRegExp(search), $options: "i" };
      query.$or = [
        { title: expression },
        { eyebrow: expression },
        { duration: expression },
        { rhythm: expression },
      ];
    }

    const skip = (page - 1) * limit;
    const [tours, total] = await Promise.all([
      Tour.find(query)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: "createdBy", select: "-password" })
        .populate({ path: "updatedBy", select: "-password" }),
      Tour.countDocuments(query),
    ]);

    ResponseUtil.pagination(
      res,
      tours,
      {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
      "Tours fetched successfully",
    );
  } catch (error) {
    sendControllerError(res, error);
  }
};

// @desc    Get tour by id
// @route   GET /api/tours/:id
// @access  Public
export const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
      .populate({ path: "createdBy", select: "-password" })
      .populate({ path: "updatedBy", select: "-password" });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    return ResponseUtil.success(res, tour, "Tour fetched successfully");
  } catch (error) {
    return sendControllerError(res, error);
  }
};

// @desc    Create a tour
// @route   POST /api/tours
// @access  Private/Admin
export const createTour = async (req, res) => {
  try {
    const { title, eyebrow, description, duration, rhythm, status } = req.body;

    if (!title || !eyebrow || !description || !duration || !rhythm) {
      return ResponseUtil.badRequest(
        res,
        "Title, eyebrow, description, duration and rhythm are required",
      );
    }

    if (!req.file) {
      return ResponseUtil.badRequest(res, "Thumbnail file is required");
    }

    const highlights = parseHighlights(req.body.highlights) ?? [];
    const sortOrder = parseSortOrder(req.body.sortOrder) ?? 0;
    const uploadedThumbnail = await uploadOnCloudinary(req.file.path, "tours");

    const tour = await Tour.create({
      title,
      eyebrow,
      description,
      thumbnail: uploadedThumbnail.url,
      duration,
      rhythm,
      highlights,
      sortOrder,
      status,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    return ResponseUtil.created(res, tour, "Tour created successfully");
  } catch (error) {
    return sendControllerError(res, error);
  }
};

// @desc    Update a tour
// @route   PUT /api/tours/:id
// @access  Private/Admin
export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    const fields = [
      "title",
      "eyebrow",
      "description",
      "duration",
      "rhythm",
      "status",
    ];

    fields.forEach((field) => {
      if (typeof req.body[field] !== "undefined") {
        tour[field] = req.body[field];
      }
    });

    const highlights = parseHighlights(req.body.highlights);
    const sortOrder = parseSortOrder(req.body.sortOrder);
    if (highlights) tour.highlights = highlights;
    if (typeof sortOrder !== "undefined") tour.sortOrder = sortOrder;

    if (req.file) {
      const uploadedThumbnail = await uploadOnCloudinary(
        req.file.path,
        "tours",
      );
      tour.thumbnail = uploadedThumbnail.url;
    }

    tour.updatedBy = req.user._id;
    const updatedTour = await tour.save();

    return ResponseUtil.success(res, updatedTour, "Tour updated successfully");
  } catch (error) {
    return sendControllerError(res, error);
  }
};

// @desc    Delete a tour
// @route   DELETE /api/tours/:id
// @access  Private/Admin
export const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    await tour.deleteOne();

    return ResponseUtil.success(res, null, "Tour deleted successfully");
  } catch (error) {
    return sendControllerError(res, error);
  }
};
