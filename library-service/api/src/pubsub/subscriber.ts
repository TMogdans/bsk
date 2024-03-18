import { connect, JSONCodec } from "nats";
import { BaseMessage, CategoryMessage, PersonMessage } from "../types/messages";
import { match } from "ts-pattern";
import { PrismaClient } from "@prisma/client";
import personProcessor from "../services/personProcessor";
import categoryProcessor from "../services/categoryProcessor";
import { ProcessorInterface } from "../services/processorInterface";

const natsServer = process.env.NATS_SERVER || "localhost:4222";

function getProcessor(
  receivedMessage: BaseMessage,
  dbClient: PrismaClient,
): ProcessorInterface {
  match(receivedMessage)
    .with({ message: "person-provided", meta: { version: "1.0.0" } }, () => {
      return new personProcessor(dbClient);
    })
    .with({ message: "category-provided", meta: { version: "1.0.0" } }, () => {
      return new categoryProcessor(dbClient);
    })
    .with({ message: "mechanic-provided", meta: { version: "1.0.0" } }, () =>
      console.log("mechanic-provided message received"),
    )
    .with({ message: "award-provided", meta: { version: "1.0.0" } }, () =>
      console.log("award-provided message received"),
    )
    .with({ message: "publisher-provided", meta: { version: "1.0.0" } }, () =>
      console.log("publisher-provided message received"),
    )
    .with({ message: "boardgame-provided", meta: { version: "1.0.0" } }, () =>
      console.log("boardgame-provided message received"),
    );
  throw new Error("Unsupported message");
}

export const subscriber = async () => {
  const nc = await connect({ servers: natsServer });
  const codec = JSONCodec();
  const subject = "frontend";
  const subscription = nc.subscribe(subject);
  const dbClient = new PrismaClient();
  console.log(`Subscribed to ${subject}`);

  for await (const m of subscription) {
    const receivedMessage = codec.decode(m.data) as unknown as BaseMessage;

    console.log(
      `[${subscription.getProcessed()}]: ${JSON.stringify(receivedMessage)}`,
    );

    try {
      const processor = getProcessor(receivedMessage, dbClient);
      processor.setMessage(receivedMessage);

      const object = processor.create();
      object.then((object) => {
        console.log(object);
      });
    } catch (e) {
      console.log(e);
    }
  }
  console.log("subscription closed");
};
