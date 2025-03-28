import { PublisherService } from "../services/publisherService";
import { createLogger } from "../utils/logger";
import { Request, Response, NextFunction } from "express";

const logger = createLogger("PublisherController");

export class PublisherController {
    private publisherService: PublisherService;

    constructor() {
        this.publisherService = new PublisherService();
    }
    async createPublisher(req: Request, res: Response, next: NextFunction) {
        try {
            logger.debug(`Creating publisher with data ${JSON.stringify(req.body)}`);
            const publisher = await this.publisherService.createPublisher(req.body);
            res.status(201).json(publisher);
        } catch (error) {
            next(error);
        }
    }
    async getPublishers(req: Request, res: Response, next: NextFunction) {
        try {
            logger.debug("Fetching all publishers");
            const publishers = await this.publisherService.getAllPublishers();
            res.status(200).json(publishers);
        } catch (error) {
            next(error);
        }
    }
    async getPublisherById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            logger.debug(`Fetching publisher with id ${id}`);
            const publisher = await this.publisherService.getPublisherById(id);
            res.status(200).json(publisher);
        } catch (error) {
            next(error);
        }
    }
    async updatePublisher(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            logger.debug(`Updating publisher with id ${id}`);
            const publisher = await this.publisherService.updatePublisher(id, req.body);
            res.status(200).json(publisher);
        } catch (error) {
            next(error);
        }
    }
    async deletePublisher(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            logger.debug(`Deleting publisher with id ${id}`);
            await this.publisherService.deletePublisher(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}