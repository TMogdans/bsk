import { AwardService } from "../services/awardService";
import { createLogger } from "../utils/logger";
import { Request, Response, NextFunction } from "express";

const logger =createLogger('awardController');

export class AwardController {
    private awardService: AwardService;

    constructor() {
        this.awardService = new AwardService();
    }

    async createAward(req: Request, res: Response, next: NextFunction) {
        try {
            logger.debug({ body: req.body }, 'Creating new award');
            const award = await this.awardService.createAward(req.body);
            res.status(201).json(award);
        } catch (error) {
            next(error);
        }
    }

    async getAwards(_req: Request, res: Response, next: NextFunction) {
        try {
            logger.debug('Getting all awards');

            const awards = await this.awardService.getAllAwards();

            return res.status(200).json(awards);
        } catch (error) {
            next(error);
        }
    }

    async getAwardById(req: Request, res: Response, next: NextFunction) {
        try {
            logger.debug({ id: req.params.id }, 'Getting award by id');
            const award = await this.awardService.getAwardById(req.params.id);
            res.status(200).json(award);
        } catch (error) {
            next(error);
        }
    }

    async updateAward(req: Request, res: Response, next: NextFunction) {
        try {
            logger.debug({ id: req.params.id, body: req.body }, 'Updating award');
            const award = await this.awardService.updateAward(req.params.id, req.body);
            res.status(200).json(award);
        } catch (error) {
            next(error);
        }
    }

    async deleteAward(req: Request, res: Response, next: NextFunction) {
        try {
            logger.debug({ id: req.params.id }, 'Deleting award');
            await this.awardService.deleteAward(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}