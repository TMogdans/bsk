import { BaseMessage } from "../types/messages";
import { AnyObjectSchema } from "yup";

export default abstract class baseProcessor {
  protected async validate(message: BaseMessage, validator: AnyObjectSchema) {
    await validator.validate(message).catch((e) => {
      console.log(e);
      throw new Error("Invalid message");
    });
  }
}
