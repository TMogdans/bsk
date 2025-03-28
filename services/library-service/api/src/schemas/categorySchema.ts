import { z } from 'zod';
import { metaSchema } from './metaSchema';
import { boardGameSchema } from './boardGameSchema';

const boardGameInCategorySchema = boardGameSchema.omit({
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

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  board_games: z.array(boardGameInCategorySchema).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  deleted_at: z.date().nullable().optional(),
  created_by: z.string().uuid(),
});

export const categoryMessageSchema = metaSchema.extend({
  payload: categorySchema,
});

export const createCategorySchema = categorySchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  board_games: true,
});

export const updateCategorySchema = categorySchema.partial();

export type Category = z.infer<typeof categorySchema>;
export type CreateCategory = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;

export type CategoryMessage = z.infer<typeof categoryMessageSchema>;