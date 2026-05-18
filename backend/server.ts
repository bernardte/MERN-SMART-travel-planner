import express from "express";
import type { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
// import fileupload from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import { connectDB, connectOnce } from "./config/db.js";
import userRouter from "./routes/users.route.js";
import refreshTokenRouter from "./routes/refreshToken.route.js";
import { errorHandlingMiddleware } from "./middleware/error_handling.middleware.js";
import tripRoute from "./routes/trip.route.js";
import tripPlanRoute from "./routes/tripPlan.route.js";
import communityTravelGuideRoute from "./routes/communityTravelGuide.route.js";
import favouriteRoute from "./routes/favourite.route.js";
import deleteTempfileScheduler from "./utils/helpers/deleteTempFileScheduler.js";

const app = express();
const PORT = env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("trust proxy", 1);
app.use(
  cors({
    origin: [env.FRONTEND_URL, env.PRODUCTION_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectOnce();
    next();
  } catch (err) {
    next(err);
  }
});

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
app.use("/api/trips", limiter, tripRoute);
app.use("/api/trips-plan", limiter, tripPlanRoute);
app.use("/api/community", communityTravelGuideRoute);
app.use("/api/favourites", favouriteRoute);

//! Error handling middleware should be the last middleware for getting all the controller errors.
app.use(errorHandlingMiddleware);

if(env.NODE_ENV === "production"){
    const __dirname = path.resolve();

    //serve static files from frontend/dist
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    // handle SPA routing - Send all non-API routes to index.html - react app
    app.get("/{*any}", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
    })
}


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  deleteTempfileScheduler.start();
});


