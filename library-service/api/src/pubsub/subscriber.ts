import { connect, JSONCodec } from "nats";
import { BaseMessage, PersonMessage } from "../types/messages";
import { match } from "ts-pattern";
import { PrismaClient } from "@prisma/client";
import personProcessor from "../services/personProcessor";

const natsServer = process.env.NATS_SERVER || "localhost:4222";

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

    match(receivedMessage)
      .with({ message: "person-provided", meta: { version: "1.0.0" } }, () => {
        console.log("person-provided message received");
        const processor = new personProcessor(dbClient);

        try {
          processor.setMessage(receivedMessage as PersonMessage).validate();
        } catch (e) {
          console.log(e);
        }

        const person = processor.persist();
        person.then((person) => {
            console.log(person);
        });
      })
      .with({ message: "category-provided", meta: { version: "1.0.0" } }, () =>
        console.log("category-provided message received"),
      )
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
      )
      .otherwise(() => {
        console.log("UnsupportedMessage");
      });
  }
  console.log("subscription closed");
};
