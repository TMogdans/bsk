import { CategoryController } from "../controllers/categoryController";
import { Router } from "express";

const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.get("/categories", categoryController.getCategories.bind(categoryController));
categoryRoutes.get("/categories/:id", categoryController.getCategoryById.bind(categoryController));
categoryRoutes.post("/categories", categoryController.createCategory.bind(categoryController));
categoryRoutes.put("/categories/:id", categoryController.updateCategory.bind(categoryController));
categoryRoutes.delete("/categories/:id", categoryController.deleteCategory.bind(categoryController));

export default categoryRoutes;