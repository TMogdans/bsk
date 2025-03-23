import { z } from 'zod';

// Base type schema
export const typeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1)
});

export const createTypeSchema = typeSchema.omit({ id: true });
export const updateTypeSchema = createTypeSchema.partial();

// Base event schema
export const eventSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  slug: z.string().min(1),
  type_id: z.number().int().positive(),
  begins_at: z.coerce.date(),
  ends_at: z.coerce.date(),
  zip: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  country: z.string().length(2),
  street: z.string().nullable().optional(),
  description: z.string().min(1),
  barrier_free: z.boolean().default(false),
  entry_free: z.boolean().default(false),
  online_event: z.boolean().default(false),
  published: z.boolean().default(false),
  event_url: z.string().url(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  deleted_at: z.date().nullable().optional(),
  created_by: z.number().int().positive()
});

// Schema for creating a new event
export const createEventSchema = eventSchema
  .omit({ 
    id: true, 
    slug: true,
    created_at: true,
    updated_at: true,
    deleted_at: true
  })
  .extend({
    type: z.string(),  // We use type name instead of type_id in the API
  })
  .omit({ type_id: true });

// Schema for updating an event
export const updateEventSchema = createEventSchema.partial();

// Schema for filtering events
export const filterSchema = z.object({
  presence: z.enum(['online', 'offline']).optional(),
  type: z.string().optional(),
  barrierFree: z.boolean().optional(),
  entryFree: z.boolean().optional()
});

// Schema for event response
export const eventResponseSchema = eventSchema.extend({
  type: typeSchema.omit({ id: true })
}).omit({ type_id: true });

// Export type definitions
export type Type = z.infer<typeof typeSchema>;
export type CreateType = z.infer<typeof createTypeSchema>;
export type UpdateType = z.infer<typeof updateTypeSchema>;

export type Event = z.infer<typeof eventSchema>;
export type CreateEvent = z.infer<typeof createEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;
export type EventFilter = z.infer<typeof filterSchema>;
export type EventResponse = z.infer<typeof eventResponseSchema>;