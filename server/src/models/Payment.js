import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Mã giao dịch do VNPay/MoMo trả về
    transactionCode: {
      type: String,
      unique: true,
      sparse: true,
    },

    // requestId dùng nhiều cho MoMo
    requestId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // VNPay: vnp_TxnRef
    // MoMo: orderId
    providerOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["banking", "vnpay", "momo"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },

    gatewayResponse: {
      type: Object,
      default: () => ({}),
    },

    gatewayRequest: {
      type: Object,
      default: () => ({}),
    },

    paidAt: {
      type: Date,
      default: null,
    },

    refundAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
