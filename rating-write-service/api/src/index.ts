import "reflect-metadata";
import express from "express";
import {client} from "./pubsub/client";
import {getAllRatings, getRatingsForBoardGameId, getRatingsForBoardGameIdAndUserId} from "./http/ratings-controller";

const app = express();
const port = process.env.PORT || 3000;

console.log(process.env.DB_PASSWORD);

client()
  .then(() => console.log("rating-write-service started"))
  .catch((err) => console.error(err));

app.get("/ratings/all", (req, res) => {
  getAllRatings()
    .then((ratings) => res.send(ratings))
    .catch((err) => console.log(err));
});

app.get("/ratings/:boardGameId", (req, res) => {
  getRatingsForBoardGameId(req.params.boardGameId)
    .then((ratings) => res.send(ratings))
    .catch((err) => console.log(err));
});

app.get("/ratings/:boardGameId/:userId", (req, res) => {
  getRatingsForBoardGameIdAndUserId(req.params.boardGameId, req.params.userId)
    .then((ratings) => res.send(ratings))
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
