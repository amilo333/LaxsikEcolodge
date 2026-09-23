import mongoose from "mongoose";
import { createTranslationsSchema } from "./translation-schema.js";

const diningServiceTranslationsSchema = createTranslationsSchema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
});

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

    translations: {
      type: diningServiceTranslationsSchema,
      default: undefined,
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
