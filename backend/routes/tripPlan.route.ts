import express from "express";
import { asyncHandler } from "../utils/async_handler";
import { protectRoute } from "../middleware/protect_route.middleware";
import travelGuideControllers from "../controllers/tripPlan.controller";

const router = express.Router();

router.post("/create", protectRoute, asyncHandler(travelGuideControllers.createTrip));

export default router;