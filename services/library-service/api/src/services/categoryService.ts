import { CategoryRepository } from "../repositories/categoryRepository";
import { CreateCategory, UpdateCategory } from "../schemas/categorySchema";
import { createLogger } from "../utils/logger";

const logger = createLogger("categoryService");

export class CategoryService {
    private categoryRepository: CategoryRepository;

    constructor() {
        this.categoryRepository = new CategoryRepository();
    }

    async getAllCategories() {
        logger.info("Fetching all categories");
        return await this.categoryRepository.findAll();
    }

    async getCategoryById(id: string) {
        logger.info(`Fetching category with id ${id}`);
        return await this.categoryRepository.findById(id);
    }

    async createCategory(category: CreateCategory) {
        logger.info(`Creating category with data ${JSON.stringify(category)}`);

        // todo: publish category created event

        return await this.categoryRepository.create(category);
    }

    async updateCategory(id: string, category: UpdateCategory) {
        logger.info(`Updating category with id ${id} and data ${JSON.stringify(category)}`);

        // todo: publish category updated event

        return await this.categoryRepository.update(id, category);
    }

    async deleteCategory(id: string) {
        logger.info(`Deleting category with id ${id}`);

        // todo: publish category deleted event

        return await this.categoryRepository.softDelete(id);
    }
}