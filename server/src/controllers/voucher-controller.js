import Voucher from "../models/Voucher.js";
import Booking from "../models/Booking.js";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// CREATE
export const createVoucher = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      quantity,
      startDate,
      endDate,
      status,
    } = req.body;

    const existingVoucher = await Voucher.findOne({
      code: code.toUpperCase(),
    });

    if (existingVoucher) {
      return res.status(400).json({
        message: "Voucher code already exists",
      });
    }

    const voucher = await Voucher.create({
      code,
      discountType,
      discountValue,
      quantity,
      startDate,
      endDate,
      status,
    });

    res.status(201).json({
      message: "Voucher created successfully",
      data: voucher,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL
export const getAllVouchers = async (req, res) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Math.min(
      Number(req.query.limit) > 0 ? Number(req.query.limit) : 10,
      100,
    );
    const search = req.query.search?.trim();
    const query = {};

    if (search) {
      query.code = { $regex: escapeRegExp(search), $options: "i" };
    }

    if (["active", "inactive"].includes(req.query.status)) {
      query.status = req.query.status;
    }

    const [vouchers, total] = await Promise.all([
      Voucher.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Voucher.countDocuments(query),
    ]);

    res.status(200).json({
      message: "Get vouchers successfully",
      data: vouchers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET BY ID
export const getVoucherById = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);

    if (!voucher) {
      return res.status(404).json({
        message: "Voucher not found",
      });
    }

    res.status(200).json({
      message: "Get voucher successfully",
      data: voucher,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE
export const updateVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);

    if (!voucher) {
      return res.status(404).json({
        message: "Voucher not found",
      });
    }

    const {
      code,
      discountType,
      discountValue,
      quantity,
      startDate,
      endDate,
      status,
    } = req.body;

    if (code && code.toUpperCase() !== voucher.code) {
      const existingVoucher = await Voucher.findOne({
        code: code.toUpperCase(),
        _id: { $ne: req.params.id },
      });

      if (existingVoucher) {
        return res.status(400).json({
          message: "Voucher code already exists",
        });
      }
    }

    voucher.code = code?.toUpperCase() || voucher.code;
    voucher.discountType = discountType ?? voucher.discountType;
    voucher.discountValue = discountValue ?? voucher.discountValue;
    voucher.quantity = quantity ?? voucher.quantity;
    voucher.startDate = startDate ?? voucher.startDate;
    voucher.endDate = endDate ?? voucher.endDate;
    voucher.status = status ?? voucher.status;

    await voucher.save();

    res.status(200).json({
      message: "Voucher updated successfully",
      data: voucher,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE
export const deleteVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);

    if (!voucher) {
      return res.status(404).json({
        message: "Voucher not found",
      });
    }

    const bookingCount = await Booking.countDocuments({
      voucherId: voucher._id,
    });

    if (bookingCount > 0) {
      return res.status(409).json({
        message:
          "Voucher has booking history and cannot be deleted. Set it to inactive instead.",
      });
    }

    await voucher.deleteOne();

    res.status(200).json({
      message: "Voucher deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// VALIDATE VOUCHER
export const validateVoucher = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "Voucher code is required",
      });
    }

    const voucher = await Voucher.findOne({
      code: code.toUpperCase(),
    });

    if (!voucher) {
      return res.status(404).json({
        message: "Voucher not found",
      });
    }

    const now = new Date();

    if (voucher.status !== "active") {
      return res.status(400).json({
        message: "Voucher is inactive",
      });
    }

    if (now < voucher.startDate || now > voucher.endDate) {
      return res.status(400).json({
        message: "Voucher has expired or is not available yet",
      });
    }

    if (voucher.quantity <= 0) {
      return res.status(400).json({
        message: "Voucher is out of stock",
      });
    }

    res.status(200).json({
      message: "Voucher is valid",
      data: voucher,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
