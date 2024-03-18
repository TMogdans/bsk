import {object, string} from "yup";

export const newCategoryMessageSchema = object({
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
