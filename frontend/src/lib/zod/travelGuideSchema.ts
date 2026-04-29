import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");


export const createTravelGuideSchema = z.object({
  title: z.string().min(3, "Title too short"),
  authorId: objectId,
  description: z.string().min(10, "Description too short"),
  country: z.string().min(1),
  thumbnailImage: z.file().optional(),
  tags: z.array(z.string()),
  privacy: z.enum(["public", "private"]),
  itineraryId: objectId,
});

export type CreateTravelGuideInputSchemaType = z.infer<typeof createTravelGuideSchema>;
