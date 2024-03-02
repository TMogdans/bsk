import { RatingMessage } from "../types/rating";
import { connect, JSONCodec } from "nats";
import { object, string } from "yup";
import { Prisma, PrismaClient } from "@prisma/client";
import RatingGenerator from "../services/ratingGenerator";

const natsServer = process.env.NATS_SERVER || "nats:4222";
const prisma = new PrismaClient();

const ratingMessageSchema = object({
  message: string().required(),
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

export const client = async () => {
  const nc = await connect({ servers: natsServer });
  const codec = JSONCodec();
  const subject = "frontend";
  const sub = nc.subscribe(subject);

  for await (const m of sub) {
    const receivedMessage = codec.decode(m.data) as unknown as RatingMessage;

    if (
      receivedMessage.meta.version !== "1.0.0" ||
      receivedMessage.message !== "rating-received"
    ) {
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
      const ratingGenerator = new RatingGenerator(receivedMessage, config);

      await prisma.rating
        .createMany({
          data: ratingGenerator.getDatasets().all() as unknown as Prisma.RatingCreateManyInput[],
        })
        .then((result) => {
          console.log(`rating created`);
          console.log(result);

          nc.publish(
            "ratings",
            codec.encode({
              message: "rating-created",
              meta: {
                producer: process.env.APP_NAME || "rating-write-service",
                version: "1.0.0",
              },
              payload: {
                object_id: receivedMessage.payload.object_id,
                user_id: receivedMessage.payload.user_id,
                data: ratingGenerator.getRatings().all(),
              },
            }),
          );
        });
    } catch (e) {
      console.error(e);
    }
  }
  console.log("subscription closed");
};
