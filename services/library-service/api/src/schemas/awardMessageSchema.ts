import {object, string} from "yup";

export const newAwardMessageSchema = object({
    message: string().required(),
    meta: object({
        producer: string().required(),
        version: string().required(),
    }),
    payload: object({
        name: string().required(),
        description: string().required().nullable(),
    }),
})
