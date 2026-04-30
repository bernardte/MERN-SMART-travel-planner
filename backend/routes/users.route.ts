import express from "express";
import usersController from "../controllers/users.controller";
import { asyncHandler } from "../utils/async_handler";
import { protectRoute } from "../middleware/protect_route.middleware";

const router = express.Router();

router.post("/register-account", asyncHandler(usersController.registerAccount));
router.post("/login", asyncHandler(usersController.loginAccount));
router.post("/logout", protectRoute, asyncHandler(usersController.logoutAccount));
router.get("/get-login-user", protectRoute, asyncHandler(usersController.getLoginUser));
router.get("/get-user-profile/:username", protectRoute, asyncHandler(usersController.getUserProfile));
router.get("/get-user-publish-travel-guide/:userId", protectRoute, asyncHandler(usersController.getUserPublishTravelGuide));
router.patch(
  "/follow-unfollow-user/:userId",
  protectRoute,
  asyncHandler(usersController.followAndUnfollowUser),
);
export default router;
