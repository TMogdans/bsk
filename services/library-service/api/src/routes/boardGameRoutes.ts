import { BoardGameController } from "../controllers/boardGameController";
import { Router } from "express";

const boardGameRoutes = Router();
const boardGameController = new BoardGameController();

boardGameRoutes.get("/boardgames", boardGameController.getBoardGames.bind(boardGameController));
boardGameRoutes.get("/boardgames/:id", boardGameController.getBoardGameById.bind(boardGameController));
boardGameRoutes.post("/boardgames", boardGameController.createBoardGame.bind(boardGameController));
boardGameRoutes.put("/boardgames/:id", boardGameController.updateBoardGame.bind(boardGameController));
boardGameRoutes.delete("/boardgames/:id", boardGameController.deleteBoardGame.bind(boardGameController));

export default boardGameRoutes;
