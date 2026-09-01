import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    eyebrow: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    rhythm: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    highlights: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 160,
        },
      ],
      default: [],
      validate: {
        validator: (items) => items.length <= 8,
        message: "A tour can have at most 8 highlights",
      },
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
      validate: Number.isInteger,
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

tourSchema.index({ status: 1, sortOrder: 1, createdAt: -1 });

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
