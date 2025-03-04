import type { ProcessorInterface } from "./processorInterface";
import type { BaseMessage, PublisherMessage } from "../types/messages";
import { newPublisherMessageSchema } from "../schemas/publisherMessageSchema";
import baseProcessor from "./baseProcessor";
import { Publisher } from "../entity/Publisher";

export default class PublisherProcessor
  extends baseProcessor<Publisher>
  implements ProcessorInterface<Publisher>
{
  private message: PublisherMessage | undefined = undefined;

  public async setMessage(message: BaseMessage) {
    try {
      await this.validate(message, newPublisherMessageSchema)
      this.message = message as PublisherMessage;
    } catch (e) {
      console.log(e);
    }
  }

  public async create() {
    if (this.message === undefined) {
      throw new Error("Message not set");
    }

    const { name, description } = this.message.payload;

    try {
      const publisher = new Publisher();

      publisher.name = name;
      publisher.slug = name.toLowerCase();
      publisher.description = description;

      return await publisher.save();
    } catch (e) {
      console.error(e);
      console.log("Failed to persist publisher");
      return null;
    }
  }
}
