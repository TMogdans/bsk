import { array, number, object, string } from "yup";

export const newBoardGameMessageSchema = object({
  message: string().required(),
  meta: object({
    producer: string().required(),
    version: string().required(),
  }).required(),
  payload: object({
    name: string().required(),
    description: string().nullable(),
    minAge: number().min(0).nullable(),
    minPlayTimeMinutes: number().min(1).nullable(),
    maxPlayTimeMinutes: number().nullable(),
    minNumberOfPlayers: number().min(1).nullable(),
    maxNumberOfPlayers: number().nullable(),
    awards: array(
      string()
    ).nullable(),
    categories: array(
      string()
    ).nullable(),
    mechanics: array(
      string()
    ).nullable(),
    publishers: array(
      string()
    ).nullable(),
    designers: array(
      string()
    ).nullable(),
    artists: array(
        string()
    ).nullable(),
    links: array(
      string()
    ).nullable(),
  }).required(),
});
