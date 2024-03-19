import {ProcessorInterface} from "./processorInterface";
import {AwardMessage, BaseMessage} from "../types/messages";
import {PrismaClient, Prisma} from "@prisma/client";
import {newAwardMessageSchema} from "../schemas/awardMessageSchema";

export default class awardProcessor implements ProcessorInterface {
  private message: AwardMessage | undefined = undefined;
  private dbClient = {} as PrismaClient;

  constructor(dbClient: PrismaClient) {
      this.dbClient = dbClient;
  }

  public setMessage(message: BaseMessage): ProcessorInterface {
    this.validate(message)
        .then(() => this.message = message as AwardMessage)
        .catch((e) => console.log(e));

    return this;
  }

  public async create() {
      if (this.message === undefined) {
          throw new Error("Message or dbClient not set")
      }

      const {name, description} = this.message.payload;

      try {
          return await this.dbClient.award.create({
              data: {
                  name: name,
                  slug: name.toLowerCase(),
                  description: description
              } as Prisma.AwardCreateInput
          });
      } catch (e) {
          console.error(e);
          console.log("Failed to persist award");
      }
  }

  private async validate(message: BaseMessage) {
      if(message === undefined) {
          throw new Error("Message not set");
      }

      const result = await newAwardMessageSchema
          .validate(message)
          .then(() => true)
          .catch(() => false);

      if (!result) {
          throw new Error("Invalid message");
      }
  }
}
