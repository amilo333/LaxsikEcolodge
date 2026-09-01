import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
      default: null,
      trim: true,
    },

    google_id: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    status: {
      type: Boolean,
      default: true,
    },

    password_reset_token: {
      type: String,
      default: null,
      select: false,
    },

    password_reset_expires: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: { phone: { $type: "string", $gt: "" } },
  },
);
userSchema.index(
  { google_id: 1 },
  {
    unique: true,
    partialFilterExpression: { google_id: { $type: "string" } },
  },
);
userSchema.index({ password_reset_token: 1 });

export default mongoose.model("User", userSchema);
