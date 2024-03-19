import {number, object, string} from "yup";

export const newBoardGameMessageSchema = object({
    message: string().required(),
    meta: object({
        producer: string().required(),
        version: string().required(),
    }),
    payload: object({
        name: string().required(),
        description: string().required().nullable(),
        minAge: number().min(0).nullable(),
        minPlayTimeMinutes: number().min(1).nullable(),
        maxPlayTimeMinutes: number().nullable(),
        minNumberOfPlayers: number().min(1).nullable(),
        maxNumberOfPlayers: number().nullable()
    }),
})
