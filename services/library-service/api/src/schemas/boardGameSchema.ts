import { z } from 'zod';
import { metaSchema } from './metaSchema';

export const boardGameSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  minAge: z.number().min(0).nullable(),
  minPlayTimeMinutes: z.number().min(1).nullable(),
  maxPlayTimeMinutes: z.number().nullable(),
  minNumberOfPlayers: z.number().min(1).nullable(),
  maxNumberOfPlayers: z.number().nullable(),
  awards: z.array(z.string().uuid()).nullable(),
  categories: z.array(z.string().uuid()).nullable(),
  mechanics: z.array(z.string().uuid()).nullable(),
  publishers: z.array(z.string().uuid()).nullable(),
  designers: z.array(z.string().uuid()).nullable(),
  artists: z.array(z.string().uuid()).nullable(),
  links: z.array(z.string().uuid()).nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  deleted_at: z.date().nullable().optional(),
  created_by: z.string().uuid(),
});

export const boardGameMessageSchema = metaSchema.extend({
  payload: boardGameSchema,
});

export const createBoardGameSchema = boardGameSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

export const updateBoardGameSchema = boardGameSchema.partial();

export type BoardGame = z.infer<typeof boardGameSchema>;

export type CreateBoardGame = z.infer<typeof createBoardGameSchema>;
export type UpdateBoardGame = z.infer<typeof updateBoardGameSchema>;

export type BoardGameMessage = z.infer<typeof boardGameMessageSchema>;