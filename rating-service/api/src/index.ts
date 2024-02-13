import express, { Request, Response } from "express";
import { client } from "./pubsub/daprClient";

const app = express();
const port = process.env.PORT || 3000;

client().then(() => console.log("dapr client started"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, rating-service! 11515");
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
