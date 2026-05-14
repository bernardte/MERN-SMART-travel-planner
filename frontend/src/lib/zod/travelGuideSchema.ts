import { z } from "zod";

const baseTravelGuideSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  country: z.string(),
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