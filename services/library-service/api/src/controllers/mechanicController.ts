import { MechanicService } from "../services/mechanicService";
import { createLogger } from "../utils/logger";
import { Request, Response, NextFunction } from "express";

const logger = createLogger("mechanicController");

export class MechanicController {
    private mechanicService: MechanicService;

    constructor() {
        this.mechanicService = new MechanicService();
    }

    async createMechanic(req: Request, res: Response, next: NextFunction) {
        try {
            logger.debug(`Creating mechanic with data ${JSON.stringify(req.body)}`);
            const mechanic = await this.mechanicService.createMechanic(req.body);
            res.status(201).json(mechanic);
        } catch (error) {
            next(error);
        }
    }

    async getMechanics(req: Request, res: Response, next: NextFunction) {
        try {
            logger.debug("Fetching all mechanics");
            const mechanics = await this.mechanicService.getAllMechanics();
            res.status(200).json(mechanics);
        } catch (error) {
            next(error);
        }
    }

    async getMechanicById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            logger.debug(`Fetching mechanic with id ${id}`);
            const mechanic = await this.mechanicService.getMechanicById(id);
            res.status(200).json(mechanic);
        } catch (error) {
            next(error);
        }
    }

    async updateMechanic(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            logger.debug(`Updating mechanic with id ${id}`);
            const mechanic = await this.mechanicService.updateMechanic(id, req.body);
            res.status(200).json(mechanic);
        } catch (error) {
            next(error);
        }
    }

    async deleteMechanic(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            logger.debug(`Deleting mechanic with id ${id}`);
            await this.mechanicService.deleteMechanic(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}