import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import { searchLaxsikKnowledge } from "../service/knowledge-search.js";

dotenv.config();

const argumentsList = process.argv.slice(2);
const allowedCategories = new Set([
  "overview",
  "contact",
  "policy",
  "room",
  "dining",
  "spa",
  "tour",
  "experience",
]);
const categoryArgument = argumentsList.find((argument) =>
  argument.startsWith("--category="),
);
const positionalCategory = allowedCategories.has(argumentsList[0])
  ? argumentsList[0]
  : null;
const category =
  categoryArgument?.split("=")[1] ||
  positionalCategory ||
  process.env.npm_config_category ||
  null;
const query =
  argumentsList
    .filter(
      (argument) =>
        argument !== categoryArgument && argument !== positionalCategory,
    )
    .join(" ")
    .trim() || "phòng có view núi";

try {
  await connectDB();
  const result = await searchLaxsikKnowledge({
    query,
    category,
    limit: 5,
  });

  if (!result.ok) {
    throw new Error(result.error);
  }

  console.log(`Knowledge query: ${query}`);
  console.log(`Category: ${category || "all"}`);
  console.log(`Matches: ${result.matches.length}`);
  result.matches.forEach((match, index) => {
    console.log(
      `${index + 1}. ${match.title} [${match.category}] score=${Number(match.score).toFixed(4)}`,
    );
    console.log(`   ${match.content}`);
  });
} catch (error) {
  console.error("Knowledge search check failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
