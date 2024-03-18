import {object, string} from "yup";

export const newPersonMessageSchema = object({
    message: string().required(),
    meta: object({
        producer: string().required(),
        version: string().required(),
    }),
    payload: object({
        firstName: string().required(),
        lastName: string().required(),
        description: string().required(),
    }),
})
