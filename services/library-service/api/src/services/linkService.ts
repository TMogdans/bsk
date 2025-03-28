import { LinkRepository } from "../repositories/linkRepository";
import { CreateLink, UpdateLink } from "../schemas/linkSchema";
import { createLogger } from "../utils/logger";

const logger = createLogger("linkService");

export class LinkService {
    private linkRepository: LinkRepository;

    constructor() {
        this.linkRepository = new LinkRepository();
    }

    async getAllLinks() {
        logger.debug("Getting all links");
        return await this.linkRepository.findAll();
    }

    async getLinkById(id: string) {
        logger.debug(`Getting link with id ${id}`);
        return await this.linkRepository.findById(id);
    }

    async createLink(link: CreateLink) {
        logger.debug("Creating link");

        // todo: publish link created event

        return await this.linkRepository.create(link);
    }

    async updateLink(id: string, link: UpdateLink) {
        logger.debug(`Updating link with id ${id}`);

        // todo: publish link updated event

        return await this.linkRepository.update(id, link);
    }

    async deleteLink(id: string) {
        logger.debug(`Soft deleting link with id ${id}`);

        // todo: publish link deleted event

        return await this.linkRepository.softDelete(id);
    }
}