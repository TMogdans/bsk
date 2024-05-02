import {connect, JSONCodec} from "nats";
import {BaseMessage} from "../types/messages";
import PersonProcessor from "../services/personProcessor";
import CategoryProcessor from "../services/categoryProcessor";
import {ProcessorInterface} from "../services/processorInterface";
import MechanicProcessor from "../services/mechanicProcessor";
import AwardProcessor from "../services/awardProcessor";
import PublisherProcessor from "../services/publischerProcessor";
import BoardgameProcessor from "../services/boardgameProcessor";

const natsServer = process.env.NATS_SERVER || "localhost:4222";

function getProcessor(receivedMessage: BaseMessage): ProcessorInterface {
  const processorMap = new Map<string, ProcessorInterface>([
    ["person-provided", new PersonProcessor()],
    ["category-provided", new CategoryProcessor()],
    ["mechanic-provided", new MechanicProcessor()],
    ["award-provided", new AwardProcessor()],
    ["publisher-provided", new PublisherProcessor()],
    ["boardgame-provided", new BoardgameProcessor()],
  ]);

  const processor = processorMap.get(receivedMessage.message);

  if (processor === undefined) {
    throw new Error("No processor found for message");
  }

  return processor;
}

export const subscriber = async () => {
  const nc = await connect({ servers: natsServer });
  const codec = JSONCodec();
  const subject = "events";
  const subscription = nc.subscribe(subject);
  console.log(`Subscribed to ${subject}`);

  for await (const m of subscription) {
    const receivedMessage = codec.decode(m.data) as unknown as BaseMessage;

    console.log(
      `[${subscription.getProcessed()}]: ${JSON.stringify(receivedMessage)}`,
    );

    try {
      const processor = getProcessor(receivedMessage);
      processor.setMessage(receivedMessage).then(() => {
        const object = processor.create();
        object.then((object) => {
          console.log(object);
        });
      });
    } catch (e) {
      console.log(e);
    }
  }
  console.log("subscription closed");
};
