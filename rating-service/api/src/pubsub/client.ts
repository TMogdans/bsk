import { RatingMessage, Config } from "../types/rating";
import { connect, JSONCodec } from "nats";
import { PrismaClient, Prisma } from "@prisma/client";
import { object, string } from "yup";
import { RatingCreated } from "../generated/rating-created";

const natsServer = process.env.NATS_SERVER || "nats:4222";
const prisma = new PrismaClient();

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
export const natsClient = async () => {
  const nc = await connect({ servers: natsServer });
  const codec = JSONCodec();
  const subject = "frontend";
  const sub = nc.subscribe(subject);

  for await (const m of sub) {
    const receivedMessage = codec.decode(m.data) as unknown as RatingMessage;

    if (receivedMessage.meta.version !== "1.0.0") {
      console.error("Unsupported version");
      continue;
    }

    try {
      await ratingMessageSchema.validate(receivedMessage);
    } catch (e) {
      console.error(e);
      continue;
    }

    console.log(
      `[${sub.getProcessed()}]: ${JSON.stringify(receivedMessage.payload)}`,
    );

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
      const bytes = RatingCreated.encode(ratingCreated).finish();

        nc.publish("ratings", bytes);
    } catch (e) {
      console.error(e);
    }
  }
  console.log("subscription closed");
};
