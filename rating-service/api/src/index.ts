import express, { Request, Response } from "express";
import { natsClient } from "./pubsub/client.js";

const app = express();
const port = process.env.PORT || 3000;

natsClient().then(() => console.log("NATS client started"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, rating-service! 11515");
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
