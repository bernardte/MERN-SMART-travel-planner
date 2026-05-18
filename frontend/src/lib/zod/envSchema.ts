import { z } from "zod";

const envSchema = z.object({
  VITE_BASE_URL: z.string().min(1, "Invalid Base URL"),
  VITE_PEXELS_API_KEY: z.string().min(1, "Pexels API key is required"),
  MODE: z.enum(["development", "production"]).default("development"),
  VITE_PRODUCTION_URL: z.string().min(1, "Production URL is required"),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:");
  throw new Error("Invalid .env configuration");
}

export const env = parsedEnv.data;
