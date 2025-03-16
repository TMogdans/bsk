import { MessageSubscriber } from "./messageSubscriber";
import { RatingsProcessor } from "../ratingsProcessor";
import { createClient } from "redis";

export class IncomingMessageObserver implements Observer {
  public update(subject: Subscriber) {
    if (subject instanceof MessageSubscriber) {
      const ratingsProcessor = new RatingsProcessor(subject);
      const dataset = ratingsProcessor.getDataset();

      console.log(JSON.stringify(dataset));

      // persist in db (update or insert)
      const client = createClient({
          url: process.env.REDIS_URL || "redis://localhost:6378"
      });
      client.on("error", (err) => console.error(err));
      client
        .connect()
        .then(() => {
          client.lPush(`${dataset.objectId}`, JSON.stringify(dataset))
            .then(() => {
              console.log("dataset persisted");
              client.quit()
                  .then(() => console.log("client quit"))
                  .catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    }
  }
}
