import type { BaseMessage, CategoryMessage } from "../types/messages";
import { newCategoryMessageSchema } from "../schemas/categoryMessageSchema";
import type { ProcessorInterface } from "./processorInterface";
import baseProcessor from "./baseProcessor";
import { Category } from "../entity/Category";

export default class CategoryProcessor
  extends baseProcessor<Category>
  implements ProcessorInterface<Category>
{
  private message: CategoryMessage | undefined = undefined;

  public async setMessage(message: BaseMessage) {
  try {
    await this.validate(message, newCategoryMessageSchema);
    this.message = message as CategoryMessage;
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
      const category = new Category();
      category.name = name;
      category.slug = name.toLowerCase();
      category.description = description;

      return await category.save();
    } catch (e) {
      console.error(e);
      console.log("Failed to persist category");
      return null;
    }
  }
}
