import { PersonService } from "../services/personService";
import { createLogger } from "../utils/logger";
import { Request, Response, NextFunction } from "express";


const logger = createLogger("PersonController");

export class PersonController {
    private personService: PersonService;

    constructor() {
        this.personService = new PersonService();
    }

    async createPerson(req: Request, res: Response, next: NextFunction) {
        try {
            logger.debug(`Creating person with data ${JSON.stringify(req.body)}`);
            const person = await this.personService.createPerson(req.body);
            res.status(201).json(person);
        } catch (error) {
            next(error);
        }
    }

    async getPersons(req: Request, res: Response, next: NextFunction) {
        try {
            logger.debug("Fetching all persons");
            const persons = await this.personService.getAllPersons();
            res.status(200).json(persons);
        } catch (error) {
            next(error);
        }
    }

    async getPersonById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            logger.debug(`Fetching person with id ${id}`);
            const person = await this.personService.getPersonById(id);
            res.status(200).json(person);
        } catch (error) {
            next(error);
        }
    }

    async updatePerson(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            logger.debug(`Updating person with id ${id}`);
            const person = await this.personService.updatePerson(id, req.body);
            res.status(200).json(person);
        } catch (error) {
            next(error);
        }
    }

    async deletePerson(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            logger.debug(`Deleting person with id ${id}`);
            await this.personService.deletePerson(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
