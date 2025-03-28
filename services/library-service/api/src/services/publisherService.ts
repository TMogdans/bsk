import { PublisherRepository } from "../repositories/publisherRepository";
import { CreatePublisher, UpdatePublisher } from "../schemas/publisherSchema";
import { createLogger } from "../utils/logger";

const logger = createLogger("publisherService");

export class PublisherService {
    private publisherRepository: PublisherRepository;

    constructor() {
        this.publisherRepository = new PublisherRepository();
    }

    async getAllPublishers() {
        logger.info("Fetching all awards");
        return await this.publisherRepository.findAll();
    }

    async getPublisherById(id: string) {
        logger.info(`Fetching award with id ${id}`);
        return await this.publisherRepository.findById(id);
    }

    async createPublisher(data: CreatePublisher) {
        logger.info("Creating new award");

        // todo: publish publisher created event

        return await this.publisherRepository.create(data);
    }

    async updatePublisher(id: string, data: UpdatePublisher) {
        logger.info(`Updating award with id ${id}`);

        // todo: publish publisher updated event

        return await this.publisherRepository.update(id, data);
    }

    async deletePublisher(id: string) {
        logger.info(`Soft deleting award with id ${id}`);

        // todo: publish publisher deleted event

        return await this.publisherRepository.softDelete(id);
    }
}