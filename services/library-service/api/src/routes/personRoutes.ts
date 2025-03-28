import { PersonController } from "../controllers/personController";
import { Router } from "express";

const personRoutes = Router();
const personController = new PersonController();

personRoutes.get("/persons", personController.getPersons.bind(personController));
personRoutes.get("/persons/:id", personController.getPersonById.bind(personController));
personRoutes.post("/persons", personController.createPerson.bind(personController));
personRoutes.put("/persons/:id", personController.updatePerson.bind(personController));
personRoutes.delete("/persons/:id", personController.deletePerson.bind(personController));

export default personRoutes;