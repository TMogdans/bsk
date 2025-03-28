import { AwardRepository } from "../repositories/awardRepository";
import { createLogger } from "../utils/logger";
import { CreateAward, UpdateAward } from '../schemas/awardSchema';
import { MessagingService } from "./messagingService";

const logger = createLogger('AwardService');

export class AwardService {
	private awardRepository: AwardRepository;
    private messagingService: MessagingService;
	
    constructor() {
        this.awardRepository = new AwardRepository();
        this.messagingService = new MessagingService();
    }

    async getAllAwards() {
        logger.debug('Getting all awards');
        return await this.awardRepository.findAll();
    }

    async getAwardById(id: string) {
        logger.debug(`Getting award with id ${id}`);
        return await this.awardRepository.findById(id);
    }

    async createAward(award: CreateAward) {
        logger.debug(`Creating award with data ${JSON.stringify(award)}`);

        // todo: publish award created event

        return await this.awardRepository.create(award);
    }

    async updateAward(id: string, award: UpdateAward) {
        logger.debug(`Updating award with id ${id} and data ${JSON.stringify(award)}`);
        // todo: publish award updated event
        return await this.awardRepository.update(id, award);
    }

    async deleteAward(id: string) {
        logger.debug(`Deleting award with id ${id}`);
        // todo: publish award deleted event
        return await this.awardRepository.softDelete(id);
    }
}