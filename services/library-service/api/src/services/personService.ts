import { PersonRepository } from "../repositories/personRepository";
import { CreatePerson, UpdatePerson } from "../schemas/personSchema";
import { createLogger } from "../utils/logger";

const logger = createLogger("personService");

export class PersonService {
    private personRepository: PersonRepository;

    constructor() {
        this.personRepository = new PersonRepository();
    }

    async getAllPersons() {
        logger.info("Fetching all persons");
        return await this.personRepository.findAll();
    }

    async getPersonById(id: string) {
        logger.info(`Fetching person with id ${id}`);
        return await this.personRepository.findById(id);
    }

    async createPerson(person: CreatePerson) {
        logger.info(`Creating person with data ${JSON.stringify(person)}`);

        // todo: publish person created event

        return await this.personRepository.create(person);
    }

    async updatePerson(id: string, person: UpdatePerson) {
        logger.info(`Updating person with id ${id} and data ${JSON.stringify(person)}`);

        // todo: publish person updated event

        return await this.personRepository.update(id, person);
    }

    async deletePerson(id: string) {
        logger.info(`Deleting person with id ${id}`);

        // todo: publish person deleted event

        return await this.personRepository.softDelete(id);
    }
}