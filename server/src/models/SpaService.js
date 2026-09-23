import mongoose from "mongoose";
import { createTranslationsSchema } from "./translation-schema.js";

const spaServiceTranslationsSchema = createTranslationsSchema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
});

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

    translations: {
      type: spaServiceTranslationsSchema,
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

const SpaService = mongoose.model("SpaService", spaServiceSchema);

export default SpaService;
