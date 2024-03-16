import { subscriber } from "./pubsub/subscriber";

console.log("Hallo, ich bin der BoardGame-Service");

subscriber()
  .then(() => console.log("started"))
  .catch((e) => {
    console.error(e);
  });
