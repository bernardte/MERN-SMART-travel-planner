import express from "express";
import { asyncHandler } from "../utils/async_handler";
import refreshTokenController from "../controllers/refreshToken.controller";

const route = express.Router();

route.get("/", asyncHandler(refreshTokenController.getAccessTokenWithRefreshToken));

export default route;