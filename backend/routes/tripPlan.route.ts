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
  (req, res, next) => {
    console.log("=== DEBUG ===");
    console.log("content-type:", req.headers["content-type"]);
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    next();
  },
  asyncHandler(travelGuideControllers.createTrip),
);

export default router;
