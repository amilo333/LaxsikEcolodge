import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import { syncLaxsikKnowledge } from "../service/knowledge-sync.js";

dotenv.config();

try {
  await connectDB();
  const result = await syncLaxsikKnowledge();
  console.log(
    `Knowledge sync complete: ${result.total} total, ${result.embedded} embedded, ${result.unchanged} unchanged.`,
  );
} catch (error) {
  console.error("Knowledge sync failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
