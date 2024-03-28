import { ProcessorInterface } from "./processorInterface";
import { AwardMessage, BaseMessage } from "../types/messages";
import { newAwardMessageSchema } from "../schemas/awardMessageSchema";
import baseProcessor from "./baseProcessor";
import { Award } from "../entity/Award";

export default class AwardProcessor
  extends baseProcessor
  implements ProcessorInterface
{
  private message: AwardMessage | undefined = undefined;

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
      const award = new Award();
      award.name = name;
      award.slug = name.toLowerCase();
      award.description = description;

      return await award.save();
    } catch (e) {
      console.error(e);
      console.log("Failed to persist award");
    }
  }
}
