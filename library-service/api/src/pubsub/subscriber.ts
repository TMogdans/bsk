import { connect, JSONCodec } from "nats";
import { BaseMessage } from "../types/messages";
import { match } from "ts-pattern";
import { PrismaClient } from "@prisma/client";
import personProcessor from "../services/personProcessor";
import categoryProcessor from "../services/categoryProcessor";
import { ProcessorInterface } from "../services/processorInterface";
import mechanicProcessor from "../services/mechanicProcessor";
import awardProcessor from "../services/awardProcessor";
import publisherProcessor from "../services/publischerProcessor";
import boardgameProcessor from "../services/boardgameProcessor";

const natsServer = process.env.NATS_SERVER || "localhost:4222";

function getProcessor(
  receivedMessage: BaseMessage,
  dbClient: PrismaClient,
): ProcessorInterface {
  match(receivedMessage)
    .with(
      { message: "person-provided", meta: { version: "1.0.0" } },
      () => new personProcessor(dbClient),
    )
    .with(
      { message: "category-provided", meta: { version: "1.0.0" } },
      () => new categoryProcessor(dbClient),
    )
    .with(
      { message: "mechanic-provided", meta: { version: "1.0.0" } },
      () => new mechanicProcessor(dbClient),
    )
    .with(
      { message: "award-provided", meta: { version: "1.0.0" } },
      () => new awardProcessor(dbClient),
    )
    .with(
      { message: "publisher-provided", meta: { version: "1.0.0" } },
      () => new publisherProcessor(dbClient),
    )
    .with(
      { message: "boardgame-provided", meta: { version: "1.0.0" } },
      () => new boardgameProcessor(dbClient),
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
