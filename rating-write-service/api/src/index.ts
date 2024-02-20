import express from "express";
import { client } from "./pubsub/client";
import { getRatingsForBoardGameId } from "./http/ratings-controller";

const app = express();
const port = process.env.PORT || 3000;

client()
  .then(() => console.log("rating-write-service started"))
  .catch((err) => console.error(err));

app.get("/ratings/:boardGameId", (req, res) => {
  getRatingsForBoardGameId(req.params.boardGameId)
    .then((ratings) => res.send(ratings))
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
