import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import { createOpenAIChatReply } from "../service/openai-chat.js";

dotenv.config();

const question =
  process.argv.slice(2).join(" ").trim() || "Phòng nào có view núi?";

try {
  await connectDB();
  const reply = await createOpenAIChatReply([
    { role: "user", content: question },
  ]);

  console.log(`Question: ${question}`);
  console.log(`Tools: ${reply.toolsUsed.join(", ") || "none"}`);
  console.log(`Answer: ${reply.message}`);
  console.log(`Room cards: ${reply.rooms.length}`);
  for (const room of reply.rooms) {
    console.log(
      `- ${room.title}: /rooms/${room.id}${room.stay ? ` (${room.stay.checkInDate} to ${room.stay.checkOutDate})` : ""}`,
    );
  }
} catch (error) {
  console.error("Chatbot check failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
