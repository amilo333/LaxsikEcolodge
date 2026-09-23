import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import { uploadOnCloudinary } from "../service/cloudinary.js";
import { createBilingualContent } from "../service/content-translation.js";
import {
  findAvailableRooms,
  RoomAvailabilityError,
} from "../service/room-availability.js";
import { ResponseUtil } from "../utils/response.util.js";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
export const getAllRooms = async (req, res) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Math.min(
      Number(req.query.limit) > 0 ? Number(req.query.limit) : 10,
      100,
    );
    const search = req.query.search?.trim();
    const hasMinPrice = req.query.minPrice != null && req.query.minPrice !== "";
    const hasMaxPrice = req.query.maxPrice != null && req.query.maxPrice !== "";
    const minPrice = hasMinPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = hasMaxPrice ? Number(req.query.maxPrice) : undefined;

    if (
      (hasMinPrice && (!Number.isFinite(minPrice) || minPrice < 0)) ||
      (hasMaxPrice && (!Number.isFinite(maxPrice) || maxPrice < 0)) ||
      (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)
    ) {
      return ResponseUtil.badRequest(res, "Invalid room price range");
    }

    const query = {};

    if (search) {
      const expression = { $regex: escapeRegExp(search), $options: "i" };
      query.$or = [
        { title: expression },
        { bed: expression },
        { views: expression },
        { "translations.vi.title": expression },
        { "translations.en.title": expression },
        { "translations.vi.bed": expression },
        { "translations.en.bed": expression },
        { "translations.vi.views": expression },
        { "translations.en.views": expression },
        { "translations.vi.description": expression },
        { "translations.en.description": expression },
        { "translations.vi.bathroom": expression },
        { "translations.en.bathroom": expression },
        { "translations.vi.fireplace": expression },
        { "translations.en.fireplace": expression },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {
        ...(minPrice !== undefined ? { $gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { $lte: maxPrice } : {}),
      };
    }

    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      Room.find(query)
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
      Room.countDocuments(query),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    ResponseUtil.pagination(
      res,
      rooms,
      {
        page,
        limit,
        total,
        totalPages,
      },
      "Rooms fetched successfully",
    );
  } catch (error) {
    ResponseUtil.serverError(res, error.message);
  }
};

// @desc    Get room by id
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate({
        path: "createdBy",
        select: "-password",
      })
      .populate({
        path: "updatedBy",
        select: "-password",
      });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private/Admin
export const createRoom = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      bed,
      area,
      capacity,
      quantity,
      status,
      bathroom,
      fireplace,
      views,
    } = req.body;

    const uploadedFiles = req.files || [];
    const thumbnailFile = uploadedFiles.find(
      (file) => file.fieldname === "thumbnail",
    );
    const imageFiles = uploadedFiles.filter(
      (file) => file.fieldname !== "thumbnail",
    );

    if (!thumbnailFile) {
      return ResponseUtil.badRequest(res, "Thumbnail file is required");
    }

    if (!title || !description || !bed) {
      return ResponseUtil.badRequest(
        res,
        "Title, description and bed are required",
      );
    }

    if (imageFiles.length > 5) {
      return ResponseUtil.badRequest(res, "Maximum 5 images are allowed");
    }

    const roomContent = {
      title,
      description,
      bed,
      bathroom: bathroom ?? "",
      fireplace: fireplace ?? "",
      views: views ?? "",
    };
    const translations = await createBilingualContent(roomContent);

    const [uploadedThumbnail, ...uploadedImages] = await Promise.all([
      uploadOnCloudinary(thumbnailFile.path, "mern-images"),
      ...imageFiles.map((file) => uploadOnCloudinary(file.path, "mern-images")),
    ]);

    const room = new Room({
      title,
      description,
      price,
      thumbnail: uploadedThumbnail.url,
      images: uploadedImages.map((image) => image.url),
      bed,
      area,
      capacity,
      quantity,
      createdBy: req.user._id,
      updatedBy: req.user._id,
      status,
      bathroom,
      fireplace,
      views,
      translations,
    });

    await room.save();

    ResponseUtil.created(res, room, "Room created successfully");
  } catch (error) {
    ResponseUtil.serverError(res, error.message);
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const contentFields = [
      "title",
      "description",
      "bed",
      "bathroom",
      "fireplace",
      "views",
    ];
    const allowedFields = [
      "price",
      "area",
      "capacity",
      "quantity",
      "status",
    ];

    if (contentFields.some((field) => typeof req.body[field] !== "undefined")) {
      const vietnameseContent = Object.fromEntries(
        contentFields.map((field) => [
          field,
          typeof req.body[field] !== "undefined"
            ? req.body[field]
            : (room.translations?.vi?.[field] ?? room[field] ?? ""),
        ]),
      );

      room.translations = await createBilingualContent(vietnameseContent);
      contentFields.forEach((field) => {
        room[field] = vietnameseContent[field];
      });
    }

    allowedFields.forEach((field) => {
      if (typeof req.body[field] !== "undefined") {
        room[field] = req.body[field];
      }
    });

    room.updatedBy = req.user._id;
    const updatedRoom = await room.save();

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const hasBookings = await Booking.exists({
      "bookingItems.roomId": room._id,
    });

    if (hasBookings) {
      return res.status(409).json({
        success: false,
        message:
          "Room has booking history. Set it to inactive instead of deleting it.",
      });
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// @desc    Search room
// @route   GET /api/rooms/AvailableRooms
// @access  Public
export const getAvailableRooms = async (req, res) => {
  try {
    const {
      checkInDate,
      checkOutDate,
      guests,
      rooms: roomCount,
      minPrice,
      maxPrice,
    } = req.query;
    const availableRooms = await findAvailableRooms({
      checkInDate,
      checkOutDate,
      guests,
      roomCount,
      minPrice,
      maxPrice,
    });

    const shouldPaginate = Boolean(req.query.page || req.query.limit);
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Math.min(
      Number(req.query.limit) > 0 ? Number(req.query.limit) : 10,
      100,
    );
    const total = availableRooms.length;
    const paginatedRooms = shouldPaginate
      ? availableRooms.slice((page - 1) * limit, page * limit)
      : availableRooms;

    res.status(200).json({
      success: true,
      message: "Get available rooms successfully",
      data: paginatedRooms,
      ...(shouldPaginate
        ? {
            pagination: {
              page,
              limit,
              total,
              totalPages: Math.max(1, Math.ceil(total / limit)),
            },
          }
        : {}),
    });
  } catch (error) {
    console.error("Get available rooms error:", error);

    if (error instanceof RoomAvailabilityError) {
      return res.status(error.status).json({ message: error.message });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};
