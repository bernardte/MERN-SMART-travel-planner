import express from "express";
import { asyncHandler } from "../utils/async_handler";
import { protectRoute } from "../middleware/protect_route.middleware";
import tripController from "../controllers/trip.controller";

const router = express.Router();

router.post("/save", protectRoute, asyncHandler(tripController.saveTrip));
router.get("/my-trips", protectRoute, asyncHandler(tripController.getMyTrips));
router.get("/:id", protectRoute, asyncHandler(tripController.getTripById));
router.delete("/:id", protectRoute, asyncHandler(tripController.deleteTrip));

export default router;