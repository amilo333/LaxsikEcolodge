import { authRouter } from "./auth-router.js";
import { bookingRouter } from "./booking-router.js";
import { diningRouter } from "./dining-router.js";
import { diningServiceRouter } from "./dining-service-router.js";
import { imageRouter } from "./image-router.js";
import { roomRouter } from "./room-router.js";
import { spaRouter } from "./spa-router.js";
import { spaServiceRouter } from "./spa-service-router.js";
import { userRouter } from "./userRoutes.js";
import { voucherRouter } from "./voucher-router.js";

export function route(app) {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/rooms", roomRouter);
  app.use("/api/images", imageRouter);
  app.use("/api/dining", diningRouter);
  app.use("/api/dining-services", diningServiceRouter);
  app.use("/api/spa-massage", spaRouter);
  app.use("/api/spa-services", spaServiceRouter);
  app.use("/api/voucher", voucherRouter);
  app.use("/api/booking", bookingRouter);
}
