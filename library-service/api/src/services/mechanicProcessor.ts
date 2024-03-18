import {ProcessorInterface} from "./processorInterface";
import {PrismaClient} from "@prisma/client";
import {BaseMessage, MechanicMessage} from "../types/messages";
import {newMechanicMessageSchema} from "../schemas/mechanicMessageSchema";

export default class mechanicProcessor implements ProcessorInterface {
    private message: MechanicMessage | undefined = undefined;
    private dbClient = {} as PrismaClient;

    constructor(dbClient: PrismaClient) {
        this.dbClient = dbClient;
    }

    public setMessage(message: BaseMessage) {
        this.validate(message as MechanicMessage)
            .then(() => this.message = message as MechanicMessage)
            .catch((e) => console.log(e));

        return this;
    }

    public async create() {
        if (this.message === undefined) {
            throw new Error("Message or dbClient not set");
        }

        const {name, description} = this.message.payload;

        try {
            return await this.dbClient.mechanic.create({
                data: {
                    name: name,
                    slug: name.toLowerCase(),
                    description: description,
                }
            });
        } catch (e) {
            console.error(e);
            console.log("Failed to persist mechanic");
        }
    }

    private async validate(message: MechanicMessage) {
        if (message === undefined) {
            throw new Error("Message not set");
        }

        const result = await newMechanicMessageSchema
            .validate(message)
            .then(() => true)
            .catch(() => false);

        if (!result) {
            throw new Error("Invalid message");
        }

        return this;
    }
}
