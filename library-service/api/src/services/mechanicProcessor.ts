import { ProcessorInterface } from "./processorInterface";
import { BaseMessage, MechanicMessage } from "../types/messages";
import { newMechanicMessageSchema } from "../schemas/mechanicMessageSchema";
import baseProcessor from "./baseProcessor";
import { Mechanic } from "../entity/Mechanic";

export default class MechanicProcessor
  extends baseProcessor
  implements ProcessorInterface
{
  private message: MechanicMessage | undefined = undefined;


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
      const mechanic = new Mechanic();

      mechanic.name = name;
      mechanic.slug = name.toLowerCase();
      mechanic.description = description;

      return await mechanic.save();
    } catch (e) {
      console.error(e);
      console.log("Failed to persist mechanic");
    }
  }
}
