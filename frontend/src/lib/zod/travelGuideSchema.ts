import { z } from "zod";

const baseTravelGuideSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  country: z.string(),
  tags: z.array(z.string()),
  privacy: z.enum(["public", "private"]),
  itineraryId: z.string().min(1),
  itineraryTitle: z.string().optional(),
  image: z.instanceof(File, {
    message: "Thumbnail image is required",
  }),

  imagePreview: z.string().optional(),
});

export const travelGuideCreateSchema = baseTravelGuideSchema;

export const travelGuideEditSchema = baseTravelGuideSchema.extend({
  thumbnailImage: z.instanceof(File).optional(),
});

export type TravelGuideBase = z.infer<typeof baseTravelGuideSchema>;
export type TravelGuideCreate = z.infer<typeof travelGuideCreateSchema>;
export type TravelGuideEdit = z.infer<typeof travelGuideEditSchema>;