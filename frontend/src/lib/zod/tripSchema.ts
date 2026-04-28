import { z } from "zod";

const listItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Item cannot be empty"),
  type: z.enum(["text", "checklist"]),
  checked: z.boolean().optional(),
});

const placeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Place name is required"),
  lat: z.number(),
  lng: z.number(),
  category: z.enum(["restaurant", "attraction", "cafe", "viewpoint", "other"]),
  description: z.string().optional(),
});

const routeStopSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  order: z.number(),
  note: z.string().optional(),
});

const daySectionSchema = z.object({
  id: z.string(),
  type: z.literal("day"),
  title: z.string().min(1, "Day title required"),
  route: z.array(routeStopSchema),
  places: z.array(placeSchema),
  listItems: z.array(listItemSchema),
  notes: z.string().optional(),
  isOpen: z.boolean(),
});

const tipsSectionSchema = z.object({
  id: z.string(),
  type: z.literal("tips"),
  title: z.string(),
  content: z.string().optional(),
  isOpen: z.boolean(),
});

const sectionSchema = z.discriminatedUnion("type", [
  daySectionSchema,
  tipsSectionSchema,
]);

export const tripSchema = z.object({
  title: z.string().min(1, "Guide title is required"),
  authorIntro: z.string().optional(),
  tripId: z.string().optional(), // optional for frontend
  thumbnailImage: z.file().optional(),
  sections: z.array(sectionSchema).min(1, "At least one section required"),
});

export type tripSchemaType = z.infer<typeof tripSchema>;
