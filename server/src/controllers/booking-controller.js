import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import Voucher from "../models/Voucher.js";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ======================================
// Generate booking code
// ======================================

const generateBookingCode = () => {
  return `BOOK-${Date.now()}`;
};

// ======================================
// CREATE BOOKING
// ======================================

export const createBooking = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      bookingItems,
      checkInDate,
      checkOutDate,
      voucherCode,
      paymentMethod,
      customerInfo,
    } = req.body;

    // ======================================
    // 1. Validate dữ liệu
    // ======================================

    if (!bookingItems || bookingItems.length === 0) {
      return res.status(400).json({
        message: "Booking items are required",
      });
    }

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        message: "Check-in and check-out dates are required",
      });
    }

    if (!customerInfo) {
      return res.status(400).json({
        message: "Customer information is required",
      });
    }

    if (
      !customerInfo.fullNameContact ||
      !customerInfo.phoneContact ||
      !customerInfo.emailContact
    ) {
      return res.status(400).json({
        message: "Customer information is incomplete",
      });
    }

    // ======================================
    // 2. Kiểm tra ngày
    // ======================================

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

    // ======================================
    // 3. Tính số đêm
    // ======================================

    const totalNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    // ======================================
    // 4. Tìm booking trùng ngày
    // ======================================

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

    // ======================================
    // 5. Tính số phòng đã được đặt
    // ======================================

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

    // ======================================
    // 6. Kiểm tra phòng + tính subtotal
    // ======================================

    let subtotal = 0;

    const processedItems = [];

    for (const item of bookingItems) {
      const room = await Room.findById(item.roomId);

      if (!room) {
        return res.status(404).json({
          message: "Room not found",
        });
      }

      if (room.status !== "available") {
        return res.status(400).json({
          message: `${room.title} is not available`,
        });
      }

      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({
          message: "Room quantity must be at least 1",
        });
      }

      // Số phòng đã được đặt trong khoảng ngày
      const bookedQuantity = bookedRoomMap[room._id.toString()] || 0;

      // Số phòng còn lại
      const availableQuantity = room.quantity - bookedQuantity;

      if (item.quantity > availableQuantity) {
        return res.status(400).json({
          message: `Only ${availableQuantity} room(s) available for ${room.title}`,
        });
      }

      // ======================================
      // Tính tiền phòng
      // ======================================

      const itemTotal = room.price * item.quantity * totalNights;

      subtotal += itemTotal;

      // Lưu giá hiện tại vào booking
      processedItems.push({
        roomId: room._id,
        quantity: item.quantity,
        pricePerNight: room.price,
      });
    }

    // ======================================
    // 7. Kiểm tra voucher
    // ======================================

    let voucherId = null;
    let discountAmount = 0;

    if (voucherCode) {
      const voucher = await Voucher.findOne({
        code: voucherCode.toUpperCase(),
      });

      if (!voucher) {
        return res.status(404).json({
          message: "Voucher not found",
        });
      }

      const now = new Date();

      // Kiểm tra trạng thái
      if (voucher.status !== "active") {
        return res.status(400).json({
          message: "Voucher is inactive",
        });
      }

      // Kiểm tra thời gian
      if (now < voucher.startDate || now > voucher.endDate) {
        return res.status(400).json({
          message: "Voucher is expired or not available",
        });
      }

      // Kiểm tra số lượng
      if (voucher.quantity <= 0) {
        return res.status(400).json({
          message: "Voucher is out of stock",
        });
      }

      // ======================================
      // Voucher giảm theo %
      // ======================================

      if (voucher.discountType === "percent") {
        discountAmount = (subtotal * voucher.discountValue) / 100;
      }

      // ======================================
      // Voucher giảm số tiền
      // ======================================

      if (voucher.discountType === "amount") {
        discountAmount = voucher.discountValue;
      }

      // Không cho giảm quá subtotal
      if (discountAmount > subtotal) {
        discountAmount = subtotal;
      }

      voucherId = voucher._id;
    }

    // ======================================
    // 8. Tính tiền sau giảm giá
    // ======================================

    const amountAfterDiscount = subtotal - discountAmount;

    // ======================================
    // 9. Tính thuế / phí
    // 5%
    // ======================================

    const TAX_RATE = 0.05;

    const taxAmount = amountAfterDiscount * TAX_RATE;

    // ======================================
    // 10. Tính tổng tiền
    // ======================================

    const totalAmount = amountAfterDiscount + taxAmount;

    // ======================================
    // 11. Tạo Booking
    // ======================================

    const booking = await Booking.create({
      bookingCode: generateBookingCode(),

      userId,

      bookingItems: processedItems,

      checkInDate: checkIn,

      checkOutDate: checkOut,

      totalNights,

      subtotal,

      voucherId,

      discountAmount,

      taxAmount,

      totalAmount,

      bookingStatus: "pending",

      paymentStatus: "unpaid",

      paymentMethod: paymentMethod || null,

      customerInfo: {
        fullNameContact: customerInfo.fullNameContact,

        phoneContact: customerInfo.phoneContact,

        emailContact: customerInfo.emailContact,

        note: customerInfo.note || "",
      },
    });

    // ======================================
    // 12. Trừ số lượng voucher
    // ======================================

    if (voucherId) {
      await Voucher.findByIdAndUpdate(voucherId, {
        $inc: {
          quantity: -1,
        },
      });
    }

    // ======================================
    // 13. Response
    // ======================================

    return res.status(201).json({
      message: "Booking created successfully",

      data: booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// GET MY BOOKINGS
// ======================================

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({
      userId,
    })
      .populate("bookingItems.roomId")
      .populate("voucherId")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      message: "Get bookings successfully",

      data: bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// GET BOOKING BY ID
// ======================================

export const getBookingById = async (req, res) => {
  try {
    const userId = req.user._id;

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId,
    })
      .populate("bookingItems.roomId")
      .populate("voucherId");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      message: "Get booking successfully",

      data: booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// CANCEL BOOKING
// ======================================

export const cancelBooking = async (req, res) => {
  try {
    const userId = req.user._id;

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    if (booking.bookingStatus === "completed") {
      return res.status(400).json({
        message: "Completed booking cannot be cancelled",
      });
    }

    booking.bookingStatus = "cancelled";

    await booking.save();

    return res.status(200).json({
      message: "Booking cancelled successfully",

      data: booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// ADMIN: GET ALL BOOKINGS
// ======================================

export const getAllBookingsAdmin = async (req, res) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Math.min(
      Number(req.query.limit) > 0 ? Number(req.query.limit) : 10,
      100,
    );
    const search = req.query.search?.trim();
    let query = {};

    if (search) {
      const searchRegex = {
        $regex: escapeRegExp(search),
        $options: "i",
      };
      const roomIds = await Room.find({ title: searchRegex }).distinct("_id");

      query = {
        $or: [
          { bookingCode: searchRegex },
          { "customerInfo.fullNameContact": searchRegex },
          { "customerInfo.emailContact": searchRegex },
          { "customerInfo.phoneContact": searchRegex },
          { "bookingItems.roomId": { $in: roomIds } },
        ],
      };
    }

    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate("userId", "full_name email phone role status")
        .populate("bookingItems.roomId")
        .populate("voucherId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      message: "Get all bookings successfully",
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error("Admin get bookings error:", error);

    return res.status(500).json({
      message: "Unable to get bookings",
    });
  }
};

// ======================================
// ADMIN: DASHBOARD SUMMARY
// ======================================

export const getAdminDashboardSummary = async (_req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalRooms,
      availableRooms,
      totalBookings,
      pendingBookings,
      revenueResult,
      recentBookings,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: true }),
      Room.countDocuments(),
      Room.countDocuments({ status: "available" }),
      Booking.countDocuments(),
      Booking.countDocuments({ bookingStatus: "pending" }),
      Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Booking.find()
        .populate("userId", "full_name email phone role status")
        .populate("bookingItems.roomId")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    return res.status(200).json({
      message: "Get admin dashboard summary successfully",
      data: {
        totalUsers,
        activeUsers,
        totalRooms,
        availableRooms,
        totalBookings,
        pendingBookings,
        paidRevenue: revenueResult[0]?.total ?? 0,
        recentBookings,
      },
    });
  } catch (error) {
    console.error("Admin dashboard summary error:", error);

    return res.status(500).json({
      message: "Unable to get dashboard summary",
    });
  }
};

// ======================================
// ADMIN: UPDATE BOOKING STATUS
// ======================================

export const updateBookingAdmin = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const bookingStatuses = ["pending", "confirmed", "cancelled", "completed"];
    const paymentStatuses = ["unpaid", "pending", "paid", "failed", "refunded"];

    if (
      req.body.bookingStatus &&
      !bookingStatuses.includes(req.body.bookingStatus)
    ) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    if (
      req.body.paymentStatus &&
      !paymentStatuses.includes(req.body.paymentStatus)
    ) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    if (req.body.bookingStatus) {
      booking.bookingStatus = req.body.bookingStatus;
    }

    if (req.body.paymentStatus) {
      booking.paymentStatus = req.body.paymentStatus;

      if (
        req.body.paymentStatus === "paid" &&
        booking.bookingStatus === "pending"
      ) {
        booking.bookingStatus = "confirmed";
      }
    }

    await booking.save();
    await booking.populate("userId", "full_name email phone role status");
    await booking.populate("bookingItems.roomId");
    await booking.populate("voucherId");

    return res.status(200).json({
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Admin update booking error:", error);

    return res.status(500).json({
      message: "Unable to update booking",
    });
  }
};
