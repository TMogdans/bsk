import { MechanicRepository } from "../repositories/mechanicRepository";
import { CreateMechanic, UpdateMechanic } from "../schemas/mechanicSchema";
import { createLogger } from "../utils/logger";

const logger = createLogger("mechanicService");

export class MechanicService {
    private mechanicRepository: MechanicRepository;

    constructor() {
        this.mechanicRepository = new MechanicRepository();
    }

    async getAllMechanics() {
        logger.info("Fetching all mechanics");
        return await this.mechanicRepository.findAll();
    }

    async getMechanicById(id: string) {
        logger.info(`Fetching mechanic with id ${id}`);
        return await this.mechanicRepository.findById(id);
    }

    async createMechanic(mechanic: CreateMechanic) {
        logger.info(`Creating mechanic with data ${JSON.stringify(mechanic)}`);

        // todo: publish mechanic created event

        return await this.mechanicRepository.create(mechanic);
    }

    async updateMechanic(id: string, mechanic: UpdateMechanic) {
        logger.info(`Updating mechanic with id ${id} and data ${JSON.stringify(mechanic)}`);

        // todo: publish mechanic updated event

        return await this.mechanicRepository.update(id, mechanic);
    }

    async deleteMechanic(id: string) {
        logger.info(`Deleting mechanic with id ${id}`);

        // todo: publish mechanic deleted event

        return await this.mechanicRepository.softDelete(id);
    }
}