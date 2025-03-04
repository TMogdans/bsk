import type { BaseMessage } from "../types/messages";
import type { AnyObjectSchema } from "yup";

export default abstract class baseProcessor<T = unknown> {
  protected async validate(message: BaseMessage, validator: AnyObjectSchema) {
    await validator.validate(message).catch((e) => {
      console.log(e);
      throw new Error("Invalid message");
    });
  }
}
