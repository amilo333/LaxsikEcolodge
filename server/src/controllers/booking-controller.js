import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import Voucher from "../models/Voucher.js";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const CANCELLATION_WINDOW_MS = 48 * 60 * 60 * 1000;
const CHECK_IN_TIME_WITH_OFFSET = "T15:00:00+07:00";

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
    // 9. Tính phí dịch vụ (5%) và thuế (10%) sau giảm giá
    // ======================================

    const SERVICE_CHARGE_RATE = 0.05;
    const TAX_RATE = 0.1;

    const serviceChargeAmount = amountAfterDiscount * SERVICE_CHARGE_RATE;
    const taxAmount = amountAfterDiscount * TAX_RATE;

    // ======================================
    // 10. Tính tổng tiền
    // ======================================

    const totalAmount = amountAfterDiscount + serviceChargeAmount + taxAmount;

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

      serviceChargeAmount,

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

    const scheduledCheckIn = new Date(
      `${booking.checkInDate.toISOString().slice(0, 10)}${CHECK_IN_TIME_WITH_OFFSET}`,
    );
    const cancellationDeadline = new Date(
      scheduledCheckIn.getTime() - CANCELLATION_WINDOW_MS,
    );

    if (Date.now() > cancellationDeadline.getTime()) {
      return res.status(400).json({
        message:
          "Booking can only be cancelled at least 48 hours before check-in",
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
      500,
    );
    const search = req.query.search?.trim();
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    let query = {};

    if ((dateFrom && !dateTo) || (!dateFrom && dateTo)) {
      return res.status(400).json({
        message: "Both dateFrom and dateTo are required",
      });
    }

    if (dateFrom && dateTo) {
      const rangeStart = new Date(dateFrom);
      const rangeEnd = new Date(dateTo);

      if (
        Number.isNaN(rangeStart.getTime()) ||
        Number.isNaN(rangeEnd.getTime()) ||
        rangeStart >= rangeEnd
      ) {
        return res.status(400).json({ message: "Invalid booking date range" });
      }

      query.checkInDate = { $lt: rangeEnd };
      query.checkOutDate = { $gt: rangeStart };
    }

    if (search) {
      const searchRegex = {
        $regex: escapeRegExp(search),
        $options: "i",
      };
      const roomIds = await Room.find({ title: searchRegex }).distinct("_id");

      query.$or = [
        { bookingCode: searchRegex },
        { "customerInfo.fullNameContact": searchRegex },
        { "customerInfo.emailContact": searchRegex },
        { "customerInfo.phoneContact": searchRegex },
        { "bookingItems.roomId": { $in: roomIds } },
      ];
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
    const now = new Date();
    const vietnamOffsetMs = 7 * 60 * 60 * 1000;
    const vietnamNow = new Date(now.getTime() + vietnamOffsetMs);
    const toVietnamBoundary = (year, month, day) =>
      new Date(Date.UTC(year, month, day) - vietnamOffsetMs);
    const currentMonthStart = toVietnamBoundary(
      vietnamNow.getUTCFullYear(),
      vietnamNow.getUTCMonth(),
      1,
    );
    const nextMonthStart = toVietnamBoundary(
      vietnamNow.getUTCFullYear(),
      vietnamNow.getUTCMonth() + 1,
      1,
    );
    const previousMonthStart = toVietnamBoundary(
      vietnamNow.getUTCFullYear(),
      vietnamNow.getUTCMonth() - 1,
      1,
    );
    const todayStart = toVietnamBoundary(
      vietnamNow.getUTCFullYear(),
      vietnamNow.getUTCMonth(),
      vietnamNow.getUTCDate(),
    );
    const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const daysInCurrentMonth = Math.round(
      (nextMonthStart.getTime() - currentMonthStart.getTime()) /
        (24 * 60 * 60 * 1000),
    );
    const trendStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1),
    );
    const [
      totalUsers,
      activeUsers,
      totalRooms,
      availableRooms,
      totalBookings,
      pendingBookings,
      revenueResult,
      recentBookings,
      trendResult,
      statusResult,
      monthlyMetricsResult,
      roomsForOccupancy,
      occupancyBookings,
      checkInsToday,
      checkOutsToday,
      unpaidBookings,
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
      Booking.aggregate([
        { $match: { createdAt: { $gte: trendStart } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" },
            },
            bookings: { $sum: 1 },
            guestIds: {
              $addToSet: {
                $cond: [
                  { $ne: ["$bookingStatus", "cancelled"] },
                  "$userId",
                  null,
                ],
              },
            },
            paidRevenue: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalAmount", 0],
              },
            },
          },
        },
        {
          $project: {
            bookings: 1,
            paidRevenue: 1,
            guests: {
              $size: { $setDifference: ["$guestIds", [null]] },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Booking.aggregate([
        { $group: { _id: "$bookingStatus", count: { $sum: 1 } } },
      ]),
      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: previousMonthStart, $lt: nextMonthStart },
          },
        },
        {
          $group: {
            _id: {
              $cond: [
                { $gte: ["$createdAt", currentMonthStart] },
                "current",
                "previous",
              ],
            },
            bookings: { $sum: 1 },
            paidBookings: {
              $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0] },
            },
            paidRevenue: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalAmount", 0],
              },
            },
          },
        },
      ]),
      Room.find({ status: { $in: ["available", "maintenance"] } })
        .select("title quantity status")
        .lean(),
      Booking.find({
        bookingStatus: { $in: ["confirmed", "completed"] },
        checkInDate: { $lt: nextMonthStart },
        checkOutDate: { $gt: currentMonthStart },
      })
        .select("checkInDate checkOutDate bookingItems")
        .lean(),
      Booking.countDocuments({
        bookingStatus: "confirmed",
        checkInDate: { $gte: todayStart, $lt: tomorrowStart },
      }),
      Booking.countDocuments({
        bookingStatus: { $in: ["confirmed", "completed"] },
        checkOutDate: { $gte: todayStart, $lt: tomorrowStart },
      }),
      Booking.countDocuments({
        bookingStatus: { $ne: "cancelled" },
        paymentStatus: { $in: ["unpaid", "pending"] },
      }),
    ]);

    const bookingTrend = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        Date.UTC(
          trendStart.getUTCFullYear(),
          trendStart.getUTCMonth() + index,
          1,
        ),
      );
      const key = `${date.getUTCFullYear()}-${String(
        date.getUTCMonth() + 1,
      ).padStart(2, "0")}`;
      const item = trendResult.find((entry) => entry._id === key);

      return {
        month: key,
        label: new Intl.DateTimeFormat("vi-VN", {
          month: "short",
          year: "2-digit",
          timeZone: "UTC",
        }).format(date),
        bookings: item?.bookings ?? 0,
        guests: item?.guests ?? 0,
        paidRevenue: item?.paidRevenue ?? 0,
      };
    });
    const bookingStatus = [
      "pending",
      "confirmed",
      "cancelled",
      "completed",
    ].map((status) => ({
      status,
      count: statusResult.find((entry) => entry._id === status)?.count ?? 0,
    }));
    const currentMonthMetrics = monthlyMetricsResult.find(
      (item) => item._id === "current",
    );
    const previousMonthMetrics = monthlyMetricsResult.find(
      (item) => item._id === "previous",
    );
    const currentMonthRevenue = currentMonthMetrics?.paidRevenue ?? 0;
    const previousMonthRevenue = previousMonthMetrics?.paidRevenue ?? 0;
    const currentMonthBookings = currentMonthMetrics?.bookings ?? 0;
    const previousMonthBookings = previousMonthMetrics?.bookings ?? 0;
    const currentMonthPaidBookings = currentMonthMetrics?.paidBookings ?? 0;
    const getGrowthPercent = (current, previous) =>
      previous > 0
        ? Math.round(((current - previous) / previous) * 1000) / 10
        : null;

    const roomPerformanceMap = new Map(
      roomsForOccupancy
        .filter((room) => room.status === "available")
        .map((room) => [
          room._id.toString(),
          {
            roomId: room._id,
            title: room.title,
            bookedRoomNights: 0,
            availableRoomNights: room.quantity * daysInCurrentMonth,
            bookingIds: new Set(),
          },
        ]),
    );

    occupancyBookings.forEach((booking) => {
      const overlapStart = Math.max(
        booking.checkInDate.getTime(),
        currentMonthStart.getTime(),
      );
      const overlapEnd = Math.min(
        booking.checkOutDate.getTime(),
        nextMonthStart.getTime(),
      );
      const nights = Math.max(
        0,
        Math.ceil((overlapEnd - overlapStart) / (24 * 60 * 60 * 1000)),
      );

      booking.bookingItems.forEach((item) => {
        const roomMetric = roomPerformanceMap.get(item.roomId.toString());
        if (!roomMetric || nights === 0) return;

        roomMetric.bookedRoomNights += item.quantity * nights;
        roomMetric.bookingIds.add(booking._id.toString());
      });
    });

    const allRoomPerformance = Array.from(roomPerformanceMap.values())
      .map((room) => ({
        roomId: room.roomId,
        title: room.title,
        bookings: room.bookingIds.size,
        bookedRoomNights: room.bookedRoomNights,
        availableRoomNights: room.availableRoomNights,
        occupancyRate:
          room.availableRoomNights > 0
            ? Math.min(
                100,
                Math.round(
                  (room.bookedRoomNights / room.availableRoomNights) * 1000,
                ) / 10,
              )
            : 0,
      }))
      .sort(
        (first, second) =>
          second.occupancyRate - first.occupancyRate ||
          second.bookedRoomNights - first.bookedRoomNights,
      );
    const roomPerformance = allRoomPerformance.slice(0, 5);
    const availableRoomNights = allRoomPerformance.reduce(
      (total, room) => total + room.availableRoomNights,
      0,
    );
    const occupiedRoomNights = allRoomPerformance.reduce(
      (total, room) => total + room.bookedRoomNights,
      0,
    );
    const occupancyRate =
      availableRoomNights > 0
        ? Math.min(
            100,
            Math.round((occupiedRoomNights / availableRoomNights) * 1000) / 10,
          )
        : 0;
    const maintenanceRooms = roomsForOccupancy
      .filter((room) => room.status === "maintenance")
      .reduce((total, room) => total + room.quantity, 0);

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
        bookingTrend,
        bookingStatus,
        currentMonthRevenue,
        revenueGrowthPercent: getGrowthPercent(
          currentMonthRevenue,
          previousMonthRevenue,
        ),
        currentMonthBookings,
        bookingGrowthPercent: getGrowthPercent(
          currentMonthBookings,
          previousMonthBookings,
        ),
        currentMonthPaidBookings,
        averageBookingValue:
          currentMonthPaidBookings > 0
            ? Math.round(currentMonthRevenue / currentMonthPaidBookings)
            : 0,
        occupancyRate,
        occupiedRoomNights,
        availableRoomNights,
        roomPerformance,
        checkInsToday,
        checkOutsToday,
        unpaidBookings,
        maintenanceRooms,
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
