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

router.route("/").get(authenticate, authorizedAdmin, getAllUsers);

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

export { router as userRouter };
