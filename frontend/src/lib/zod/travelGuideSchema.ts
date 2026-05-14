import { z } from "zod";

const baseTravelGuideSchema = z.object({
  title: z.string().min(3, "Please enter a title with at least 3 characters"),
  description: z
    .string()
    .min(10, "Please write at least 10 characters for the description"),
  country: z.string().min(1, "Country is required"),
  tags: z.array(z.string()),
  privacy: z.enum(["public", "private"]),
  itineraryId: z.string().min(1, "Please select an itinerary"),
  image: z.instanceof(File, {
    message: "Thumbnail image is required",
  }),
});

export const travelGuideCreateSchema = baseTravelGuideSchema.extend({
  itineraryTitle: z.string(),
  imagePreview: z.string(),
});

export const travelGuideEditSchema = baseTravelGuideSchema.extend({
  itineraryTitle: z.string().optional(),
  imagePreview: z.string().optional(),
});

export type TravelGuideBase = z.infer<typeof baseTravelGuideSchema>;
export type TravelGuideCreate = z.infer<typeof travelGuideCreateSchema>;
export type TravelGuideEdit = z.infer<typeof travelGuideEditSchema>;