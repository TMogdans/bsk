import { RedisClientType } from "redis";
import {collect} from "collectionizejs";

export default class RatingsController {
  private redisClient: RedisClientType;

  constructor(redisClient: any) {
    this.redisClient = redisClient;
  }

  public async getRatingsByObjectId(objectId: string) {
    this.redisClient.on("error", (err) => console.error(err));

    return this.redisClient
      .connect()
      .then(async () => {
        console.log("connected to redis");
        try {
          const ratings = await this.redisClient.lRange(objectId, 0, -1);
          const ratingsCollection = collect(ratings);

          return ratingsCollection.map((rating) => JSON.parse(rating));
        } catch (err) {
           console.error(err);
        }
      })
      .catch((err) => console.error(err));
  }
}
