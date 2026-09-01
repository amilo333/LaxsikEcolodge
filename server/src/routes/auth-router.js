import express from "express";
import {
  forgotPassword,
  googleLogin,
  linkGoogleAccount,
  login,
  logout,
  register,
  resetPassword,
} from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/google", googleLogin);
router.post("/google/link", linkGoogleAccount);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);

export { router as authRouter };
