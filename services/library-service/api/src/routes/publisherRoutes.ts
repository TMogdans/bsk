import { PublisherController } from "../controllers/publisherController";
import { Router } from "express";

const publisherRoutes = Router();
const publisherController = new PublisherController();

publisherRoutes.get("/publishers", publisherController.getPublishers.bind(publisherController));
publisherRoutes.get("/publishers/:id", publisherController.getPublisherById.bind(publisherController));
publisherRoutes.post("/publishers", publisherController.createPublisher.bind(publisherController));
publisherRoutes.put("/publishers/:id", publisherController.updatePublisher.bind(publisherController));
publisherRoutes.delete("/publishers/:id", publisherController.deletePublisher.bind(publisherController));

export default publisherRoutes;