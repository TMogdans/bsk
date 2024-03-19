import { Prisma, PrismaClient } from "@prisma/client";
import { BaseMessage, CategoryMessage } from "../types/messages";
import { newCategoryMessageSchema } from "../schemas/categoryMessageSchema";
import { ProcessorInterface } from "./processorInterface";
import baseProcessor from "./baseProcessor";

export default class categoryProcessor extends baseProcessor implements ProcessorInterface {
  private message: CategoryMessage | undefined = undefined;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
  }

  public setMessage(message: BaseMessage) {
    this.validate(message, newCategoryMessageSchema)
      .then(() => (this.message = message as CategoryMessage))
      .catch((e) => console.log(e));

    return this;
  }

  public async create() {
    if (this.message === undefined) {
      throw new Error("Message or dbClient not set");
    }

    const { name, description } = this.message.payload;

    try {
      return await this.dbClient.category.create({
        data: {
          name: name,
          slug: name.toLowerCase(),
          description: description,
        } as Prisma.CategoryCreateInput,
      });
    } catch (e) {
      console.error(e);
      console.log("Failed to persist category");
    }
  }
}
