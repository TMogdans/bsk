import {object, string} from "yup";

export const newPublisherMessageSchema = object({
    message: string().required(),
    meta: object({
        producer: string().required(),
        version: string().required(),
    }),
    payload: object({
        name: string().required(),
        description: string().required(),
    }),
})
