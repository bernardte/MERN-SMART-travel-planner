import { z } from "zod";

const envSchema = z.object({
  VITE_BASE_URL: z.string().min(1, "Invalid Base URL"),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:");
  throw new Error("Invalid .env configuration");
}

export const env = parsedEnv.data;
