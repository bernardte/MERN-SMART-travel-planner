import express from "express";
// import fileupload from "express-fileupload";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import userRouter from "./routes/users.route";
import refreshTokenRouter from "./routes/refreshToken.route";
import { errorHandlingMiddleware } from "./middleware/error_handling.middleware";
import tripRoute from "./routes/trip.route";
import tripPlanRoute from "./routes/tripPlan.route";
import communityTravelGuideRoute from "./routes/communityTravelGuide.route";
import favouriteRoute from "./routes/favourite.route";

connectDB();
const app = express();
const PORT = env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:5, // max 100 requests per user
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(cookieParser()); //get the cookie from request and set the cookie in the response.
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
//! create temp directory for file uploads
// app.use(
//   fileupload({
//     useTempFiles: true,
//     tempFileDir: path.join(__dirname, "temp"),
//     createParentPath: true,
//     limits: {
//       fileSize: 10 * 1024 * 1024, // 10MB
//     },
//   }),
// );

app.use("/api/refreshToken", refreshTokenRouter);
app.use("/api/users", userRouter);
app.use("/api/trips", tripRoute);
app.use("/api/trips-plan", tripPlanRoute);
app.use("/api/community", communityTravelGuideRoute);
app.use("/api/favourites", favouriteRoute);

//! Error handling middleware should be the last middleware for getting all the controller errors.
app.use(errorHandlingMiddleware);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
