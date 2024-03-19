import { PrismaClient } from "@prisma/client";
import { BaseMessage } from "../types/messages";
import { AnyObjectSchema } from "yup";

export default abstract class baseProcessor {
  protected dbClient = {} as PrismaClient;

  protected async validate(message: BaseMessage, validator: AnyObjectSchema) {
    await validator.validate(message).catch(() => {
      throw new Error("Invalid message");
    });
  }
}
