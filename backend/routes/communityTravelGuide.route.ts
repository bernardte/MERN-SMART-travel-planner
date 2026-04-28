import express from "express";
import { asyncHandler } from "../utils/async_handler";
import communityTravelGuideController from "../controllers/communityTravelGuide.controller";
import { protectRoute } from "../middleware/protect_route.middleware";
import { upload } from "../middleware/multer.middleware";

const route = express.Router();

route.get("/itineraries/:authorId", protectRoute, asyncHandler(communityTravelGuideController.fetchUserItinerary));
route.post("/create/post", protectRoute, upload.single("image"), asyncHandler(communityTravelGuideController.createPost));
route.get(
  "/public-posts",
  protectRoute,
  asyncHandler(communityTravelGuideController.getAllPublicPost),
);
route.delete(
  "/delete-own-post/:postId",
  protectRoute,
  asyncHandler(communityTravelGuideController.deleteOwnPost),
);
export default route;