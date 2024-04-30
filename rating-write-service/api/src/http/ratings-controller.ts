import {Rating} from "../entity/Rating";

export const getRatingsForBoardGameId = async (boardGameId: string) => {
    return await Rating.findBy({objectId: boardGameId});
};

export const getRatingsForBoardGameIdAndUserId = async (boardGameId: string, userId: string) => {
    return await Rating.findBy({objectId: boardGameId, userId: userId});
}

export const getAllRatings = async () => {
    return await Rating.find();
};
