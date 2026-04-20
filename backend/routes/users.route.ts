import express from "express";
import usersController from "../controllers/users.controller";
import { asyncHandler } from "../utils/async_handler";
import { protectRoute } from "../middleware/protect_route.middleware";

const router = express.Router();

router.post("/register-account", asyncHandler(usersController.registerAccount));
router.post("/login", asyncHandler(usersController.loginAccount));
router.post("/logout", protectRoute, asyncHandler(usersController.logoutAccount));

export default router;
