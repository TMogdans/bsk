import { z } from 'zod';
import { metaSchema } from './metaSchema';
import { boardGameSchema } from './boardGameSchema';

const boardGameInPersonSchema = boardGameSchema.omit({
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

export const personSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  description: z.string().nullable(),
  board_games: z.array(boardGameInPersonSchema).optional(),
  userId: z.string().uuid().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  deleted_at: z.date().nullable().optional(),
  created_by: z.string().uuid(),
});

export const personMessageSchema = metaSchema.extend({
  payload: personSchema,
});

export const createPersonSchema = personSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  board_games: true,
});

export const updatePersonSchema = personSchema.partial();

export type Person = z.infer<typeof personSchema>;
export type CreatePerson = z.infer<typeof createPersonSchema>;
export type UpdatePerson = z.infer<typeof updatePersonSchema>;

export type personMessage = z.infer<typeof personMessageSchema>;