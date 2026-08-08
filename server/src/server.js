import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import { route } from "./routes/index.js";
import { setServers } from "node:dns/promises";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
setServers(["1.1.1.1", "8.8.8.8"]);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// CORS (đặt trước routes)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// Parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

route(app);
// Routes
// app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
