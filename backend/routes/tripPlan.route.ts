import express from "express";
import multer from "multer";
import { asyncHandler } from "../utils/async_handler";
import { protectRoute } from "../middleware/protect_route.middleware";
import travelGuideControllers from "../controllers/tripPlan.controller";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/create",
  protectRoute,
  upload.single("thumbnailImage"),
  asyncHandler(travelGuideControllers.createTrip),
);

router.get(
  "/by-itinerary/:tripId",
  protectRoute,
  asyncHandler(travelGuideControllers.getTripPlanByTripId),
);

router.get(
  "/:tripPlanId",
  protectRoute,
  asyncHandler(travelGuideControllers.getTripPlan),
);

router.put(
  "/:tripPlanId",
  protectRoute,
  upload.single("thumbnailImage"),
  asyncHandler(travelGuideControllers.updateTripPlan),
);



export default router;