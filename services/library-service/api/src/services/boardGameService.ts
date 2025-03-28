import { BoardGameRepository } from "../repositories/boardGameRepository";
import { CreateBoardGame, UpdateBoardGame } from "../schemas/boardGameSchema";
import { createLogger } from "../utils/logger";

const logger = createLogger("boardGameService");

export class BoardGameService {
    private boardGameRepository: BoardGameRepository;

    constructor() {
        this.boardGameRepository = new BoardGameRepository();
    }

    async getAllBoardGames() {
        logger.info("Fetching all board games");
        return await this.boardGameRepository.findAll();
    }

    async getBoardGameById(id: string) {
        logger.info(`Fetching board game with id ${id}`);
        return await this.boardGameRepository.findById(id);
    }

    async createBoardGame(boardGame: CreateBoardGame) {
        logger.info(`Creating board game with data ${JSON.stringify(boardGame)}`);
        return await this.boardGameRepository.create(boardGame);
    }

    async updateBoardGame(id: string, boardGame: UpdateBoardGame) {
        logger.info(`Updating board game with id ${id} and data ${JSON.stringify(boardGame)}`);
        return await this.boardGameRepository.update(id, boardGame);
    }

    async deleteBoardGame(id: string) {
        logger.info(`Deleting board game with id ${id}`);
        return await this.boardGameRepository.softDelete(id);
    }
}