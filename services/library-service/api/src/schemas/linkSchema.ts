import { z } from "zod";
import { metaSchema } from "./metaSchema";

export const linkSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  url: z.string().url(),
  description: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  deleted_at: z.date().nullable().optional(),
  created_by: z.string().uuid(),
});

export const linkMessageSchema = metaSchema.extend({
  payload: linkSchema,
});

export const createLinkSchema = linkSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

export const updateLinkSchema = createLinkSchema.partial();

export type Link = z.infer<typeof linkSchema>;
export type CreateLink = z.infer<typeof createLinkSchema>;
export type UpdateLink = z.infer<typeof updateLinkSchema>;

export type LinkMessage = z.infer<typeof linkMessageSchema>;