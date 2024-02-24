import { object, string } from "yup";
import { connect, JSONCodec } from "nats";
import { RatingCreatedMessage } from "../types/messages";

const natsServer = process.env.NATS_SERVER || "nats://localhost:4222";

const ratingCreatedSchema = object({
  message: string().required(),
  meta: object({
    producer: string().required(),
    version: string().required(),
  }),
  payload: object({
    object_id: string().required(),
    user_id: string().required(),
  }),
});

async function getValidatedMessage(receivedMessage: unknown) {
  await ratingCreatedSchema.validate(receivedMessage);

  const validatedRatingCreatedMessage =
    receivedMessage as unknown as RatingCreatedMessage;

  if (
    validatedRatingCreatedMessage.message !== "rating-created" ||
    validatedRatingCreatedMessage.meta.version !== "1.0.0"
  ) {
    throw new Error("Invalid message");
  }

  return validatedRatingCreatedMessage;
}

export const client = async () => {
  const nc = await connect({ servers: natsServer });
  const codec = JSONCodec();
  const subject = "ratings";
  const sub = nc.subscribe(subject);

  for await (const m of sub) {
    let receivedMessage = undefined as unknown;

    try {
      receivedMessage = codec.decode(m.data);
    } catch (e) {
        console.error(e);
        continue;
    }

    let validatedMessage = {} as RatingCreatedMessage;

    try {
      validatedMessage = await getValidatedMessage(receivedMessage);
    } catch (e) {
      console.error(e);
      continue;
    }

    console.log(
      `[${sub.getProcessed()}]: ${JSON.stringify(validatedMessage.payload)}`,
    );
  }
  console.log("subscription closed");
};
