import { z } from 'zod';
import { eventResponseSchema } from '../schemas/eventSchema';

// Schema for event metadata (URLs, etc.)
export const metaSchema = z.object({
  url: z.string()
});

export type Meta = z.infer<typeof metaSchema>;

// Schema for a month with events
export const monthSchema = z.object({
  heading: z.string(),
  events: z.array(eventResponseSchema.extend({
    meta: metaSchema
  }))
});

export type Month = z.infer<typeof monthSchema>;

// Schema for the complete event list
export const eventListSchema = z.object({
  heading: z.string(),
  months: z.array(monthSchema)
});

export type EventList = z.infer<typeof eventListSchema>;