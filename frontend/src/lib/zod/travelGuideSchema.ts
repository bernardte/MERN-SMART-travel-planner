import { z } from "zod";


export const travelGuideSchema = z.object({
  title: z.string().min(3, "Title too short"),
  description: z.string().min(10, "Description too short"),
  country: z.string(),
  thumbnailImage: z.any().optional(),
  tags: z.array(z.string()),
  privacy: z.enum(["public", "private"]),
  itineraryId: z.string().min(1, "Please select an itinerary"),
});

export type travelGuideSchemaType = z.infer<
  typeof travelGuideSchema
>;
