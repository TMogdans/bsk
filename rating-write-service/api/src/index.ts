import { client } from "./pubsub/client";

client()
  .then(() => console.log("rating-write-service started"))
  .catch((err) => console.error(err));
