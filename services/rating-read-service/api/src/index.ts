import {MessageSubscriber} from "./service/observer/messageSubscriber";
import {IncomingMessageObserver} from "./service/observer/incomingMessageObserver";
import express from "express";
import {createClient} from "redis";
import RatingsController from "./http/ratingsController";

const messageSubscriber = new MessageSubscriber();
const incomingMessageObserver = new IncomingMessageObserver();
const app = express();
const port = process.env.PORT || 3002;
const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6378"
});
const ratingsController = new RatingsController(redisClient);

messageSubscriber.attach(incomingMessageObserver);
messageSubscriber.subscribeToMessageBus()
  .then(() => console.log("rating-read-service started"))
  .catch((err) => console.error(err));

app.get("/ratings/:boardGameId", (req, res) => {
    ratingsController.getRatingsByObjectId(req.params.boardGameId)
        .then((ratings) => res.send(ratings))
        .catch((err) => console.log(err));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
