import mongoose from "mongoose";

const spaServiceSchema = new mongoose.Schema(
  {
    spaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Spa",
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

const SpaService = mongoose.model("SpaService", spaServiceSchema);

export default SpaService;
