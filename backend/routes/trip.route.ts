import express from "express";
import { asyncHandler } from "../utils/async_handler";
import { protectRoute } from "../middleware/protect_route.middleware";
import tripController from "../controllers/trip.controller";

const router = express.Router();

// All trip routes are protected — user must be logged in
router.post("/save", protectRoute, asyncHandler(tripController.saveTrip));
router.get("/my-trips", protectRoute, asyncHandler(tripController.getMyTrips));
router.delete("/:id", protectRoute, asyncHandler(tripController.deleteTrip));

export default router;