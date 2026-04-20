import express from "express";
import usersController from "../controllers/users.controller";
import { asyncHandler } from "../utils/async_handler";
import { protectRoute } from "../middleware/protect_route.middleware";

const router = express.Router();

router.post("/register-account", asyncHandler(usersController.registerAccount));
router.post("/login", protectRoute, asyncHandler(usersController.loginAccount));

export default router;
