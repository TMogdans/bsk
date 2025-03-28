import { MechanicController } from "../controllers/mechanicController";
import { Router } from "express";

const mechanicRoutes = Router();
const mechanicController = new MechanicController();

mechanicRoutes.get("/mechanics", mechanicController.getMechanics.bind(mechanicController));
mechanicRoutes.get("/mechanics/:id", mechanicController.getMechanicById.bind(mechanicController));
mechanicRoutes.post("/mechanics", mechanicController.createMechanic.bind(mechanicController));
mechanicRoutes.put("/mechanics/:id", mechanicController.updateMechanic.bind(mechanicController));
mechanicRoutes.delete("/mechanics/:id", mechanicController.deleteMechanic.bind(mechanicController));

export default mechanicRoutes;