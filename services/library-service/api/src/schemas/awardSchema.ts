import { z } from 'zod';
import { metaSchema } from './metaSchema';
import { boardGameSchema } from './boardGameSchema';

const boardGameInAwardSchema = boardGameSchema.omit({
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

// base award schema
export const awardSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  board_games: z.array(boardGameInAwardSchema).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  deleted_at: z.date().nullable().optional(),
  created_by: z.string().uuid(),
});

// message
export const awardMessageSchema = metaSchema.extend({
  payload: awardSchema,
});

export const createAwardSchema = awardSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  board_games: true,
});

export const updateAwardSchema = createAwardSchema.partial();

export type Award = z.infer<typeof awardSchema>;
export type CreateAward = z.infer<typeof createAwardSchema>;
export type UpdateAward = z.infer<typeof updateAwardSchema>;

export type AwardMessage = z.infer<typeof awardMessageSchema>;