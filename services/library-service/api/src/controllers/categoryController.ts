import { CategoryService } from "../services/categoryService";
import { createLogger } from "../utils/logger";
import { Request, Response, NextFunction } from "express";

const logger = createLogger('categoryController');

export class CategoryController {
    private categoryService: CategoryService;
    
    constructor() {
        this.categoryService = new CategoryService();
    }

    async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            logger.debug({ body: req.body }, 'Creating new category');
            const category = await this.categoryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    }

    async getCategories(req: Request, res: Response, next: NextFunction) {
        try {
            logger.debug('Fetching all categories');
            const categories = await this.categoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }

    async getCategoryById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            logger.debug(`Fetching category with id ${id}`);
            const category = await this.categoryService.getCategoryById(id);
            res.status(200).json(category);
        } catch (error) {
            next(error);
        }
    }

    async updateCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            logger.debug(`Updating category with id ${id}`);
            const category = await this.categoryService.updateCategory(id, req.body);
            res.status(200).json(category);
        } catch (error) {
            next(error);
        }
    }

    async deleteCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            logger.debug(`Deleting category with id ${id}`);
            await this.categoryService.deleteCategory(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}