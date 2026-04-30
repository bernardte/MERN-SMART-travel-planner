import express from "express";
import { asyncHandler } from "../utils/async_handler";
import favouriteController from "../controllers/favourite.controller";
import { protectRoute } from "../middleware/protect_route.middleware";

const route = express.Router();

route.get(
  "/",
  protectRoute,
  asyncHandler(favouriteController.getAllFavourite),
);


export default route;
