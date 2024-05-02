import "reflect-metadata";
import express from "express";
import {client} from "./pubsub/client";
import {RatingsController} from "./http/ratings-controller";

const app = express();
const port = process.env.PORT || 3000;

client()
    .then(() => console.log("rating-write-service started"))
    .catch((err) => console.error(err));

const ratingsController = new RatingsController();

app.get("/ratings/all", (req, res) => {
    ratingsController.getAllRatings()
        .then((ratings) => res.send(ratings))
        .catch((err) => console.error(err));
});

app.get("/ratings/:boardGameId", (req, res) => {
    ratingsController.getRatingsForBoardGameId(req.params.boardGameId)
        .then((ratings) => res.send(ratings))
        .catch((err) => console.error(err));
});

app.get("/ratings/:boardGameId/:userId", (req, res) => {
    ratingsController.getRatingsForBoardGameIdAndUserId(req.params.boardGameId, req.params.userId)
        .then((ratings) => res.send(ratings))
        .catch((err) => console.error(err));
});

app.listen(port, () => {
    console.info(`Server is running on port ${port}`);
});
