import Room from "../models/Room.js";
import { uploadOnCloudinary } from "../service/cloudinary.js";
import { ResponseUtil } from "../utils/response.util.js";

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
export const getAllRooms = async (req, res) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      Room.find()
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
      Room.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

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
    const { title, description, price, bed, area, capacity, quantity, status } =
      req.body;

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

    if (imageFiles.length > 5) {
      return ResponseUtil.badRequest(res, "Maximum 5 images are allowed");
    }

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

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id,
      },
      {
        new: true,
        runValidators: true,
      },
    );

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
