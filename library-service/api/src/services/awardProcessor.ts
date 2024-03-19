import { ProcessorInterface } from "./processorInterface";
import { AwardMessage, BaseMessage } from "../types/messages";
import { PrismaClient, Prisma } from "@prisma/client";
import { newAwardMessageSchema } from "../schemas/awardMessageSchema";
import baseProcessor from "./baseProcessor";

export default class awardProcessor extends baseProcessor implements ProcessorInterface {
  private message: AwardMessage | undefined = undefined;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
  }

  public setMessage(message: BaseMessage): ProcessorInterface {
    this.validate(message, newAwardMessageSchema)
      .then(() => (this.message = message as AwardMessage))
      .catch((e) => console.log(e));

    return this;
  }

  public async create() {
    if (this.message === undefined) {
      throw new Error("Message or dbClient not set");
    }

    const { name, description } = this.message.payload;

    try {
      return await this.dbClient.award.create({
        data: {
          name: name,
          slug: name.toLowerCase(),
          description: description,
        } as Prisma.AwardCreateInput,
      });
    } catch (e) {
      console.error(e);
      console.log("Failed to persist award");
    }
  }
}
