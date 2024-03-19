import { BaseMessage, PersonMessage } from "../types/messages";
import { Prisma, PrismaClient } from "@prisma/client";
import { newPersonMessageSchema } from "../schemas/personMessageSchema";
import { ProcessorInterface } from "./processorInterface";
import baseProcessor from "./baseProcessor";

export default class personProcessor extends baseProcessor implements ProcessorInterface {
  private message: PersonMessage | undefined = undefined;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
  }

  public setMessage(message: BaseMessage) {
    this.validate(message, newPersonMessageSchema)
      .then(() => (this.message = message as PersonMessage))
      .catch((e) => console.log(e));

    return this;
  }

  public async create() {
    if (this.message === undefined) {
      throw new Error("Message or dbClient not set");
    }

    const { firstName, lastName, description } = this.message.payload;

    try {
      return await this.dbClient.person.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          slug: `${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
          description: description,
        } as Prisma.PersonCreateInput,
      });
    } catch (e) {
      console.error(e);
      console.log("Failed to persist person");
    }
  }
}
