import { z } from 'zod';
import { metaSchema } from './metaSchema';

// Basisschema für BoardGame (ohne zirkuläre Abhängigkeiten)
export const boardGameBaseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  minAge: z.number().min(0).nullable(),
  minPlayTimeMinutes: z.number().min(1).nullable(),
  maxPlayTimeMinutes: z.number().nullable(),
  minNumberOfPlayers: z.number().min(1).nullable(),
  maxNumberOfPlayers: z.number().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  deleted_at: z.date().nullable().optional(),
  created_by: z.string().uuid(),
});

// Schemen für detaillierte Entitäten im BoardGame-Kontext
// Diese werden nach der Definition der Hauptschemen erstellt, um zirkuläre Abhängigkeiten zu vermeiden
export const awardInBoardGameSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.date().nullable(),
  updated_at: z.date().nullable()
});

export const categoryInBoardGameSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.date().nullable(),
  updated_at: z.date().nullable()
});

export const mechanicInBoardGameSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.date().nullable(),
  updated_at: z.date().nullable()
});

export const publisherInBoardGameSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.date().nullable(),
  updated_at: z.date().nullable()
});

export const personInBoardGameSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  description: z.string().nullable(),
  role: z.string(),
  created_at: z.date().nullable(),
  updated_at: z.date().nullable()
});

export const linkInBoardGameSchema = z.object({
  id: z.string().uuid(),
  url: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  created_at: z.date().nullable(),
  updated_at: z.date().nullable()
});

// Vollständiges BoardGame-Schema mit Beziehungen
export const boardGameSchema = boardGameBaseSchema.extend({
  // Zugehörige Entitäten können entweder als IDs oder als detaillierte Objekte angegeben werden
  awards: z.union([
    z.array(z.string().uuid()).nullable(),
    z.array(awardInBoardGameSchema).nullable()
  ]),
  categories: z.union([
    z.array(z.string().uuid()).nullable(),
    z.array(categoryInBoardGameSchema).nullable()
  ]),
  mechanics: z.union([
    z.array(z.string().uuid()).nullable(),
    z.array(mechanicInBoardGameSchema).nullable()
  ]),
  publishers: z.union([
    z.array(z.string().uuid()).nullable(),
    z.array(publisherInBoardGameSchema).nullable()
  ]),
  designers: z.union([
    z.array(z.string().uuid()).nullable(),
    z.array(personInBoardGameSchema).nullable()
  ]),
  artists: z.union([
    z.array(z.string().uuid()).nullable(),
    z.array(personInBoardGameSchema).nullable()
  ]),
  links: z.union([
    z.array(z.string().uuid()).nullable(),
    z.array(linkInBoardGameSchema).nullable()
  ]),
});

// Schema für die Kommunikation mit der API
export const boardGameMessageSchema = metaSchema.extend({
  payload: boardGameSchema,
});

// Schema für die Erstellung eines neuen BoardGames
export const createBoardGameSchema = boardGameSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

// Schema für die Aktualisierung eines BoardGames
export const updateBoardGameSchema = boardGameSchema.partial();

// Typdefinitionen
export type BoardGame = z.infer<typeof boardGameSchema>;
export type CreateBoardGame = z.infer<typeof createBoardGameSchema>;
export type UpdateBoardGame = z.infer<typeof updateBoardGameSchema>;
export type BoardGameMessage = z.infer<typeof boardGameMessageSchema>;

// Typen für detaillierte Entitäten
export type AwardInBoardGame = z.infer<typeof awardInBoardGameSchema>;
export type CategoryInBoardGame = z.infer<typeof categoryInBoardGameSchema>;
export type MechanicInBoardGame = z.infer<typeof mechanicInBoardGameSchema>;
export type PublisherInBoardGame = z.infer<typeof publisherInBoardGameSchema>;
export type PersonInBoardGame = z.infer<typeof personInBoardGameSchema>;
export type LinkInBoardGame = z.infer<typeof linkInBoardGameSchema>;