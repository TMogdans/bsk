import {PrismaClient, Prisma} from "@prisma/client";
import {CategoryMessage} from "../types/messages";
import {newCategoryMessageSchema} from "../schemas/categoryMessageSchema";
import {ProcessorInterface} from "./processorInterface";

export default class categoryProcessor implements ProcessorInterface {
    private message: CategoryMessage | undefined = undefined;
    private dbClient = {} as PrismaClient;

    constructor(dbClient: PrismaClient) {
        this.dbClient = dbClient;
    }

    public setMessage(message: CategoryMessage) {
        this.validate(message)
            .then(() => this.message = message)
            .catch((e) => console.log(e));

        return this;
    }

    public async create() {
        if (this.message === undefined) {
            throw new Error("Message or dbClient not set");
        }

        const {name, description} = this.message.payload;

        try {
            return await this.dbClient.category.create({
                data: {
                    name: name,
                    slug: name.toLowerCase(),
                    description: description,
                } as Prisma.CategoryCreateInput
            });
        } catch (e) {
            console.error(e);
            console.log("Failed to persist category");
        }
    }

    private async validate(message: CategoryMessage) {
        if (message === undefined) {
            throw new Error("Message not set");
        }

        const result = await newCategoryMessageSchema
            .validate(message)
            .then(() => true)
            .catch(() => false);

        if (!result) {
            throw new Error("Invalid message");
        }
    }
}
