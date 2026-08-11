import mongoose from "mongoose";

const diningServiceSchema = new mongoose.Schema(
  {
    diningId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dining",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const DiningService = mongoose.model("DiningService", diningServiceSchema);

export default DiningService;
