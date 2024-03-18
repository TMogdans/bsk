import {BaseMessage, PersonMessage} from "../types/messages";
import { Prisma, PrismaClient } from "@prisma/client";
import { newPersonMessageSchema } from "../schemas/personMessage";
import {ProcessorInterface} from "./processorInterface";

export default class personProcessor implements ProcessorInterface{
  private message: PersonMessage | undefined = undefined;
  private dbClient = {} as PrismaClient;

  constructor(dbClient: PrismaClient) {
    this.dbClient = dbClient;
  }

  public setMessage(message: BaseMessage) {
    this.validate(message as PersonMessage)
        .then(() => this.message = message as PersonMessage)
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

  private async validate(message: PersonMessage) {
    if (message === undefined) {
      throw new Error("Message not set");
    }

    const result = await newPersonMessageSchema
      .validate(message)
      .then(() => true)
      .catch(() => false);

    if (!result) {
      throw new Error("Invalid message");
    }

    return this;
  }
}
