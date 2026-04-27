import express from "express";
import { asyncHandler } from "../utils/async_handler";
import { protectRoute } from "../middleware/protect_route.middleware";
import travelGuideControllers from "../controllers/travel_guide.controller";

const router = express.Router();

router.post("/create", protectRoute, asyncHandler(travelGuideControllers.createTravelGuide));

export default router;