import { authRouter } from "./auth-router.js";
import { imageRouter } from "./image-router.js";
import { roomRouter } from "./room-router.js";
import { userRouter } from "./userRoutes.js";

export function route(app) {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/rooms", roomRouter);
  app.use("/api/images", imageRouter);
}
