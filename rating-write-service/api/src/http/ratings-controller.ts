import {Rating} from "../entity/Rating";
import {PostgresDataSource} from "../data-source";

export class RatingsController {

    public async getRatingsForBoardGameId(boardGameId: string) {
        const repository = PostgresDataSource.getRepository(Rating);
        return await repository.findBy({objectId: boardGameId});
    }

    public async getRatingsForBoardGameIdAndUserId(boardGameId: string, userId: string) {
        const repository = PostgresDataSource.getRepository(Rating);
        return await repository.findBy({objectId: boardGameId, userId: userId});
    }

    public async getAllRatings() {
        const repository = PostgresDataSource.getRepository(Rating);
        return await repository.find();
    }
}
