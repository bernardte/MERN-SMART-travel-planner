import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();
export const env = createEnv({
  server: {
    PORT: z.string().min(1, "PORT is required"),
    FRONTEND_URL: z.url().min(1, "FRONTEND_URL is required"),
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  },

  runtimeEnv: process.env,
});