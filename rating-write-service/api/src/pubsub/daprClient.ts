import { Config, RatingMessage } from "../types/rating";
import { object, string } from "yup";
import { RatingCreated } from "../generated/rating-created";
import { Prisma, PrismaClient } from "@prisma/client";
import { CommunicationProtocolEnum, DaprClient, DaprServer } from "@dapr/dapr";

const prisma = new PrismaClient();

const daprHost = "127.0.0.1";
const serverHost = "127.0.0.1";
const serverPort = "3000";

const ratingMessageSchema = object({
  meta: object({
    producer: string().required(),
    version: string().required(),
  }),
  payload: object({
    object_id: string().required(),
    user_id: string().required(),
    material_quality: string().required(),
    layout: string().required(),
    complexity: string().required(),
    difficulty: string().required(),
    fun: string().required(),
    variety: string().required(),
    replayability: string().required(),
  }),
});

const generateCreationData = (
  receivedMessage: RatingMessage,
  config: Config[],
): Prisma.RatingCreateManyInput => {
  const objectId = receivedMessage.payload.object_id;
  const userId = receivedMessage.payload.user_id;
  const { object_id, user_id, ...payload } = receivedMessage.payload;

  const configMap = new Map<string, Config>();
  for (const c of config) {
    configMap.set(c.name, c);
  }

  let creationArray = [];
  for (const [key, value] of Object.entries(payload)) {
    const result = configMap.get(key);
    if (result === undefined) {
      console.error(`Config not found for ${key}`);
      continue;
    }

    creationArray.push({
      configId: result.id,
      userId: userId,
      objectId: objectId,
      value: value,
    });
  }

  return creationArray as unknown as Prisma.RatingCreateManyInput;
};

export async function client() {
  const server = new DaprServer({
    serverHost,
    serverPort,
    communicationProtocol: CommunicationProtocolEnum.HTTP,
    clientOptions: {
      daprHost,
      daprPort: process.env.DAPR_HTTP_PORT || "3000",
    },
  });

  await server.pubsub.subscribe(
    "rating-pub-sub",
    "frontend",
    async (receivedMessage) => {
      if (receivedMessage.meta.version !== "1.0.0") {
        console.error("Unsupported version");
      }

      try {
        await ratingMessageSchema.validate(receivedMessage);
      } catch (e) {
        console.error(e);
      }

      console.log(`${JSON.stringify(receivedMessage.payload)}`);

      try {
        const config = await prisma.config.findMany();

        await prisma.rating.createMany({
          data: generateCreationData(receivedMessage, config),
        });

        console.log(`rating created`);

        const ratingCreated = RatingCreated.fromJSON({
          objectId: receivedMessage.payload.object_id,
          userId: receivedMessage.payload.user_id,
        });
        await sendRatingCreated(ratingCreated);
      } catch (e) {
        console.error(e);
      }
    },
  );
}

async function sendRatingCreated(message: RatingCreated) {
  const PUBSUB_NAME = "rating-pub-sub";
  const TOPIC_NAME = "ratings";
  const client = new DaprClient({
    daprHost,
    daprPort: process.env.DAPR_HTTP_PORT || "3000",
  });

  console.log("Published data: " + message);

  await client.pubsub.publish(PUBSUB_NAME, TOPIC_NAME, message);
}
