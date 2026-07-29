import { Router } from "express";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getCurrentUserProfile,
  getUserById,
  loginUser,
  logoutCurrentUser,
  updateCurrentProfile,
  updateUserById,
} from "../controllers/userController.js";
import { authenticate, authorizedAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizedAdmin, getAllUsers);
router.route("/auth/login").post(loginUser);
router.route("/auth/logout").post(logoutCurrentUser);

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentProfile);

//ADMIN ROUTES 😎
router
  .route("/:id")
  .delete(authenticate, authorizedAdmin, deleteUserById)
  .get(authenticate, authorizedAdmin, getUserById)
  .put(authenticate, authorizedAdmin, updateUserById);

export default router;
