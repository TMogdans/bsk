import {array, number, object, string} from "yup";

export const ratingCreatedSchema = object({
    message: string().required(),
    meta: object({
        producer: string().required(),
        version: string().required(),
    }),
    payload: object({
        object_id: string().required(),
        user_id: string().required(),
        ratings: array().of(
            object({
                value: number().required(),
                weight: number().required(),
                name: string().required(),
            }),
        ),
    }),
});
