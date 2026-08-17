import mongoose from "mongoose";

const bookingRoomSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    roomQuantity: {
      type: Number,
      required: true,
      min: 1,
    },

    guestQuantity: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const bookingSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    promoCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
    },

    specialRequest: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      requried: true,
      trim: true,
    },

    rooms: [bookingRoomSchema],
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
