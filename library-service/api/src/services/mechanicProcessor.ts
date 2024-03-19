import { ProcessorInterface } from "./processorInterface";
import { PrismaClient } from "@prisma/client";
import { BaseMessage, MechanicMessage } from "../types/messages";
import { newMechanicMessageSchema } from "../schemas/mechanicMessageSchema";
import baseProcessor from "./baseProcessor";

export default class mechanicProcessor extends baseProcessor implements ProcessorInterface {
  private message: MechanicMessage | undefined = undefined;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
  }

  public setMessage(message: BaseMessage) {
    this.validate(message, newMechanicMessageSchema)
      .then(() => (this.message = message as MechanicMessage))
      .catch((e) => console.log(e));

    return this;
  }

  public async create() {
    if (this.message === undefined) {
      throw new Error("Message or dbClient not set");
    }

    const { name, description } = this.message.payload;

    try {
      return await this.dbClient.mechanic.create({
        data: {
          name: name,
          slug: name.toLowerCase(),
          description: description,
        },
      });
    } catch (e) {
      console.error(e);
      console.log("Failed to persist mechanic");
    }
  }
}
