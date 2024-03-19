import {ProcessorInterface} from "./processorInterface";
import {BaseMessage, PublisherMessage} from "../types/messages";
import {PrismaClient, Prisma} from "@prisma/client";
import {newPublisherMessageSchema} from "../schemas/publisherMessageSchema";

export default class publisherProcessor implements ProcessorInterface {
  private message: PublisherMessage | undefined = undefined;
  private dbClient = {} as PrismaClient;

  constructor(dbClient: PrismaClient) {
    this.dbClient = dbClient;
  }

  public setMessage(message: BaseMessage) {
      this.validate(message)
          .then(() => this.message = message as PublisherMessage)
          .catch((e) => console.log(e));

      return this;
  }

  public async create() {
      if (this.message === undefined) {
          throw new Error("Message not set");
      }

      const {name, description} = this.message.payload;

      try {
          return await this.dbClient.publisher.create({
              data: {
                  name: name,
                  slug: name.toLowerCase(),
                  description: description
              } as Prisma.PublisherCreateInput
          })
      } catch (e) {
          console.error(e);
          console.log("Failed to persist publisher");
      }
  }

  private async validate(message: BaseMessage) {
    await newPublisherMessageSchema.validate(message).catch(() => {
      throw new Error("Invalid message");
    });
  }
}
