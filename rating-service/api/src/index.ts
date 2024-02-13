import { client } from "./pubsub/daprClient";

client()
  .then(() => console.log("rating-write-service started"))
  .catch((err) => console.error(err));
