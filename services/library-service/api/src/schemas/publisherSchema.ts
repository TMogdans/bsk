import { z } from 'zod';
import { metaSchema } from './metaSchema';
import { boardGameSchema } from './boardGameSchema';

const boardGameInPublisherSchema = boardGameSchema.omit({
  awards: true,
  categories: true,
  mechanics: true,
  designers: true,
  artists: true,
  publishers: true,
  links: true,
  created_by: true,
  deleted_at: true,
});

export const publisherSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  board_games: z.array(boardGameInPublisherSchema).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  deleted_at: z.date().nullable().optional(),
  created_by: z.string().uuid(),
});

export const publisherMessageSchema = metaSchema.extend({
  payload: publisherSchema,
});

export const createPublisherSchema = publisherSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  board_games: true,
});

export const updatePublisherSchema = publisherSchema.partial();

export type Publisher = z.infer<typeof publisherSchema>;
export type CreatePublisher = z.infer<typeof createPublisherSchema>;
export type UpdatePublisher = z.infer<typeof updatePublisherSchema>;

export type PublisherMessage = z.infer<typeof publisherMessageSchema>;