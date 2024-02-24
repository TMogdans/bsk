import { client } from "./pubsub/client";

client()
  .then(() => console.log("rating-read-service started"))
  .catch((err) => console.error(err));
