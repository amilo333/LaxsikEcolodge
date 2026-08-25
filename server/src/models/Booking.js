import mongoose from "mongoose";

const bookingItemSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookingItems: {
      type: [bookingItemSchema],
      required: true,
    },

    checkInDate: {
      type: Date,
      required: true,
    },

    checkOutDate: {
      type: Date,
      required: true,
    },

    totalNights: {
      type: Number,
      required: true,
      min: 1,
    },

    // Tổng tiền phòng trước voucher
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    voucherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
      default: null,
    },

    // Số tiền được giảm
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Thuế / phí
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Tổng tiền cuối cùng
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed", "refunded"],
      default: "unpaid",
    },

    paymentMethod: {
      type: String,
      enum: ["banking", "vnpay", "momo"],
      default: null,
    },

    customerInfo: {
      fullNameContact: {
        type: String,
        required: true,
        trim: true,
      },

      phoneContact: {
        type: String,
        required: true,
        trim: true,
      },

      emailContact: {
        type: String,
        required: true,
        trim: true,
      },

      note: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
