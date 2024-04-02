import { BaseMessage, PersonMessage } from "../types/messages";
import { newPersonMessageSchema } from "../schemas/personMessageSchema";
import { ProcessorInterface } from "./processorInterface";
import baseProcessor from "./baseProcessor";
import { Person } from "../entity/Person";

export default class PersonProcessor
  extends baseProcessor
  implements ProcessorInterface
{
  private message: PersonMessage | undefined = undefined;

  public async setMessage(message: BaseMessage) {
    await this.validate(message, newPersonMessageSchema)
      .then(() => (this.message = message as PersonMessage))
      .catch((e) => console.log(e));
  }

  public async create() {
    if (this.message === undefined) {
      throw new Error("Message or dbClient not set");
    }

    const { firstName, lastName, description } = this.message.payload;

    try {
      const person = new Person();

      person.firstName = firstName;
      person.lastName = lastName;
      person.description = description;
      person.slug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;

      return await person.save();
    } catch (e) {
      console.error(e);
      console.log("Failed to persist person");
    }
  }
}
