import { z } from 'zod';
import { metaSchema } from './metaSchema';
import { boardGameSchema } from './boardGameSchema';

const boardGameInMechanicSchema = boardGameSchema.omit({
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

export const mechanicSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  board_games: z.array(boardGameInMechanicSchema).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  deleted_at: z.date().nullable().optional(),
  created_by: z.string().uuid(),
});

export const mechanicMessageSchema = metaSchema.extend({
  payload: mechanicSchema,
});

export const createMechanicSchema = mechanicSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  board_games: true,
});

export const updateMechanicSchema = mechanicSchema.partial();

export type Mechanic = z.infer<typeof mechanicSchema>;
export type CreateMechanic = z.infer<typeof createMechanicSchema>;
export type UpdateMechanic = z.infer<typeof updateMechanicSchema>;

export type mechanicMessage = z.infer<typeof mechanicMessageSchema>;