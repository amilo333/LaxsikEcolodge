import { authRouter } from "./auth-router.js";

export function route(app) {
  app.use("/api/auth", authRouter);
  app.use("/api/user", () => {});
}
