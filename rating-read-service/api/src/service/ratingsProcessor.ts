import { collect } from "collectionizejs";
import { RatingBody, RatingValue, SingleRating } from "../types/rating";

export class RatingsProcessor {
  private readonly ratingsCollection = collect([]);
  private readonly objectId: string = "";
  private datasets = collect([]);

  constructor(objectId: string, ratingsCollection: any) {
    this.ratingsCollection = ratingsCollection;
    this.objectId = objectId;

    this.process()
        .then(r => console.log(`Processed ratings for ${objectId}`))
        .catch(e => console.error(e.message, e.stack, e.name, e.toString()));
  }

  private async process() {
    this.ratingsCollection
        .pluck("userId")
        .unique()
        .forEach((userId: string) => {
      const userRatings = this.ratingsCollection.where("userId", userId);

      const ratings = userRatings.map((userRating: SingleRating) => {
        return {
          name: userRating.config.name,
          weight: userRating.config.weight,
          value: userRating.value,
          weighted:
            Math.round(userRating.value * userRating.config.weight * 100) / 100,
        } as RatingValue;
      });
      const weightedMax =
        Math.round(
          (ratings.reduce((acc, rating) => acc + rating.weight * 10, 0) /
            userRatings.count()) *
            100,
        ) / 100;
      const weightedTotal =
        Math.round(
          (ratings.reduce((acc, rating) => acc + rating.weighted, 0) /
            userRatings.count()) *
            100,
        ) / 100;
      const dataset = {
        userId: userId,
        objectId: this.objectId,
        createdAt: new Date().toISOString(),
        total:
          Math.round((userRatings.sum("value") / userRatings.count()) * 100) /
          100,
        weightedTotal: weightedTotal,
        normalizedTotal:
          Math.round(((weightedTotal * 10) / weightedMax) * 100) / 100,
        ratings: ratings.all(),
      } as RatingBody;

      this.datasets.add(dataset);
    });
  }

  public getDatasets() {
    return this.datasets;
  }
}
