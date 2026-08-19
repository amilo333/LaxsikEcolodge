import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
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
      bathroom,
      fireplace,
      views,
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
// @desc    Search room
// @route   GET /api/rooms/AvailableRooms
// @access  Public
export const getAvailableRooms = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, guests } = req.query;

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        message: "Check-in and check-out dates are required",
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    if (checkIn >= checkOut) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date",
      });
    }

    // ==========================
    // Tìm các booking bị trùng ngày
    // ==========================

    const overlappingBookings = await Booking.find({
      bookingStatus: {
        $in: ["pending", "confirmed"],
      },

      checkInDate: {
        $lt: checkOut,
      },

      checkOutDate: {
        $gt: checkIn,
      },
    });

    // ==========================
    // Tính số phòng đã được đặt
    // ==========================

    const bookedRoomMap = {};

    overlappingBookings.forEach((booking) => {
      booking.bookingItems.forEach((item) => {
        const roomId = item.roomId.toString();

        if (!bookedRoomMap[roomId]) {
          bookedRoomMap[roomId] = 0;
        }

        bookedRoomMap[roomId] += item.quantity;
      });
    });

    // ==========================
    // Lấy tất cả phòng available
    // ==========================

    const rooms = await Room.find({
      status: "available",
    });

    // ==========================
    // Lọc phòng còn trống
    // ==========================

    const availableRooms = rooms
      .map((room) => {
        const bookedQuantity = bookedRoomMap[room._id.toString()] || 0;

        const availableQuantity = room.quantity - bookedQuantity;

        return {
          ...room.toObject(),
          availableQuantity,
        };
      })
      .filter((room) => {
        if (room.availableQuantity <= 0) {
          return false;
        }

        if (guests) {
          return room.capacity >= Number(guests);
        }

        return true;
      });

    res.status(200).json({
      message: "Get available rooms successfully",
      data: availableRooms,
    });
  } catch (error) {
    console.error("Get available rooms error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
