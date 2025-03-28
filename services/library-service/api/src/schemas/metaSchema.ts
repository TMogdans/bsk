import { z } from "zod";

export const metaSchema = z.object({
  message: z.string(),
  meta: z.object({
    producer: z.string(),
    version: z.string(),
  }),
  payload: z.any(),
});