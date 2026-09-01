import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const migrateAuthIndexes = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const indexes = await User.collection.indexes();
  const phoneIndex = indexes.find((index) => index.name === "phone_1");

  if (phoneIndex && !phoneIndex.partialFilterExpression) {
    await User.collection.dropIndex("phone_1");
  }

  await User.createIndexes();
  console.log("Authentication indexes are up to date");
};

migrateAuthIndexes()
  .catch((error) => {
    console.error("Authentication index migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
