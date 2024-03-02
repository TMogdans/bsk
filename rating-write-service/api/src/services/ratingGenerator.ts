import {Config, RatingMessage} from "../types/rating";
import {collect} from "collectionizejs";

export default class RatingGenerator {
  private receivedMessage: RatingMessage;
  private readonly config: Config[];
  private dbDatasets = collect();
  private ratings = collect();
  private configMap = new Map<string, Config>();

  constructor(receivedMessage: RatingMessage, config: Config[]) {
    this.receivedMessage = receivedMessage;
    this.config = config;

    this.createConfigMap();
    this.processMessageForDB();
    this.processMessageForEvent();
  }

  private processMessageForDB() {
    const { objectId, userId } = this.extractObjectInformation();
    const { object_id, user_id, ...payload } = this.receivedMessage.payload;

      for (const [key, value] of Object.entries(payload)) {
        const result = this.configMap.get(key);
        if (result === undefined) {
          console.error(`Config not found for ${key}`);
          continue;
        }

        this.dbDatasets.add({
          configId: result.id,
          userId: userId,
          objectId: objectId,
          value: value,
        });
      }
  }

  private createConfigMap() {
    for (const c of this.config) {
      this.configMap.set(c.name, c);
    }
  }

  private extractObjectInformation() {
    const objectId = this.receivedMessage.payload.object_id;
    const userId = this.receivedMessage.payload.user_id;

    return { objectId, userId };
  }

  private processMessageForEvent() {
      const { object_id, user_id, ...payload } = this.receivedMessage.payload;

      for (const [key, value] of Object.entries(payload)) {
          const result = this.configMap.get(key);
          if (result === undefined) {
              console.error(`Config not found for ${key}`);
              continue;
          }

          this.ratings.add({
              value,
              weight: result.weight,
              name: result.name,
          })
      }
  }

  public getDatasets() {
    return this.dbDatasets;
  }

  public getRatings() {
      return this.ratings;
  }
}
