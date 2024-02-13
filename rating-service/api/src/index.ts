import { client } from "./pubsub/daprClient";

client().then(() => console.log("dapr client started"));
