import mongoose from "mongoose";
import { createTranslationsSchema } from "./translation-schema.js";

const spaTranslationsSchema = createTranslationsSchema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
});

const spaSchema = new mongoose.Schema(
  {
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
      type: spaTranslationsSchema,
      default: undefined,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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
  },
  {
    timestamps: true,
  },
);

const Spa = mongoose.model("Spa", spaSchema);

export default Spa;
