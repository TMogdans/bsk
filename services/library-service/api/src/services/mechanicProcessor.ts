import type { ProcessorInterface } from "./processorInterface";
import type { BaseMessage, MechanicMessage } from "../types/messages";
import { newMechanicMessageSchema } from "../schemas/mechanicMessageSchema";
import baseProcessor from "./baseProcessor";
import { Mechanic } from "../entity/Mechanic";

export default class MechanicProcessor
  extends baseProcessor<Mechanic>
  implements ProcessorInterface<Mechanic>
{
  private message: MechanicMessage | undefined = undefined;


  public async setMessage(message: BaseMessage) {
    try {
      await this.validate(message, newMechanicMessageSchema)
      this.message = message as MechanicMessage;
    } catch (e) {
      console.log(e);
    }
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
      return null;
    }
  }
}
