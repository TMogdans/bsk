import { collect } from "collectionizejs";
import { RatingDataset } from "../types/rating";
import { Ratings } from "../types/messages";
import {MessageSubscriber} from "./observer/messageSubscriber";

export class RatingsProcessor {
  private readonly ratingsCollection = collect([]);
  private readonly objectId: string = "";
  private readonly userId: string = "";
  private dataset = {} as RatingDataset;

  constructor(subscriber: MessageSubscriber) {
    this.ratingsCollection = subscriber.ratingsCollection;
    this.objectId = subscriber.objectId;
    this.userId = subscriber.userId;

    this.process()
      .then(() =>
        console.log(`Processed ratings for ${this.objectId} and user ${this.userId}`),
      )
      .catch((e) => console.error(e.message, e.stack, e.name, e.toString()));
  }

  private async process() {
    const ratings = this.ratingsCollection.map((rating: Ratings) => {
      return {
        name: rating.name,
        weight: rating.weight,
        value: rating.value,
        weighted: Math.round(rating.value * rating.weight * 100) / 100,
      };
    });

    const weightedMax =
      Math.round(
        (ratings.reduce((acc, rating) => acc + rating.weight * 10, 0) /
          this.ratingsCollection.count()) *
          100,
      ) / 100;
    const weightedTotal =
      Math.round(
        (ratings.reduce((acc, rating) => acc + rating.weighted, 0) /
          this.ratingsCollection.count()) *
          100,
      ) / 100;

    this.dataset = {
      userId: this.userId,
      objectId: this.objectId,
      createdAt: new Date().toISOString(),
      total:
        Math.round(
          (this.ratingsCollection.sum("value") /
            this.ratingsCollection.count()) *
            100,
        ) / 100,
      weightedTotal: weightedTotal,
      normalizedTotal:
        Math.round(((weightedTotal * 10) / weightedMax) * 100) / 100,
      ratings: ratings.all(),
    } as RatingDataset;
  }

  public getDataset() {
    return this.dataset;
  }
}
