import { PersonMessage } from "../types/messages";
import { Prisma, PrismaClient } from "@prisma/client";
import { newPersonMessageSchema } from "../schemas/personMessage";

export default class personProcessor {
  private message: PersonMessage | undefined = undefined;
  private dbClient = {} as PrismaClient;

  constructor(dbClient: PrismaClient) {
    this.dbClient = dbClient;
  }

  public setMessage(message: PersonMessage) {
    this.message = message;

    return this;
  }

  public async persist() {
    if (this.message === undefined) {
      throw new Error("Message or dbClient not set");
    }

    const { firstName, lastName, description } = this.message.payload;

    try {
      return await this.dbClient.person.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          slug: `${firstName}-${lastName}`,
          description: description,
        } as Prisma.PersonCreateInput,
      });
    } catch (e) {
      console.error(e);
      console.log("Failed to persist person");
    }
  }

  public async validate() {
    if (this.message === undefined) {
      throw new Error("Message not set");
    }

    const result = await newPersonMessageSchema
      .validate(this.message)
      .then(() => true)
      .catch(() => false);

    if (!result) {
      throw new Error("Invalid message");
    }

    return this;
  }
}
