import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      enum: ["percentage", "currency"],
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    expiredTime: {
      type: Date,
      required: true,
    },

    quantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Voucher = mongoose.model("Voucher", voucherSchema);

export default Voucher;
