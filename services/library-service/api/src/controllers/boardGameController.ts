import { BoardGameService } from "../services/boardGameService";
import { createLogger } from "../utils/logger";
import { Request, Response, NextFunction } from "express";

const logger = createLogger("BoardGameController");

export class BoardGameController {
		private boardGameService: BoardGameService;

		constructor() {
			this.boardGameService = new BoardGameService();
		}

		async createBoardGame(req: Request, res: Response, next: NextFunction){
            try {
                logger.debug({ body: req.body }, 'Creating new board game');
                const boardGame = await this.boardGameService.createBoardGame(req.body);
                res.status(201).json(boardGame);
            } catch (error) {
                next(error);
            }
        }

        async getBoardGames(req: Request, res: Response, next: NextFunction){
            try {
                logger.debug('Fetching all board games');
                const boardGames = await this.boardGameService.getAllBoardGames();
                res.status(200).json(boardGames);
            } catch (error) {
                next(error);
            }
        }

        async getBoardGameById(req: Request, res: Response, next: NextFunction){
            try {
                logger.debug({ params: req.params }, 'Fetching board game by id');
                const boardGame = await this.boardGameService.getBoardGameById(req.params.id);
                res.status(200).json(boardGame);
            } catch (error) {
                next(error);
            }
        }

        async updateBoardGame(req: Request, res: Response, next: NextFunction){
            try {
                logger.debug({ params: req.params, body: req.body }, 'Updating board game');
                const boardGame = await this.boardGameService.updateBoardGame(req.params.id, req.body);
                res.status(200).json(boardGame);
            } catch (error) {
                next(error);
            }
        }

        async deleteBoardGame(req: Request, res: Response, next: NextFunction){
            try {
                logger.debug({ params: req.params }, 'Deleting board game');
                await this.boardGameService.deleteBoardGame(req.params.id);
                res.status(204).send();
            } catch (error) {
                next(error);
            }
        }
	}